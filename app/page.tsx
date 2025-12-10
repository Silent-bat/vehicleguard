import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TheftCharts } from "@/components/dashboard/theft-charts"
import { RecentThefts } from "@/components/dashboard/recent-thefts"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { getTheftCases } from "@/lib/actions/theft-cases"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser } from "@/lib/auth-server"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/unauthorized")
  }



  const [statsResult, casesResult] = await Promise.all([getDashboardStats(), getTheftCases()])

  const stats = statsResult.data || {
    totalVehicles: 0,
    totalThefts: 0,
    activeThefts: 0,
    resolvedThefts: 0,
    theftsByMonth: [],
    theftsByBrand: [],
    theftsByLocation: [],
  }

  const cases = casesResult.data || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-lg font-semibold">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble de la gestion des vols</p>
          </div>
        </header>
        <main className="flex-1 space-y-6 p-6">
          <StatsCards stats={stats} />
          <TheftCharts stats={stats} />
          <RecentThefts cases={cases} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
