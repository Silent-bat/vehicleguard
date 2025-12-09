"use client"

import { Car, AlertTriangle, CheckCircle, XCircle, Search, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdminStats } from "@/lib/types"

interface AdminStatsCardsProps {
  stats: AdminStats
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const statCards = [
    {
      title: "Total Véhicules",
      value: stats.totalVehicles,
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Vols",
      value: stats.totalThefts,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "En Cours",
      value: stats.activeThefts,
      icon: Search,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "En Enquête",
      value: stats.underInvestigation,
      icon: Search,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Résolus",
      value: stats.resolvedThefts,
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Fermés",
      value: stats.closedThefts,
      icon: XCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
      <Card className="md:col-span-3 lg:col-span-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Résolution</CardTitle>
          <div className="rounded-full bg-emerald-500/10 p-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{stats.resolutionRate}%</div>
            <div className="flex-1">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${stats.resolutionRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
