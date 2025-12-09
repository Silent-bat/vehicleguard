"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Véhicules enregistrés",
      value: stats.totalVehicles,
      icon: Car,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total des vols",
      value: stats.totalThefts,
      icon: AlertTriangle,
      color: "text-status-danger",
      bgColor: "bg-status-danger/10",
    },
    {
      title: "Vols en cours",
      value: stats.activeThefts,
      icon: Clock,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      title: "Vols résolus",
      value: stats.resolvedThefts,
      icon: CheckCircle,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
