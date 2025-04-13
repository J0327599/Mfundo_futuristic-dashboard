"use client"

import { useState } from "react"
import { type Incident, getIncidentsByMonth } from "@/lib/data"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

export function MonthlyTrendChart({ incidents }: { incidents: Incident[] }) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const data = getIncidentsByMonth(incidents)

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedMonth(data.activePayload[0].payload.name)
    }
  }

  const closeDialog = () => {
    setSelectedMonth(null)
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} onClick={handleBarClick}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={true} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={true}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                        <span className="font-bold text-xs">{data.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Incidents</span>
                        <span className="font-bold text-xs">{data.value}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="value"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            className="cursor-pointer"
            onClick={(data) => setSelectedMonth(data.name)}
          />
        </BarChart>
      </ResponsiveContainer>

      {selectedMonth && (
        <IncidentDetailDialog
          isOpen={!!selectedMonth}
          onClose={closeDialog}
          title={`Incidents in ${selectedMonth}`}
          description={`List of all incidents reported in ${selectedMonth}`}
          incidents={incidents}
          filterFn={(incident) => {
            if (!incident.createdDate) return false
            const incidentMonth = incident.createdDate.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
            return incidentMonth === selectedMonth
          }}
        />
      )}
    </>
  )
}
