import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { requireAuth } from "@/lib/auth-server"
import { ProfileContent } from "@/components/profile/profile-content"

export default async function ProfilePage() {
  const user = await requireAuth().catch(() => redirect("/login"))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-lg font-semibold">Mon Profil</h1>
            <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
          </div>
        </header>
        <main className="flex-1 p-6">
          <ProfileContent user={user} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
