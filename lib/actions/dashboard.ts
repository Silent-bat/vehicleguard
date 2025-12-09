"use server"

import { prisma } from "@/lib/prisma"
import type { DashboardStats } from "@/lib/types"

export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
  try {
    const [totalVehicles, totalThefts, activeThefts, resolvedThefts, theftCases] = await Promise.all([
      prisma.vehicle.count(),
      prisma.theftCase.count(),
      prisma.theftCase.count({
        where: {
          status: {
            in: ["IN_PROGRESS", "UNDER_INVESTIGATION"],
          },
        },
      }),
      prisma.theftCase.count({
        where: {
          status: "RESOLVED",
        },
      }),
      prisma.theftCase.findMany({
        include: {
          vehicle: true,
        },
      }),
    ])

    // Calculate thefts by month
    const monthCounts: Record<string, number> = {}
    const brandCounts: Record<string, number> = {}
    const locationCounts: Record<string, number> = {}

    theftCases.forEach((tc) => {
      // By month
      const monthKey = new Date(tc.theftDate).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1

      // By brand
      if (tc.vehicle) {
        brandCounts[tc.vehicle.brand] = (brandCounts[tc.vehicle.brand] || 0) + 1
      }

      // By location (extract city)
      const city = tc.location.split(",")[0].trim()
      locationCounts[city] = (locationCounts[city] || 0) + 1
    })

    const theftsByMonth = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .slice(-6)

    const theftsByBrand = Object.entries(brandCounts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const theftsByLocation = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      success: true,
      data: {
        totalVehicles,
        totalThefts,
        activeThefts,
        resolvedThefts,
        theftsByMonth,
        theftsByBrand,
        theftsByLocation,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return { success: false, error: "Erreur lors de la récupération des statistiques" }
  }
}
