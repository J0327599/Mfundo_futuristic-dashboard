"use client"

import { useState } from "react"
import { type Incident, getAverageResolutionTimeByCategory } from "@/lib/data"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

export function ResolutionTimeChart({ incidents }: { incidents: Incident[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const data = getAverageResolutionTimeByCategory(incidents)

  const handleBarClick = (data: any) => {
    setSelectedCategory(data.category)
  }

  const closeDialog = () => {
    setSelectedCategory(null)
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          onClick={handleBarClick}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} hours`, "Avg. Resolution Time"]}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Bar dataKey="average" fill="#0088FE" radius={[0, 4, 4, 0]} className="cursor-pointer" />
        </BarChart>
      </ResponsiveContainer>

      {selectedCategory && (
        <IncidentDetailDialog
          isOpen={!!selectedCategory}
          onClose={closeDialog}
          title={`${selectedCategory} Incidents`}
          description={`List of all incidents in the ${selectedCategory} category`}
          incidents={incidents}
          filterFn={(incident) =>
            incident.Category === selectedCategory && (incident.State === "Closed" || incident.State === "Resolved")
          }
        />
      )}
    </>
  )
}
