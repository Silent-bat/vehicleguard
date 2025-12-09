"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-server"

export async function getUsers() {
  try {
    await requireAdmin()
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true,
        approvedAt: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            vehicles: true,
            theftCases: true,
          },
        },
      },
    })
    return { success: true, data: users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Erreur lors de la récupération des utilisateurs" }
  }
}

export async function approveUser(userId: string) {
  try {
    const admin = await requireAdmin()
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        approvedById: admin.id,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: admin.id,
        action: "APPROVE_USER",
        entityType: "User",
        entityId: userId,
        details: `Approved user ${user.email}`,
      },
    })

    revalidatePath("/admin/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error approving user:", error)
    return { success: false, error: "Erreur lors de l'approbation de l'utilisateur" }
  }
}

export async function rejectUser(userId: string) {
  try {
    const admin = await requireAdmin()
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" }
    }

    // Log activity before deletion
    await prisma.activity.create({
      data: {
        userId: admin.id,
        action: "REJECT_USER",
        entityType: "User",
        entityId: userId,
        details: `Rejected and deleted user ${user.email}`,
      },
    })

    // Delete user and all related data
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error rejecting user:", error)
    return { success: false, error: "Erreur lors du rejet de l'utilisateur" }
  }
}

export async function toggleUserRole(userId: string) {
  try {
    const admin = await requireAdmin()
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true },
    })

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" }
    }

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: admin.id,
        action: "CHANGE_USER_ROLE",
        entityType: "User",
        entityId: userId,
        details: `Changed ${user.email} role from ${user.role} to ${newRole}`,
      },
    })

    revalidatePath("/admin/users")
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error toggling user role:", error)
    return { success: false, error: "Erreur lors du changement de rôle" }
  }
}

export async function createUser(data: {
  email: string
  password: string
  name: string
  role: "USER" | "ADMIN"
  isApproved?: boolean
}) {
  try {
    const admin = await requireAdmin()
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: false, error: "Cet email est déjà utilisé" }
    }

    // Create user through Better Auth API
    const response = await fetch(`${process.env.BETTER_AUTH_URL || "http://localhost:3001"}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    })

    if (!response.ok) {
      return { success: false, error: "Erreur lors de la création du compte" }
    }

    const result = await response.json()
    const userId = result.user.id

    // Update user with role and approval status
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: data.role,
        isApproved: data.isApproved !== false, // Default to true for admin-created users
        approvedAt: data.isApproved !== false ? new Date() : null,
        approvedById: data.isApproved !== false ? admin.id : null,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: admin.id,
        action: "CREATE_USER",
        entityType: "User",
        entityId: userId,
        details: `Created user ${user.email} with role ${user.role}`,
      },
    })

    revalidatePath("/admin/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Erreur lors de la création de l'utilisateur" }
  }
}

export async function updateUser(userId: string, data: {
  name?: string
  email?: string
  role?: "USER" | "ADMIN"
}) {
  try {
    const admin = await requireAdmin()
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true },
    })

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" }
    }

    // Check if email is being changed and if it already exists
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      })
      if (existingUser) {
        return { success: false, error: "Cet email est déjà utilisé" }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.role && { role: data.role }),
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: admin.id,
        action: "UPDATE_USER",
        entityType: "User",
        entityId: userId,
        details: `Updated user ${user.email}: ${JSON.stringify(data)}`,
      },
    })

    revalidatePath("/admin/users")
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Erreur lors de la mise à jour de l'utilisateur" }
  }
}

export async function deleteUser(userId: string) {
  try {
    const admin = await requireAdmin()
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true },
    })

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" }
    }

    // Prevent deleting the last admin
    if (user.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      })
      if (adminCount <= 1) {
        return { success: false, error: "Impossible de supprimer le dernier administrateur" }
      }
    }

    // Log activity before deletion
    await prisma.activity.create({
      data: {
        userId: admin.id,
        action: "DELETE_USER",
        entityType: "User",
        entityId: userId,
        details: `Deleted user ${user.email}`,
      },
    })

    // Delete user and all related data
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Erreur lors de la suppression de l'utilisateur" }
  }
}

export async function unapproveUser(userId: string) {
  try {
    const admin = await requireAdmin()
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isApproved: false,
        approvedAt: null,
        approvedById: null,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: admin.id,
        action: "UNAPPROVE_USER",
        entityType: "User",
        entityId: userId,
        details: `Unapproved user ${user.email}`,
      },
    })

    revalidatePath("/admin/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error unapproving user:", error)
    return { success: false, error: "Erreur lors du retrait de l'approbation" }
  }
}
