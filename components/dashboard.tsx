"use client"

import { useState, useEffect } from "react"
import { fetchIncidents, type Incident } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { RecentIncidents } from "@/components/recent-incidents"
import { IncidentStats } from "@/components/incident-stats"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { PriorityDistribution } from "@/components/priority-distribution"
import { ResolutionTimeChart } from "@/components/resolution-time-chart"
import { StateDistribution } from "@/components/state-distribution"
import { DailyIncidentsChart } from "@/components/daily-incidents-chart"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { DashboardHeader } from "@/components/dashboard-header"
import { IncidentsByAssignee } from "@/components/incidents-by-assignee"
import { FileUpload } from "@/components/file-upload"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LocalVsGroupChart } from "@/components/local-vs-group-chart"
import { AssigneePerformance } from "@/components/assignee-performance"
import { LocalAssigneesSettings } from "@/components/local-assignees-settings"

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchIncidents()
        setIncidents(data)
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleDataLoaded = (newIncidents: Incident[]) => {
    setIncidents(newIncidents)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <DashboardHeader incidents={incidents} />

        <div className="grid gap-4 md:grid-cols-2">
          <FileUpload onDataLoaded={handleDataLoaded} />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Dataset Information</CardTitle>
              <CardDescription>
                {incidents.length > 0
                  ? `Currently displaying ${incidents.length} incidents`
                  : "No data loaded. Please upload a dataset."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload a CSV or JSON file containing incident data. The file should include fields like Number, Created,
                State, Category, Priority, etc.
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <IncidentStats incidents={incidents} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Incident Trend</CardTitle>
                  <CardDescription>Daily incident volume over the last 3 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview incidents={incidents} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Distribution of incidents by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown incidents={incidents} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Incidents by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  <PriorityDistribution incidents={incidents} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Resolution Time</CardTitle>
                  <CardDescription>Average resolution time by category (hours)</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResolutionTimeChart incidents={incidents} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Incidents</CardTitle>
                  <CardDescription>Latest reported incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentIncidents incidents={incidents} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>State Distribution</CardTitle>
                  <CardDescription>Current state of all incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  <StateDistribution incidents={incidents} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Daily Incident Volume</CardTitle>
                  <CardDescription>Number of incidents reported each day</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <DailyIncidentsChart incidents={incidents} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                  <CardDescription>Incident volume by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyTrendChart incidents={incidents} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7">
                <CardHeader>
                  <CardTitle>Incidents by Assignee</CardTitle>
                  <CardDescription>Distribution of incidents by assigned personnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <IncidentsByAssignee incidents={incidents} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Local vs Group Distribution</CardTitle>
                  <CardDescription>Incidents assigned to local team vs group</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocalVsGroupChart incidents={incidents} />
                </CardContent>
              </Card>

              <div className="lg:col-span-4">
                <AssigneePerformance incidents={incidents} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the dashboard appearance and theme</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSwitcher />
              </CardContent>
            </Card>

            <LocalAssigneesSettings incidents={incidents} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>View and export detailed incident reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Report functionality will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
