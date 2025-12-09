"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, AlertTriangle, FileText, BarChart3, Shield, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { UserNav } from "@/components/auth/user-nav"

const navItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Véhicules",
    url: "/vehicles",
    icon: Car,
  },
  {
    title: "Signaler un vol",
    url: "/report-theft",
    icon: AlertTriangle,
  },
  {
    title: "Dossiers de vol",
    url: "/theft-cases",
    icon: FileText,
  },
  {
    title: "Rapports",
    url: "/reports",
    icon: BarChart3,
  },
]

const adminItems = [
  {
    title: "Administration",
    url: "/admin",
    icon: Settings,
  },
  {
    title: "Gestion Utilisateurs",
    url: "/admin/users",
    icon: Shield,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-sidebar-foreground">VehicleGuard</span>
            <span className="text-xs text-sidebar-foreground/60">Gestion des vols</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="transition-colors">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} className="transition-colors">
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-end">
          <UserNav />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
