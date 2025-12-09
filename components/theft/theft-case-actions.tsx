"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTheftCase } from "@/lib/actions/theft-cases"
import { toast } from "sonner"
import { ClipboardList, Loader2 } from "lucide-react"
import type { TheftCase, CaseStatus } from "@/lib/types"

interface TheftCaseActionsProps {
  theftCase: TheftCase
}

export function TheftCaseActions({ theftCase }: TheftCaseActionsProps) {
  const [status, setStatus] = useState<CaseStatus>(theftCase.status)
  const [actions, setActions] = useState(theftCase.actionsToken || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSave() {
    setLoading(true)
    try {
      const result = await updateTheftCase(theftCase.id, {
        status,
        actionsToken: actions,
      })

      if (result.success) {
        toast.success("Dossier mis à jour")
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
    <Card className="border-border/50 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-status-info" />
          Actions entreprises
        </CardTitle>
        <CardDescription>Mettez à jour le statut et les actions entreprises pour ce dossier</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut du dossier</label>
            <Select value={status} onValueChange={(value) => setStatus(value as CaseStatus)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="UNDER_INVESTIGATION">Enquête</SelectItem>
                <SelectItem value="RESOLVED">Résolu</SelectItem>
                <SelectItem value="CLOSED">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Actions entreprises</label>
          <Textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            placeholder="Décrivez les actions entreprises pour récupérer le véhicule..."
            rows={5}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
