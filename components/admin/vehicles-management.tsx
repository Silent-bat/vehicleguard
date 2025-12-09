"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Search, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Vehicle } from "@/lib/types"
import { createVehicle, updateVehicle, deleteVehicle } from "@/lib/actions/vehicles"
import { useRouter } from "next/navigation"

interface VehiclesManagementProps {
  vehicles: Vehicle[]
}

export function VehiclesManagement({ vehicles }: VehiclesManagementProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    licensePlate: "",
    year: new Date().getFullYear(),
    color: "",
  })

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVehicles.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredVehicles.map((v) => v.id))
    }
  }

  const handleAdd = () => {
    setFormData({
      brand: "",
      model: "",
      licensePlate: "",
      year: new Date().getFullYear(),
      color: "",
    })
    setIsAddDialogOpen(true)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      year: vehicle.year,
      color: vehicle.color,
    })
    setEditingVehicle(vehicle)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData)
        setEditingVehicle(null)
      } else {
        await createVehicle(formData)
        setIsAddDialogOpen(false)
      }
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!vehicleToDelete) return
    setIsLoading(true)
    try {
      await deleteVehicle(vehicleToDelete)
      setVehicleToDelete(null)
      setIsDeleteDialogOpen(false)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    setIsLoading(true)
    try {
      await Promise.all(selectedIds.map((id) => deleteVehicle(id)))
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
              <CardTitle>Gestion des Véhicules</CardTitle>
              <CardDescription>{vehicles.length} véhicule(s) enregistré(s)</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedIds.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete} disabled={isLoading}>
                Supprimer ({selectedIds.length})
              </Button>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === filteredVehicles.length && filteredVehicles.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Plaque</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Vols</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(vehicle.id)}
                        onCheckedChange={() => toggleSelect(vehicle.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{vehicle.brand}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.licensePlate}</Badge>
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell>
                      <Badge
                        variant={vehicle.theftCases && vehicle.theftCases.length > 0 ? "destructive" : "secondary"}
                      >
                        {vehicle.theftCases?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setVehicleToDelete(vehicle.id)
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
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucun véhicule trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingVehicle}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingVehicle(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}</DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Modifiez les informations du véhicule"
                : "Renseignez les informations du nouveau véhicule"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marque</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Camry"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  placeholder="AB-123-CD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Noir"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setEditingVehicle(null)
              }}
            >
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
            <AlertDialogTitle>Supprimer ce véhicule ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les dossiers de vol associés seront également supprimés.
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
