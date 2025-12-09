import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { RecentActivity } from "@/components/admin/recent-activity"
import { VehiclesManagement } from "@/components/admin/vehicles-management"
import { CasesManagement } from "@/components/admin/cases-management"
import { ExportData } from "@/components/admin/export-data"
import { getAdminStats } from "@/lib/actions/admin"
import { getVehicles } from "@/lib/actions/vehicles"
import { getTheftCases } from "@/lib/actions/theft-cases"
import { requireAdmin } from "@/lib/auth-server"
import { Separator } from "@/components/ui/separator"

export default async function AdminPage() {
  // Require admin authentication
  try {
    await requireAdmin()
  } catch (error) {
    redirect("/")
  }

  const [statsResult, vehiclesResult, casesResult] = await Promise.all([
    getAdminStats(),
    getVehicles(),
    getTheftCases(),
  ])

  const stats = statsResult.data
  const vehicles = vehiclesResult.data || []
  const cases = casesResult.data || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-lg font-semibold">Administration</h1>
            <p className="text-sm text-muted-foreground">Gérez l'ensemble de l'application VehicleGuard</p>
          </div>
        </header>
        <main className="flex-1 space-y-6 p-6">
          {stats && <AdminStatsCards stats={stats} />}

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
              <TabsTrigger value="cases">Dossiers</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {stats && <RecentActivity activities={stats.recentActivity} />}
            </TabsContent>

            <TabsContent value="vehicles">
              <VehiclesManagement vehicles={vehicles} />
            </TabsContent>

            <TabsContent value="cases">
              <CasesManagement cases={cases} />
            </TabsContent>

            <TabsContent value="export">
              <ExportData />
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
