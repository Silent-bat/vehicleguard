"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-server"

export async function updateProfile(data: {
  name: string
}) {
  try {
    const user = await requireAuth()
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: "UPDATE_PROFILE",
        entityType: "User",
        entityId: user.id,
        details: `Updated profile information`,
      },
    })

    revalidatePath("/profile")
    revalidatePath("/settings")
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Erreur lors de la mise à jour du profil" }
  }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  try {
    const user = await requireAuth()
    
    // Verify current password by trying to sign in
    const verifyResponse = await fetch(`${process.env.BETTER_AUTH_URL || "http://localhost:3001"}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        password: data.currentPassword,
      }),
    })

    if (!verifyResponse.ok) {
      return { success: false, error: "Mot de passe actuel incorrect" }
    }

    // Get the account to update password
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
      },
    })

    if (!account) {
      return { success: false, error: "Compte non trouvé" }
    }

    // Hash new password (Better Auth format)
    const crypto = require("crypto")
    const salt = crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(data.newPassword, salt, 1000, 64, "sha512").toString("hex")
    const hashedPassword = `${salt}:${hash}`

    // Update password in account
    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashedPassword,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: "CHANGE_PASSWORD",
        entityType: "User",
        entityId: user.id,
        details: `Changed password`,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, error: "Erreur lors du changement de mot de passe" }
  }
}

export async function getProfileStats() {
  try {
    const user = await requireAuth()
    
    const [vehicleCount, theftCaseCount, activityCount] = await Promise.all([
      prisma.vehicle.count({
        where: { registeredById: user.id },
      }),
      prisma.theftCase.count({
        where: { reportedById: user.id },
      }),
      prisma.activity.count({
        where: { userId: user.id },
      }),
    ])

    return {
      success: true,
      data: {
        vehicles: vehicleCount,
        theftCases: theftCaseCount,
        activities: activityCount,
      },
    }
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return { success: false, error: "Erreur lors de la récupération des statistiques" }
  }
}
