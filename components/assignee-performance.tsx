"use client"

import { useState } from "react"
import type { Incident } from "@/lib/data"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { IncidentDetailDialog } from "@/components/incident-detail-dialog"
import { useLocalAssignees } from "@/hooks/use-local-assignees"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AssigneePerformance({ incidents }: { incidents: Incident[] }) {
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null)
  const { localAssignees } = useLocalAssignees()

  // Only include incidents assigned to local assignees
  const localIncidents = incidents.filter((incident) => localAssignees.includes(incident["Assigned to"]))

  // Calculate metrics for each local assignee
  const assigneeMetrics = localAssignees.map((assignee) => {
    const assigneeIncidents = incidents.filter((inc) => inc["Assigned to"] === assignee)
    const totalIncidents = assigneeIncidents.length

    // Calculate resolution time (for closed incidents)
    const closedIncidents = assigneeIncidents.filter(
      (inc) => (inc.State === "Closed" || inc.State === "Resolved") && inc.businessDurationHours,
    )

    const avgResolutionTime = closedIncidents.length
      ? closedIncidents.reduce((sum, inc) => sum + (inc.businessDurationHours || 0), 0) / closedIncidents.length
      : 0

    // Calculate high priority percentage
    const highPriorityCount = assigneeIncidents.filter(
      (inc) => inc.Priority === "1 - Critical" || inc.Priority === "2 - High",
    ).length

    const highPriorityPercentage = totalIncidents ? (highPriorityCount / totalIncidents) * 100 : 0

    return {
      name: assignee,
      totalIncidents,
      avgResolutionTime: Number.parseFloat(avgResolutionTime.toFixed(2)),
      highPriorityPercentage: Number.parseFloat(highPriorityPercentage.toFixed(2)),
    }
  })

  const handleBarClick = (data: any) => {
    setSelectedAssignee(data.name)
  }

  const closeDialog = () => {
    setSelectedAssignee(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Assignee Performance</CardTitle>
        <CardDescription>Performance metrics for local team members</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="incidents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="incidents">Total Incidents</TabsTrigger>
            <TabsTrigger value="resolution">Avg. Resolution Time</TabsTrigger>
            <TabsTrigger value="priority">High Priority %</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assigneeMetrics} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} incidents`, "Count"]}
                  labelFormatter={(label) => `Assignee: ${label}`}
                />
                <Bar dataKey="totalIncidents" fill="#0088FE" className="cursor-pointer">
                  {assigneeMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#0088FE" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="resolution" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assigneeMetrics} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} hours`, "Avg. Resolution Time"]}
                  labelFormatter={(label) => `Assignee: ${label}`}
                />
                <Bar dataKey="avgResolutionTime" fill="#00C49F" className="cursor-pointer">
                  {assigneeMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#00C49F" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="priority" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assigneeMetrics} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, "High Priority"]}
                  labelFormatter={(label) => `Assignee: ${label}`}
                />
                <Bar dataKey="highPriorityPercentage" fill="#FFBB28" className="cursor-pointer">
                  {assigneeMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#FFBB28" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        {selectedAssignee && (
          <IncidentDetailDialog
            isOpen={!!selectedAssignee}
            onClose={closeDialog}
            title={`Incidents Assigned to ${selectedAssignee}`}
            description={`Details of all incidents assigned to ${selectedAssignee}`}
            incidents={incidents}
            filterFn={(incident) => incident["Assigned to"] === selectedAssignee}
          />
        )}
      </CardContent>
    </Card>
  )
}
