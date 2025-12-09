"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, Pie, PieChart, Legend, Tooltip } from "recharts"
import type { DashboardStats } from "@/lib/types"

interface TheftChartsProps {
  stats: DashboardStats
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function TheftCharts({ stats }: TheftChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Vols par mois</CardTitle>
          <CardDescription>Évolution des vols sur les derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            {stats.theftsByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.theftsByMonth}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
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

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Par marque</CardTitle>
          <CardDescription>Marques de véhicules les plus volées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            {stats.theftsByBrand.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.theftsByBrand}
                    dataKey="count"
                    nameKey="brand"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ brand }) => brand}
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
          <CardTitle className="text-lg">Par lieu</CardTitle>
          <CardDescription>Lieux les plus fréquents des vols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px]">
            {stats.theftsByLocation.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.theftsByLocation} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    type="category"
                    dataKey="location"
                    tick={{ fontSize: 12 }}
                    width={80}
                    stroke="hsl(var(--muted-foreground))"
                  />
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
  )
}
