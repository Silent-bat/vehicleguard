"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
  Legend,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { DashboardStats, TheftCase, CaseStatus } from "@/lib/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ReportsContentProps {
  stats: DashboardStats
  cases: TheftCase[]
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

const statusConfig: Record<
  CaseStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  IN_PROGRESS: { label: "En cours", variant: "default" },
  UNDER_INVESTIGATION: { label: "Enquête", variant: "secondary" },
  RESOLVED: { label: "Résolu", variant: "outline" },
  CLOSED: { label: "Fermé", variant: "outline" },
}

export function ReportsContent({ stats, cases }: ReportsContentProps) {
  // Calculate resolution rate
  const resolutionRate = stats.totalThefts > 0 ? ((stats.resolvedThefts / stats.totalThefts) * 100).toFixed(1) : "0"

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="monthly">Par mois</TabsTrigger>
        <TabsTrigger value="details">Détails</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux de résolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-status-success">{resolutionRate}%</div>
              <p className="text-sm text-muted-foreground">
                {stats.resolvedThefts} vols résolus sur {stats.totalThefts}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vols actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-status-warning">{stats.activeThefts}</div>
              <p className="text-sm text-muted-foreground">Dossiers en cours ou en enquête</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Véhicules à risque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-status-danger">
                {stats.totalThefts > 0 && stats.totalVehicles > 0
                  ? ((stats.totalThefts / stats.totalVehicles) * 100).toFixed(1)
                  : "0"}
                %
              </div>
              <p className="text-sm text-muted-foreground">Taux de vol de la flotte</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Marques les plus volées</CardTitle>
              <CardDescription>Distribution des vols par marque de véhicule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {stats.theftsByBrand.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.theftsByBrand}
                        dataKey="count"
                        nameKey="brand"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ brand, percent }) => `${brand} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {stats.theftsByBrand.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Lieux les plus fréquents</CardTitle>
              <CardDescription>Top 5 des lieux de vol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {stats.theftsByLocation.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.theftsByLocation} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis type="category" dataKey="location" width={100} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {stats.theftsByLocation.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="monthly" className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Évolution mensuelle des vols</CardTitle>
            <CardDescription>Nombre de vols signalés par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {stats.theftsByMonth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.theftsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={{ fill: "var(--chart-1)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details" className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Liste complète des vols</CardTitle>
            <CardDescription>Tous les dossiers de vol enregistrés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Plaque</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Conducteur</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.length > 0 ? (
                    cases.map((theftCase) => (
                      <TableRow key={theftCase.id}>
                        <TableCell>{format(new Date(theftCase.theftDate), "d MMM yyyy", { locale: fr })}</TableCell>
                        <TableCell>
                          {theftCase.vehicle?.brand} {theftCase.vehicle?.model}
                        </TableCell>
                        <TableCell className="font-medium">{theftCase.vehicle?.licensePlate}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{theftCase.location}</TableCell>
                        <TableCell>{theftCase.driverName || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[theftCase.status]?.variant || "default"}>
                            {statusConfig[theftCase.status]?.label || theftCase.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Aucun dossier de vol
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
