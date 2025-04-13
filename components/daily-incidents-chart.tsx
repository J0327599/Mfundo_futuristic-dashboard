"use client"

import { useState } from "react"
import { type Incident, getIncidentsByDay } from "@/lib/data"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"

export function DailyIncidentsChart({ incidents }: { incidents: Incident[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const data = getIncidentsByDay(incidents)

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedDate(data.activePayload[0].payload.date)
    }
  }

  const closeDialog = () => {
    setSelectedDate(null)
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} onClick={handlePointClick}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={true}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }}
            minTickGap={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={true}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-xs">
                          {new Date(data.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Incidents</span>
                        <span className="font-bold text-xs">{data.count}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0088FE"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5, onClick: (data) => setSelectedDate(data.payload.date) }}
            className="cursor-pointer"
          />
        </LineChart>
      </ResponsiveContainer>

      {selectedDate && (
        <IncidentDetailDialog
          isOpen={!!selectedDate}
          onClose={closeDialog}
          title={`Incidents on ${new Date(selectedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
          description={`List of all incidents reported on this date`}
          incidents={incidents}
          filterFn={(incident) => {
            if (!incident.createdDate) return false
            const incidentDate = incident.createdDate.toISOString().split("T")[0]
            return incidentDate === selectedDate
          }}
        />
      )}
    </>
  )
}
