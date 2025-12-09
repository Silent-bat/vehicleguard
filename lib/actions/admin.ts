"use server"

import { prisma } from "@/lib/prisma"
import type { AdminStats } from "@/lib/types"

export async function getAdminStats(): Promise<{ success: boolean; data?: AdminStats; error?: string }> {
  try {
    const [
      totalVehicles,
      totalThefts,
      activeThefts,
      resolvedThefts,
      closedThefts,
      underInvestigation,
      recentVehicles,
      recentCases,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.theftCase.count(),
      prisma.theftCase.count({ where: { status: "IN_PROGRESS" } }),
      prisma.theftCase.count({ where: { status: "RESOLVED" } }),
      prisma.theftCase.count({ where: { status: "CLOSED" } }),
      prisma.theftCase.count({ where: { status: "UNDER_INVESTIGATION" } }),
      prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, brand: true, model: true, licensePlate: true, createdAt: true },
      }),
      prisma.theftCase.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { vehicle: { select: { brand: true, model: true, licensePlate: true } } },
      }),
    ])

    const resolutionRate = totalThefts > 0 ? Math.round((resolvedThefts / totalThefts) * 100) : 0

    // Build recent activity
    const recentActivity = [
      ...recentVehicles.map((v) => ({
        id: v.id,
        type: "vehicle_added" as const,
        description: `Véhicule ajouté: ${v.brand} ${v.model} (${v.licensePlate})`,
        timestamp: v.createdAt,
      })),
      ...recentCases.map((c) => ({
        id: c.id,
        type: c.status === "RESOLVED" ? ("case_resolved" as const) : ("theft_reported" as const),
        description: `${c.status === "RESOLVED" ? "Dossier résolu" : "Vol signalé"}: ${c.vehicle?.brand} ${c.vehicle?.model}`,
        timestamp: c.updatedAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return {
      success: true,
      data: {
        totalVehicles,
        totalThefts,
        activeThefts,
        resolvedThefts,
        closedThefts,
        underInvestigation,
        resolutionRate,
        recentActivity,
      },
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return { success: false, error: "Erreur lors de la récupération des statistiques admin" }
  }
}

export async function exportData(type: "vehicles" | "cases" | "all") {
  try {
    const data: Record<string, unknown> = {}

    if (type === "vehicles" || type === "all") {
      data.vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" },
      })
    }

    if (type === "cases" || type === "all") {
      data.theftCases = await prisma.theftCase.findMany({
        orderBy: { createdAt: "desc" },
        include: { vehicle: true },
      })
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error exporting data:", error)
    return { success: false, error: "Erreur lors de l'export des données" }
  }
}
