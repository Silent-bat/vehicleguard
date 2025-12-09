"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { CaseStatus } from "@/lib/types"
import { requireAuth } from "@/lib/auth-server"

export async function getTheftCases() {
  try {
    await requireAuth()
    const cases = await prisma.theftCase.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: true,
        reportedBy: {
          select: { id: true, name: true, email: true },
        },
        evidence: true,
      },
    })
    return { success: true, data: cases }
  } catch (error) {
    console.error("Error fetching theft cases:", error)
    return { success: false, error: "Erreur lors de la récupération des dossiers" }
  }
}

export async function getTheftCaseById(id: string) {
  try {
    const theftCase = await prisma.theftCase.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    })
    return { success: true, data: theftCase }
  } catch (error) {
    console.error("Error fetching theft case:", error)
    return { success: false, error: "Erreur lors de la récupération du dossier" }
  }
}

export async function createTheftCase(data: {
  vehicleId: string
  theftDate: Date
  theftTime: string
  location: string
  locationDetails?: string
  description: string
  driverName?: string
  driverContact?: string
  driverLicense?: string
  policeReportNumber?: string
  policeDepartment?: string
}) {
  try {
    const user = await requireAuth()
    
    // Check if vehicle exists and its current status
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
      select: { id: true, status: true, brand: true, model: true, licensePlate: true },
    })

    if (!vehicle) {
      return { success: false, error: "Véhicule non trouvé" }
    }

    // Prevent reporting theft if vehicle is already stolen
    if (vehicle.status === "STOLEN") {
      return { 
        success: false, 
        error: `Ce véhicule (${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}) est déjà signalé comme volé. Veuillez d'abord le marquer comme retrouvé avant de signaler un nouveau vol.` 
      }
    }

    // Update vehicle status to STOLEN
    await prisma.vehicle.update({
      where: { id: data.vehicleId },
      data: { status: "STOLEN" },
    })
    
    const theftCase = await prisma.theftCase.create({
      data: {
        ...data,
        reportedById: user.id,
        updatedAt: new Date(),
      },
      include: {
        vehicle: true,
        reportedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    })
    
    revalidatePath("/theft-cases")
    revalidatePath("/report-theft")
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, data: theftCase }
  } catch (error) {
    console.error("Error creating theft case:", error)
    return { success: false, error: "Erreur lors de la création du dossier de vol" }
  }
}

export async function updateTheftCase(
  id: string,
  data: {
    theftDate?: Date
    theftTime?: string
    location?: string
    description?: string
    driverName?: string
    driverContact?: string
    status?: CaseStatus
    actionsTaken?: string
  },
) {
  try {
    const theftCase = await prisma.theftCase.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        vehicle: true,
      },
    })
    revalidatePath("/theft-cases")
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, data: theftCase }
  } catch (error) {
    console.error("Error updating theft case:", error)
    return { success: false, error: "Erreur lors de la mise à jour du dossier" }
  }
}

export async function deleteTheftCase(id: string) {
  try {
    await prisma.theftCase.delete({
      where: { id },
    })
    revalidatePath("/theft-cases")
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting theft case:", error)
    return { success: false, error: "Erreur lors de la suppression du dossier" }
  }
}

export async function bulkUpdateTheftCaseStatus(ids: string[], status: CaseStatus) {
  try {
    await prisma.theftCase.updateMany({
      where: { id: { in: ids } },
      data: { status, updatedAt: new Date() },
    })
    revalidatePath("/theft-cases")
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error bulk updating theft cases:", error)
    return { success: false, error: "Erreur lors de la mise à jour des dossiers" }
  }
}

export async function bulkDeleteTheftCases(ids: string[]) {
  try {
    await prisma.theftCase.deleteMany({
      where: { id: { in: ids } },
    })
    revalidatePath("/theft-cases")
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error bulk deleting theft cases:", error)
    return { success: false, error: "Erreur lors de la suppression des dossiers" }
  }
}
