"use client"

import { useState } from "react"
import { Pencil, Trash2, Search, MoreHorizontal, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { TheftCase, CaseStatus } from "@/lib/types"
import {
  updateTheftCase,
  deleteTheftCase,
  bulkUpdateTheftCaseStatus,
  bulkDeleteTheftCases,
} from "@/lib/actions/theft-cases"
import { useRouter } from "next/navigation"

interface CasesManagementProps {
  cases: TheftCase[]
}

const statusLabels: Record<CaseStatus, string> = {
  IN_PROGRESS: "En cours",
  UNDER_INVESTIGATION: "En enquête",
  RESOLVED: "Résolu",
  CLOSED: "Fermé",
}

const statusColors: Record<CaseStatus, string> = {
  IN_PROGRESS: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  UNDER_INVESTIGATION: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CLOSED: "bg-muted text-muted-foreground border-muted",
}

export function CasesManagement({ cases }: CasesManagementProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingCase, setEditingCase] = useState<TheftCase | null>(null)
  const [viewingCase, setViewingCase] = useState<TheftCase | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    status: "IN_PROGRESS" as CaseStatus,
    actionsTaken: "",
    driverName: "",
    driverContact: "",
  })

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.vehicle?.brand.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle?.model.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle?.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCases.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCases.map((c) => c.id))
    }
  }

  const handleEdit = (theftCase: TheftCase) => {
    setFormData({
      status: theftCase.status,
      actionsTaken: theftCase.actionsTaken || "",
      driverName: theftCase.driverName || "",
      driverContact: theftCase.driverContact || "",
    })
    setEditingCase(theftCase)
  }

  const handleSave = async () => {
    if (!editingCase) return
    setIsLoading(true)
    try {
      await updateTheftCase(editingCase.id, formData)
      setEditingCase(null)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!caseToDelete) return
    setIsLoading(true)
    try {
      await deleteTheftCase(caseToDelete)
      setCaseToDelete(null)
      setIsDeleteDialogOpen(false)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkStatusUpdate = async (status: CaseStatus) => {
    setIsLoading(true)
    try {
      await bulkUpdateTheftCaseStatus(selectedIds, status)
      setSelectedIds([])
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    setIsLoading(true)
    try {
      await bulkDeleteTheftCases(selectedIds)
      setSelectedIds([])
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Dossiers</CardTitle>
              <CardDescription>{cases.length} dossier(s) de vol</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="UNDER_INVESTIGATION">En enquête</SelectItem>
                <SelectItem value="RESOLVED">Résolu</SelectItem>
                <SelectItem value="CLOSED">Fermé</SelectItem>
              </SelectContent>
            </Select>
            {selectedIds.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Actions ({selectedIds.length})</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate("IN_PROGRESS")}>
                    Marquer en cours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate("UNDER_INVESTIGATION")}>
                    Marquer en enquête
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate("RESOLVED")}>Marquer résolu</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusUpdate("CLOSED")}>Marquer fermé</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleBulkDelete}>
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === filteredCases.length && filteredCases.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Plaque</TableHead>
                  <TableHead>Date du vol</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((theftCase) => (
                  <TableRow key={theftCase.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(theftCase.id)}
                        onCheckedChange={() => toggleSelect(theftCase.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {theftCase.vehicle?.brand} {theftCase.vehicle?.model}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{theftCase.vehicle?.licensePlate}</Badge>
                    </TableCell>
                    <TableCell>{new Date(theftCase.theftDate).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{theftCase.location}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[theftCase.status]}>{statusLabels[theftCase.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingCase(theftCase)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(theftCase)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setCaseToDelete(theftCase.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun dossier trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={!!viewingCase} onOpenChange={(open) => !open && setViewingCase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du dossier</DialogTitle>
            <DialogDescription>
              {viewingCase?.vehicle?.brand} {viewingCase?.vehicle?.model} - {viewingCase?.vehicle?.licensePlate}
            </DialogDescription>
          </DialogHeader>
          {viewingCase && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Date du vol</Label>
                  <p className="font-medium">
                    {new Date(viewingCase.theftDate).toLocaleDateString("fr-FR")} à {viewingCase.theftTime}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Statut</Label>
                  <p>
                    <Badge className={statusColors[viewingCase.status]}>{statusLabels[viewingCase.status]}</Badge>
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Lieu</Label>
                <p className="font-medium">{viewingCase.location}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium">{viewingCase.description}</p>
              </div>
              {viewingCase.driverName && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Conducteur</Label>
                    <p className="font-medium">{viewingCase.driverName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact</Label>
                    <p className="font-medium">{viewingCase.driverContact}</p>
                  </div>
                </div>
              )}
              {viewingCase.actionsTaken && (
                <div>
                  <Label className="text-muted-foreground">Actions entreprises</Label>
                  <p className="font-medium">{viewingCase.actionsTaken}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingCase(null)}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                setViewingCase(null)
                handleEdit(viewingCase!)
              }}
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCase} onOpenChange={(open) => !open && setEditingCase(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le dossier</DialogTitle>
            <DialogDescription>
              {editingCase?.vehicle?.brand} {editingCase?.vehicle?.model} - {editingCase?.vehicle?.licensePlate}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as CaseStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="UNDER_INVESTIGATION">En enquête</SelectItem>
                  <SelectItem value="RESOLVED">Résolu</SelectItem>
                  <SelectItem value="CLOSED">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driverName">Nom du conducteur</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverContact">Contact</Label>
                <Input
                  id="driverContact"
                  value={formData.driverContact}
                  onChange={(e) => setFormData({ ...formData, driverContact: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionsTaken">Actions entreprises</Label>
              <Textarea
                id="actionsTaken"
                value={formData.actionsTaken}
                onChange={(e) => setFormData({ ...formData, actionsTaken: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCase(null)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce dossier ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le dossier de vol sera définitivement supprimé.
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
