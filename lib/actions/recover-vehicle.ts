"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-server"

export async function markVehicleAsRecovered(vehicleId: string, details?: {
  recoveredDate?: Date
  recoveryLocation?: string
  vehicleCondition?: string
}) {
  try {
    const user = await requireAuth()
    
    // Update vehicle status to RECOVERED
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: "RECOVERED" },
    })

    // Find active theft case for this vehicle
    const activeCase = await prisma.theftCase.findFirst({
      where: {
        vehicleId: vehicleId,
        status: {
          in: ["IN_PROGRESS", "UNDER_INVESTIGATION"],
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // If there's an active case, update it with recovery details
    if (activeCase) {
      await prisma.theftCase.update({
        where: { id: activeCase.id },
        data: {
          status: "RECOVERED",
          ...(details?.recoveredDate && { recoveredDate: details.recoveredDate }),
          ...(details?.recoveryLocation && { recoveryLocation: details.recoveryLocation }),
          ...(details?.vehicleCondition && { vehicleCondition: details.vehicleCondition }),
        },
      })
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: "RECOVER_VEHICLE",
        entityType: "Vehicle",
        entityId: vehicleId,
        details: `Marked vehicle ${vehicle.licensePlate} as recovered`,
      },
    })

    revalidatePath("/vehicles")
    revalidatePath("/theft-cases")
    revalidatePath("/")
    return { success: true, data: vehicle }
  } catch (error) {
    console.error("Error marking vehicle as recovered:", error)
    return { success: false, error: "Erreur lors du marquage du véhicule comme retrouvé" }
  }
}

export async function markVehicleAsActive(vehicleId: string) {
  try {
    const user = await requireAuth()
    
    // Check vehicle current status
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, status: true, licensePlate: true },
    })

    if (!vehicle) {
      return { success: false, error: "Véhicule non trouvé" }
    }

    // Can only reactivate RECOVERED or INACTIVE vehicles
    if (vehicle.status === "STOLEN") {
      return { 
        success: false, 
        error: "Impossible de réactiver un véhicule volé. Marquez-le d'abord comme retrouvé." 
      }
    }

    // Update vehicle status to ACTIVE
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: "ACTIVE" },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: "ACTIVATE_VEHICLE",
        entityType: "Vehicle",
        entityId: vehicleId,
        details: `Reactivated vehicle ${vehicle.licensePlate}`,
      },
    })

    revalidatePath("/vehicles")
    return { success: true, data: updatedVehicle }
  } catch (error) {
    console.error("Error marking vehicle as active:", error)
    return { success: false, error: "Erreur lors de la réactivation du véhicule" }
  }
}
