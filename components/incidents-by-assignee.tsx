"use client"

import { useState } from "react"
import { type Incident, getIncidentsByAssignee } from "@/lib/data"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

export function IncidentsByAssignee({ incidents }: { incidents: Incident[] }) {
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null)
  const data = getIncidentsByAssignee(incidents)

  const handleBarClick = (data: any) => {
    setSelectedAssignee(data.name)
  }

  const closeDialog = () => {
    setSelectedAssignee(null)
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${value} incidents`, "Count"]}
            labelFormatter={(label) => `Assignee: ${label}`}
          />
          <Bar
            dataKey="value"
            fill="#82ca9d"
            radius={[0, 4, 4, 0]}
            className="cursor-pointer"
            onClick={handleBarClick}
          />
        </BarChart>
      </ResponsiveContainer>

      {selectedAssignee && (
        <IncidentDetailDialog
          isOpen={!!selectedAssignee}
          onClose={closeDialog}
          title={`Incidents Assigned to ${selectedAssignee}`}
          description={`List of all incidents assigned to ${selectedAssignee}`}
          incidents={incidents}
          filterFn={(incident) => incident["Assigned to"] === selectedAssignee}
        />
      )}
    </>
  )
}
