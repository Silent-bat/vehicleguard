import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { ReportsContent } from "@/components/reports/reports-content"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { getTheftCases } from "@/lib/actions/theft-cases"
import { requireAuth } from "@/lib/auth-server"

export default async function ReportsPage() {
  await requireAuth().catch(() => redirect("/unauthorized"))

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
            <h1 className="text-lg font-semibold">Rapports</h1>
            <p className="text-sm text-muted-foreground">Analysez les statistiques des vols</p>
          </div>
        </header>
        <main className="flex-1 p-6">
          <ReportsContent stats={stats} cases={cases} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
