"use client"

import { Car, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ActivityItem } from "@/lib/types"

interface RecentActivityProps {
  activities: ActivityItem[]
}

const activityIcons = {
  vehicle_added: Car,
  theft_reported: AlertTriangle,
  case_updated: RefreshCw,
  case_resolved: CheckCircle,
}

const activityColors = {
  vehicle_added: "bg-blue-500/10 text-blue-500",
  theft_reported: "bg-red-500/10 text-red-500",
  case_updated: "bg-amber-500/10 text-amber-500",
  case_resolved: "bg-emerald-500/10 text-emerald-500",
}

const activityLabels = {
  vehicle_added: "Ajout",
  theft_reported: "Vol",
  case_updated: "Mise à jour",
  case_resolved: "Résolu",
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
        <CardDescription>Les 10 dernières actions sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            return (
              <div key={activity.id + activity.timestamp.toString()} className="flex items-start gap-4">
                <div className={`rounded-full p-2 ${activityColors[activity.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {activityLabels[activity.type]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}
          {activities.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">Aucune activité récente</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
