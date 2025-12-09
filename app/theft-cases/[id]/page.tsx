import Link from "next/link"
import { notFound } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getTheftCaseById } from "@/lib/actions/theft-cases"
import { TheftCaseActions } from "@/components/theft/theft-case-actions"
import { ArrowLeft, Car, MapPin, Calendar, Clock, User, Phone } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { CaseStatus } from "@/lib/types"

const statusConfig: Record<
  CaseStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  IN_PROGRESS: { label: "En cours", variant: "default" },
  UNDER_INVESTIGATION: { label: "Enquête", variant: "secondary" },
  RESOLVED: { label: "Résolu", variant: "outline" },
  CLOSED: { label: "Fermé", variant: "outline" },
}

export default async function TheftCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getTheftCaseById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const theftCase = result.data

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/theft-cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Détails du dossier</h1>
            <p className="text-sm text-muted-foreground">
              {theftCase.vehicle?.brand} {theftCase.vehicle?.model} - {theftCase.vehicle?.licensePlate}
            </p>
          </div>
          <Badge variant={statusConfig[theftCase.status]?.variant || "default"} className="text-sm">
            {statusConfig[theftCase.status]?.label || theftCase.status}
          </Badge>
        </header>
        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Véhicule volé
                </CardTitle>
                <CardDescription>Informations du véhicule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Marque</p>
                    <p className="font-medium">{theftCase.vehicle?.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Modèle</p>
                    <p className="font-medium">{theftCase.vehicle?.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plaque</p>
                    <p className="font-medium">{theftCase.vehicle?.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Année</p>
                    <p className="font-medium">{theftCase.vehicle?.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Couleur</p>
                    <p className="font-medium">{theftCase.vehicle?.color}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-status-danger" />
                  Détails du vol
                </CardTitle>
                <CardDescription>Circonstances du vol</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {format(new Date(theftCase.theftDate), "d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Heure:</span>
                  <span className="font-medium">{theftCase.theftTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Lieu:</span>
                  <span className="font-medium">{theftCase.location}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm">{theftCase.description}</p>
                </div>
              </CardContent>
            </Card>

            {(theftCase.driverName || theftCase.driverContact) && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Conducteur
                  </CardTitle>
                  <CardDescription>Informations du conducteur au moment du vol</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {theftCase.driverName && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{theftCase.driverName}</span>
                    </div>
                  )}
                  {theftCase.driverContact && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{theftCase.driverContact}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <TheftCaseActions theftCase={theftCase} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
