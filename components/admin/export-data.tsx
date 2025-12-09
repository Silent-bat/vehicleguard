"use client"

import { useState } from "react"
import { Download, FileJson } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportData } from "@/lib/actions/admin"

export function ExportData() {
  const [exportType, setExportType] = useState<"vehicles" | "cases" | "all">("all")
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const result = await exportData(exportType)
      if (result.success && result.data) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `vehicleguard-export-${exportType}-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export des données
        </CardTitle>
        <CardDescription>Téléchargez vos données au format JSON</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Select value={exportType} onValueChange={(v) => setExportType(v as typeof exportType)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les données</SelectItem>
              <SelectItem value="vehicles">Véhicules uniquement</SelectItem>
              <SelectItem value="cases">Dossiers uniquement</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} disabled={isLoading}>
            <FileJson className="mr-2 h-4 w-4" />
            {isLoading ? "Export en cours..." : "Exporter JSON"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
