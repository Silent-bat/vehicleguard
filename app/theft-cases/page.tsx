import { redirect } from "next/navigation"
import Link from "next/link"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { TheftCaseTable } from "@/components/theft/theft-case-table"
import { getTheftCases } from "@/lib/actions/theft-cases"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { requireAuth } from "@/lib/auth-server"

export default async function TheftCasesPage() {
  await requireAuth().catch(() => redirect("/unauthorized"))

  const result = await getTheftCases()
  const cases = result.data || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <h1 className="text-lg font-semibold">Dossiers de vol</h1>
              <p className="text-sm text-muted-foreground">Gérez les dossiers de vol en cours</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/report-theft">
              <Plus className="mr-2 h-4 w-4" />
              Signaler un vol
            </Link>
          </Button>
        </header>
        <main className="flex-1 p-6">
          <TheftCaseTable cases={cases} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
