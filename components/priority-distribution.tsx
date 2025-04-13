"use client"

import { useState } from "react"
import { type Incident, getIncidentsByPriority } from "@/lib/data"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

const COLORS = {
  "1 - Critical": "#FF0000",
  "2 - High": "#FF8042",
  "3 - Moderate": "#FFBB28",
  "4 - Low": "#00C49F",
  Unspecified: "#AAAAAA",
}

export function PriorityDistribution({ incidents }: { incidents: Incident[] }) {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const data = getIncidentsByPriority(incidents)

  const handlePriorityClick = (priority: string) => {
    setSelectedPriority(priority)
  }

  const closeDialog = () => {
    setSelectedPriority(null)
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
            onClick={(data) => handlePriorityClick(data.name)}
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
            onClick={(data) => handlePriorityClick(data.value)}
            className="cursor-pointer"
          />
        </PieChart>
      </ResponsiveContainer>

      {selectedPriority && (
        <IncidentDetailDialog
          isOpen={!!selectedPriority}
          onClose={closeDialog}
          title={`${selectedPriority} Priority Incidents`}
          description={`List of all incidents with ${selectedPriority} priority`}
          incidents={incidents}
          filterFn={(incident) => incident.Priority === selectedPriority}
        />
      )}
    </div>
  )
}
