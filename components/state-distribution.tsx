"use client"

import { useState } from "react"
import { type Incident, getIncidentsByState } from "@/lib/data"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

const COLORS = {
  Closed: "#00C49F",
  Resolved: "#82CA9D",
  "In Progress": "#0088FE",
  Open: "#FFBB28",
  Pending: "#FF8042",
  "Awaiting User Info": "#8884D8",
  Unknown: "#AAAAAA",
}

export function StateDistribution({ incidents }: { incidents: Incident[] }) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const data = getIncidentsByState(incidents)

  const handleStateClick = (state: string) => {
    setSelectedState(state)
  }

  const closeDialog = () => {
    setSelectedState(null)
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            onClick={(data) => handleStateClick(data.name)}
            className="cursor-pointer"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#AAAAAA"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} incidents`, "Count"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "6px",
              border: "1px solid #ccc",
              padding: "8px",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            onClick={(data) => handleStateClick(data.value)}
            className="cursor-pointer"
          />
        </PieChart>
      </ResponsiveContainer>

      {selectedState && (
        <IncidentDetailDialog
          isOpen={!!selectedState}
          onClose={closeDialog}
          title={`${selectedState} Incidents`}
          description={`List of all incidents in ${selectedState} state`}
          incidents={incidents}
          filterFn={(incident) => incident.State === selectedState}
        />
      )}
    </div>
  )
}
