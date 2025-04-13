"use client"

import { useState } from "react"
import { type Incident, getIncidentsByCategory } from "@/lib/data"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#6B66FF",
  "#FFD700",
  "#FF69B4",
]

export function CategoryBreakdown({ incidents }: { incidents: Incident[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const data = getIncidentsByCategory(incidents).slice(0, 10) // Top 10 categories

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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          title={`${selectedCategory} Incidents`}
          description={`List of all incidents in the ${selectedCategory} category`}
          incidents={incidents}
          filterFn={(incident) => incident.Category === selectedCategory}
        />
      )}
    </div>
  )
}
