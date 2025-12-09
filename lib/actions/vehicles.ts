"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-server"

export async function getVehicles() {
  try {
    await requireAuth()
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        theftCases: {
          select: { id: true, status: true },
        },
        registeredBy: {
          select: { id: true, name: true, email: true },
        },
      },
    })
    return { success: true, data: vehicles }
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return { success: false, error: "Erreur lors de la récupération des véhicules" }
  }
}

export async function getVehicleById(id: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        theftCases: {
          orderBy: { createdAt: "desc" },
        },
      },
    })
    return { success: true, data: vehicle }
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return { success: false, error: "Erreur lors de la récupération du véhicule" }
  }
}

export async function createVehicle(data: {
  brand: string
  model: string
  licensePlate: string
  year: number
  color: string
  vin?: string
  department?: string
  assignedDriver?: string
  insuranceNumber?: string
  insuranceExpiry?: Date
}) {
  try {
    const user = await requireAuth()
    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        registeredById: user.id,
        updatedAt: new Date(),
      },
    })
    revalidatePath("/vehicles")
    revalidatePath("/")
    return { success: true, data: vehicle }
  } catch (error: unknown) {
    console.error("Error creating vehicle:", error)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "Cette plaque d'immatriculation existe déjà" }
    }
    return { success: false, error: "Erreur lors de la création du véhicule" }
  }
}

export async function updateVehicle(
  id: string,
  data: {
    brand?: string
    model?: string
    licensePlate?: string
    year?: number
    color?: string
  },
) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
    revalidatePath("/vehicles")
    revalidatePath("/")
    return { success: true, data: vehicle }
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return { success: false, error: "Erreur lors de la mise à jour du véhicule" }
  }
}

export async function deleteVehicle(id: string) {
  try {
    await prisma.vehicle.delete({
      where: { id },
    })
    revalidatePath("/vehicles")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return { success: false, error: "Erreur lors de la suppression du véhicule" }
  }
}
