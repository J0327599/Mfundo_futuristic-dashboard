"use client"

import { useState } from "react"
import type { Incident } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock, FileWarning } from "lucide-react"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

export function IncidentStats({ incidents }: { incidents: Incident[] }) {
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean
    title: string
    description: string
    filterFn?: (incident: Incident) => boolean
  }>({
    isOpen: false,
    title: "",
    description: "",
  })

  // Calculate total incidents
  const totalIncidents = incidents.length

  // Calculate open incidents
  const openIncidents = incidents.filter((inc) => inc.State !== "Closed" && inc.State !== "Resolved").length

  // Calculate closed incidents
  const closedIncidents = incidents.filter((inc) => inc.State === "Closed" || inc.State === "Resolved").length

  // Calculate high priority incidents
  const highPriorityIncidents = incidents.filter(
    (inc) => inc.Priority === "1 - Critical" || inc.Priority === "2 - High",
  ).length

  // Calculate average resolution time in hours
  const closedIncidentsWithDuration = incidents.filter(
    (inc) => (inc.State === "Closed" || inc.State === "Resolved") && inc.businessDurationHours,
  )

  const avgResolutionTime = closedIncidentsWithDuration.length
    ? closedIncidentsWithDuration.reduce((sum, inc) => sum + (inc.businessDurationHours || 0), 0) /
      closedIncidentsWithDuration.length
    : 0

  const handleCardClick = (title: string, description: string, filterFn?: (incident: Incident) => boolean) => {
    setDialogConfig({
      isOpen: true,
      title,
      description,
      filterFn,
    })
  }

  const closeDialog = () => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleCardClick("All Incidents", "Complete list of all incidents in the system", () => true)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          <FileWarning className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalIncidents}</div>
          <p className="text-xs text-muted-foreground">All incidents in the last 3 months</p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() =>
          handleCardClick(
            "Open Incidents",
            "Incidents that are still open and need attention",
            (inc) => inc.State !== "Closed" && inc.State !== "Resolved",
          )
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openIncidents}</div>
          <p className="text-xs text-muted-foreground">
            {((openIncidents / totalIncidents) * 100).toFixed(1)}% of total incidents
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() =>
          handleCardClick(
            "Closed Incidents",
            "Incidents that have been resolved and closed",
            (inc) => inc.State === "Closed" || inc.State === "Resolved",
          )
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closed Incidents</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{closedIncidents}</div>
          <p className="text-xs text-muted-foreground">
            {((closedIncidents / totalIncidents) * 100).toFixed(1)}% of total incidents
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() =>
          handleCardClick(
            "High Resolution Time Incidents",
            "Incidents with longer than average resolution times",
            (inc) =>
              (inc.State === "Closed" || inc.State === "Resolved") &&
              inc.businessDurationHours !== undefined &&
              inc.businessDurationHours > avgResolutionTime,
          )
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgResolutionTime.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground">For {closedIncidentsWithDuration.length} resolved incidents</p>
        </CardContent>
      </Card>

      <IncidentDetailDialog
        isOpen={dialogConfig.isOpen}
        onClose={closeDialog}
        title={dialogConfig.title}
        description={dialogConfig.description}
        incidents={incidents}
        filterFn={dialogConfig.filterFn}
      />
    </>
  )
}
