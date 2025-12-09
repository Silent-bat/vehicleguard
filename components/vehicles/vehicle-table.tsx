"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VehicleForm } from "./vehicle-form"
import { deleteVehicle } from "@/lib/actions/vehicles"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import type { Vehicle } from "@/lib/types"

interface VehicleWithCases extends Vehicle {
  theftCases: { id: string; status: string }[]
}

interface VehicleTableProps {
  vehicles: VehicleWithCases[]
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    if (!deleteId) return

    const result = await deleteVehicle(deleteId)
    if (result.success) {
      toast.success("Véhicule supprimé")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  return (
    <>
      <div className="rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plaque</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Couleur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => {
                const activeTheft = vehicle.theftCases.find(
                  (tc) => tc.status === "IN_PROGRESS" || tc.status === "UNDER_INVESTIGATION",
                )
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.brand}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell>
                      {activeTheft ? (
                        <Badge variant="destructive">Vol signalé</Badge>
                      ) : (
                        <Badge variant="outline">Disponible</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <VehicleForm vehicle={vehicle} mode="edit" />
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(vehicle.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucun véhicule enregistré
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le véhicule et tous ses dossiers de vol associés seront supprimés
              définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
