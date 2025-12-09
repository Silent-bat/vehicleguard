"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createTheftCase } from "@/lib/actions/theft-cases"
import { toast } from "sonner"
import { CalendarIcon, Loader2, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Vehicle } from "@/lib/types"

const theftSchema = z.object({
  vehicleId: z.string().min(1, "Sélectionnez un véhicule"),
  theftDate: z.date({ required_error: "La date est requise" }),
  theftTime: z.string().min(1, "L'heure est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  driverName: z.string().optional(),
  driverContact: z.string().optional(),
})

type TheftFormData = z.infer<typeof theftSchema>

interface ReportTheftFormProps {
  vehicles: Vehicle[]
}

export function ReportTheftForm({ vehicles }: ReportTheftFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TheftFormData>({
    resolver: zodResolver(theftSchema),
    defaultValues: {
      vehicleId: "",
      theftTime: "",
      location: "",
      description: "",
      driverName: "",
      driverContact: "",
    },
  })

  const theftDate = watch("theftDate")
  const selectedVehicleId = watch("vehicleId")

  async function onSubmit(data: TheftFormData) {
    setLoading(true)
    try {
      const result = await createTheftCase({
        ...data,
        driverName: data.driverName || undefined,
        driverContact: data.driverContact || undefined,
      })

      if (result.success) {
        toast.success("Vol signalé avec succès")
        reset()
        router.push("/theft-cases")
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-danger" />
              Informations du vol
            </CardTitle>
            <CardDescription>Renseignez les détails du vol</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Véhicule volé</Label>
              <Select value={selectedVehicleId} onValueChange={(value) => setValue("vehicleId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && <p className="text-xs text-destructive">{errors.vehicleId.message}</p>}
            </div>

            {selectedVehicle && (
              <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
                <p className="text-sm font-medium">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedVehicle.licensePlate} • {selectedVehicle.year} • {selectedVehicle.color}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date du vol</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !theftDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {theftDate ? format(theftDate, "PPP", { locale: fr }) : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={theftDate}
                      onSelect={(date) => date && setValue("theftDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.theftDate && <p className="text-xs text-destructive">{errors.theftDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="theftTime">Heure du vol</Label>
                <Input id="theftTime" type="time" {...register("theftTime")} />
                {errors.theftTime && <p className="text-xs text-destructive">{errors.theftTime.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lieu du vol</Label>
              <Input id="location" {...register("location")} placeholder="Yaoundé, Quartier Bastos" />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du vol</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Décrivez les circonstances du vol..."
                rows={4}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Informations du conducteur</CardTitle>
            <CardDescription>Optionnel - Renseignez les informations du conducteur au moment du vol</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driverName">Nom du conducteur</Label>
              <Input id="driverName" {...register("driverName")} placeholder="Amina Manga" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverContact">Contact du conducteur</Label>
              <Input id="driverContact" {...register("driverContact")} placeholder="+237 6 77 12 34 56" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Signaler le vol
        </Button>
      </div>
    </form>
  )
}
