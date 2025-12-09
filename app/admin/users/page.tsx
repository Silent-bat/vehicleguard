import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { requireAdmin } from "@/lib/auth-server"
import { UserManagement } from "@/components/admin/user-management"
import { getUsers } from "@/lib/actions/users"

export default async function UsersManagementPage() {
  // Require admin authentication
  try {
    await requireAdmin()
  } catch (error) {
    redirect("/")
  }

  const result = await getUsers()
  const users = result.data || []

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-lg font-semibold">Gestion des Utilisateurs</h1>
            <p className="text-sm text-muted-foreground">Approuver et gérer les comptes utilisateurs</p>
          </div>
        </header>
        <main className="flex-1 p-6">
          <UserManagement users={users} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
