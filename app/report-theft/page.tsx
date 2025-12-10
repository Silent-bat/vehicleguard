import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ReportTheftForm } from "@/components/theft/report-theft-form"
import { getVehicles } from "@/lib/actions/vehicles"
import { Separator } from "@/components/ui/separator"
import { requireAuth } from "@/lib/auth-server"

export default async function ReportTheftPage() {
  await requireAuth().catch(() => redirect("/unauthorized"))

  const result = await getVehicles()
  const vehicles = result.data || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-lg font-semibold">Signaler un vol</h1>
            <p className="text-sm text-muted-foreground">Créez un nouveau dossier de vol</p>
          </div>
        </header>
        <main className="flex-1 p-6">
          <ReportTheftForm vehicles={vehicles} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
