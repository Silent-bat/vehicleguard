"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles"
import { toast } from "sonner"
import { Plus, Pencil, Loader2 } from "lucide-react"
import type { Vehicle } from "@/lib/types"

const vehicleSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  licensePlate: z.string().min(1, "La plaque d'immatriculation est requise"),
  year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  color: z.string().min(1, "La couleur est requise"),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface VehicleFormProps {
  vehicle?: Vehicle
  mode?: "create" | "edit"
}

export function VehicleForm({ vehicle, mode = "create" }: VehicleFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          brand: vehicle.brand,
          model: vehicle.model,
          licensePlate: vehicle.licensePlate,
          year: vehicle.year,
          color: vehicle.color,
        }
      : {
          brand: "",
          model: "",
          licensePlate: "",
          year: new Date().getFullYear(),
          color: "",
        },
  })

  async function onSubmit(data: VehicleFormData) {
    setLoading(true)
    try {
      const result = mode === "create" ? await createVehicle(data) : await updateVehicle(vehicle!.id, data)

      if (result.success) {
        toast.success(mode === "create" ? "Véhicule enregistré" : "Véhicule mis à jour")
        setOpen(false)
        reset()
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nouveau véhicule" : "Modifier le véhicule"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Enregistrez un nouveau véhicule dans votre flotte"
              : "Modifiez les informations du véhicule"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input id="brand" {...register("brand")} placeholder="Toyota Hilux" />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input id="model" {...register("model")} placeholder="2.8 GD-6" />
              {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
            <Input id="licensePlate" {...register("licensePlate")} placeholder="CE-123-YA" />
            {errors.licensePlate && <p className="text-xs text-destructive">{errors.licensePlate.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input id="year" type="number" {...register("year")} placeholder="2024" />
              {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Input id="color" {...register("color")} placeholder="Blanc" />
              {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Enregistrer" : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
