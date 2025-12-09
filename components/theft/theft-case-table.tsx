"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteTheftCase, updateTheftCase } from "@/lib/actions/theft-cases"
import { toast } from "sonner"
import { Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { TheftCase, CaseStatus } from "@/lib/types"

interface TheftCaseTableProps {
  cases: TheftCase[]
}

const statusConfig: Record<
  CaseStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  IN_PROGRESS: { label: "En cours", variant: "default" },
  UNDER_INVESTIGATION: { label: "Enquête", variant: "secondary" },
  RESOLVED: { label: "Résolu", variant: "outline" },
  CLOSED: { label: "Fermé", variant: "outline" },
}

export function TheftCaseTable({ cases }: TheftCaseTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    if (!deleteId) return

    const result = await deleteTheftCase(deleteId)
    if (result.success) {
      toast.success("Dossier supprimé")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  async function handleStatusChange(id: string, status: CaseStatus) {
    const result = await updateTheftCase(id, { status })
    if (result.success) {
      toast.success("Statut mis à jour")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date du vol</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Plaque</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length > 0 ? (
              cases.map((theftCase) => (
                <TableRow key={theftCase.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {format(new Date(theftCase.theftDate), "d MMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-sm text-muted-foreground">{theftCase.theftTime}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {theftCase.vehicle?.brand} {theftCase.vehicle?.model}
                  </TableCell>
                  <TableCell className="font-medium">{theftCase.vehicle?.licensePlate}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{theftCase.location}</TableCell>
                  <TableCell>
                    <Select
                      value={theftCase.status}
                      onValueChange={(value) => handleStatusChange(theftCase.id, value as CaseStatus)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <Badge variant={statusConfig[theftCase.status]?.variant || "default"}>
                            {statusConfig[theftCase.status]?.label || theftCase.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="UNDER_INVESTIGATION">Enquête</SelectItem>
                        <SelectItem value="RESOLVED">Résolu</SelectItem>
                        <SelectItem value="CLOSED">Fermé</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/theft-cases/${theftCase.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(theftCase.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucun dossier de vol
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
              Cette action est irréversible. Le dossier de vol sera supprimé définitivement.
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
