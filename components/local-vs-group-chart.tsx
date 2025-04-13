"use client"

import { useState } from "react"
import type { Incident } from "@/lib/data"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"
import { useLocalAssignees } from "@/hooks/use-local-assignees"

const COLORS = {
  Local: "#0088FE",
  Group: "#00C49F",
}

export function LocalVsGroupChart({ incidents }: { incidents: Incident[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { localAssignees } = useLocalAssignees()

  // Group incidents by Local vs Group
  const localCount = incidents.filter((incident) => localAssignees.includes(incident["Assigned to"])).length

  const groupCount = incidents.length - localCount

  const data = [
    { name: "Local", value: localCount },
    { name: "Group", value: groupCount },
  ]

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  const closeDialog = () => {
    setSelectedCategory(null)
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
            onClick={(data) => handleCategoryClick(data.name)}
            className="cursor-pointer"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
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
            onClick={(data) => handleCategoryClick(data.value)}
            className="cursor-pointer"
          />
        </PieChart>
      </ResponsiveContainer>

      {selectedCategory && (
        <IncidentDetailDialog
          isOpen={!!selectedCategory}
          onClose={closeDialog}
          title={`${selectedCategory} Assignees`}
          description={`Incidents assigned to ${selectedCategory === "Local" ? "local team members" : "group members"}`}
          incidents={incidents}
          filterFn={(incident) => {
            const isLocal = localAssignees.includes(incident["Assigned to"])
            return selectedCategory === "Local" ? isLocal : !isLocal
          }}
        />
      )}
    </div>
  )
}
