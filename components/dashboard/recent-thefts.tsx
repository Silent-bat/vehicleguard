"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { TheftCase } from "@/lib/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface RecentTheftsProps {
  cases: TheftCase[]
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  IN_PROGRESS: { label: "En cours", variant: "default" },
  UNDER_INVESTIGATION: { label: "Enquête", variant: "secondary" },
  RESOLVED: { label: "Résolu", variant: "outline" },
  CLOSED: { label: "Fermé", variant: "outline" },
}

export function RecentThefts({ cases }: RecentTheftsProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Vols récents</CardTitle>
          <CardDescription>Les derniers signalements de vol</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/theft-cases">
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {cases.length > 0 ? (
          <div className="space-y-4">
            {cases.slice(0, 5).map((theftCase) => (
              <div
                key={theftCase.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {theftCase.vehicle?.brand} {theftCase.vehicle?.model}
                    </span>
                    <Badge variant={statusConfig[theftCase.status]?.variant || "default"}>
                      {statusConfig[theftCase.status]?.label || theftCase.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {theftCase.vehicle?.licensePlate} • {theftCase.location}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(theftCase.theftDate), "d MMMM yyyy", { locale: fr })}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/theft-cases/${theftCase.id}`}>Détails</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Aucun vol signalé</div>
        )}
      </CardContent>
    </Card>
  )
}
