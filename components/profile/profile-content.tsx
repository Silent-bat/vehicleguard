"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/lib/actions/profile"
import { Shield, User as UserIcon, Mail, Calendar } from "lucide-react"
import { toast } from "sonner"

interface ProfileContentProps {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
    role: string
    createdAt: Date
  }
}

export function ProfileContent({ user }: ProfileContentProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
  })

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email[0].toUpperCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast.error("Le nom est requis")
      return
    }

    setLoading(true)
    const result = await updateProfile({
      name: formData.name,
    })
    setLoading(false)

    if (result.success) {
      toast.success("Profil mis à jour avec succès")
    } else {
      toast.error(result.error || "Erreur lors de la mise à jour")
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du Profil</CardTitle>
          <CardDescription>
            Vos informations personnelles et votre rôle dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name || "Sans nom"}</h2>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role === "ADMIN" ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      Administrateur
                    </>
                  ) : (
                    <>
                      <UserIcon className="h-3 w-3 mr-1" />
                      Utilisateur
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Membre depuis le {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Modifier le Profil</CardTitle>
          <CardDescription>
            Mettez à jour vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Votre nom complet"
                disabled={loading}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                L'email ne peut pas être modifié. Contactez un administrateur pour changer votre email.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du Compte</CardTitle>
          <CardDescription>
            Votre activité sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Rôle</p>
              <p className="text-2xl font-bold">
                {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Statut du compte</p>
              <Badge variant="default" className="text-sm">
                Actif
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
