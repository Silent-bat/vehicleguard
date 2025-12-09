"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { approveUser, rejectUser, toggleUserRole, deleteUser, unapproveUser } from "@/lib/actions/users"
import { CheckCircle, XCircle, Shield, User as UserIcon, Clock, Trash2, UserX } from "lucide-react"
import { toast } from "sonner"
import { CreateUserDialog } from "./create-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string | null
  role: string
  isApproved: boolean
  approvedAt: Date | null
  emailVerified: boolean
  createdAt: Date
  _count: {
    vehicles: number
    theftCases: number
  }
}

export function UserManagement({ users: initialUsers }: { users: User[] }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)

  const handleUserCreated = () => {
    router.refresh()
  }

  const handleApprove = async (userId: string) => {
    setLoading(userId)
    const result = await approveUser(userId)
    setLoading(null)

    if (result.success) {
      toast.success("Utilisateur approuvé avec succès")
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isApproved: true, approvedAt: new Date() } : u
      ))
    } else {
      toast.error(result.error || "Erreur lors de l'approbation")
    }
  }

  const handleReject = async (userId: string) => {
    setLoading(userId)
    const result = await rejectUser(userId)
    setLoading(null)

    if (result.success) {
      toast.success("Utilisateur rejeté et supprimé")
      setUsers(users.filter(u => u.id !== userId))
    } else {
      toast.error(result.error || "Erreur lors du rejet")
    }
  }

  const handleToggleRole = async (userId: string) => {
    setLoading(userId)
    const result = await toggleUserRole(userId)
    setLoading(null)

    if (result.success && result.data) {
      toast.success("Rôle modifié avec succès")
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: result.data.role } : u
      ))
    } else {
      toast.error(result.error || "Erreur lors du changement de rôle")
    }
  }

  const handleDelete = async (userId: string) => {
    setLoading(userId)
    const result = await deleteUser(userId)
    setLoading(null)

    if (result.success) {
      toast.success("Utilisateur supprimé avec succès")
      setUsers(users.filter(u => u.id !== userId))
    } else {
      toast.error(result.error || "Erreur lors de la suppression")
    }
  }

  const handleUnapprove = async (userId: string) => {
    setLoading(userId)
    const result = await unapproveUser(userId)
    setLoading(null)

    if (result.success) {
      toast.success("Approbation retirée avec succès")
      router.refresh()
    } else {
      toast.error(result.error || "Erreur lors du retrait de l'approbation")
    }
  }

  const pendingUsers = users.filter(u => !u.isApproved && u.role !== "ADMIN")
  const approvedUsers = users.filter(u => u.isApproved || u.role === "ADMIN")

  return (
    <div className="space-y-6">
      {/* Create User Button */}
      <div className="flex justify-end">
        <CreateUserDialog onUserCreated={handleUserCreated} />
      </div>

      {/* Pending Approvals */}
      {pendingUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Comptes en attente d'approbation ({pendingUsers.length})
            </CardTitle>
            <CardDescription>
              Approuvez ou rejetez les nouvelles demandes de compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(user.id)}
                        disabled={loading === user.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={loading === user.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action supprimera définitivement le compte de {user.email}. Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReject(user.id)}>
                              Confirmer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* All Users */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les utilisateurs ({approvedUsers.length})</CardTitle>
          <CardDescription>
            Gérez les rôles et les permissions des utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Véhicules</TableHead>
                <TableHead>Dossiers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role === "ADMIN" ? (
                        <><Shield className="h-3 w-3 mr-1" /> Admin</>
                      ) : (
                        <><UserIcon className="h-3 w-3 mr-1" /> User</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isApproved ? "default" : "secondary"}>
                      {user.isApproved ? "Approuvé" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user._count.vehicles}</TableCell>
                  <TableCell>{user._count.theftCases}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditUserDialog user={user} onUserUpdated={() => router.refresh()} />
                      
                      {user.isApproved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnapprove(user.id)}
                          disabled={loading === user.id}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Retirer approbation
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={loading === user.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action supprimera définitivement le compte de {user.email} et toutes ses données associées. Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(user.id)}>
                              Confirmer la suppression
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
