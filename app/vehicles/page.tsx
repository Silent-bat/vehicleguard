import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { VehicleForm } from "@/components/vehicles/vehicle-form"
import { VehicleTable } from "@/components/vehicles/vehicle-table"
import { getVehicles } from "@/lib/actions/vehicles"
import { Separator } from "@/components/ui/separator"
import { requireAuth } from "@/lib/auth-server"

export default async function VehiclesPage() {
  await requireAuth().catch(() => redirect("/login"))
  
  const result = await getVehicles()
  const vehicles = result.data || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <h1 className="text-lg font-semibold">Véhicules</h1>
              <p className="text-sm text-muted-foreground">Gérez votre flotte de véhicules</p>
            </div>
          </div>
          <VehicleForm />
        </header>
        <main className="flex-1 p-6">
          <VehicleTable vehicles={vehicles} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
