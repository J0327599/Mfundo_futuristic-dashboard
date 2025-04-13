import { parse } from "csv-parse/sync"

export interface Incident {
  Number: string
  Active: string
  Caller: string
  Created: string
  "Activity due": string | null
  "Short description": string
  Approval: string
  "Assigned to": string
  "Business duration": string
  State: string
  Category: string
  Impact: string
  Urgency: string
  Priority: string
  createdDate?: Date
  businessDurationHours?: number
}

export async function fetchIncidents(): Promise<Incident[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Incidents_Last%203%20months-LzMVeIw7ApRaNcptZ6wxzghkoSjahw.csv",
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch incidents: ${response.status}`)
    }

    const csvData = await response.text()
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    }) as Incident[]

    // Process the data to add computed fields
    return records.map((incident) => {
      // Convert created date string to Date object
      const createdDate = new Date(incident.Created)

      // Convert business duration (in seconds) to hours
      let businessDurationHours = 0
      if (incident["Business duration"]) {
        businessDurationHours = Number.parseInt(incident["Business duration"]) / 3600
      }

      return {
        ...incident,
        createdDate,
        businessDurationHours,
      }
    })
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return []
  }
}

export function getIncidentsByDay(incidents: Incident[]) {
  const incidentsByDay = new Map<string, number>()

  incidents.forEach((incident) => {
    const date = incident.createdDate?.toISOString().split("T")[0] || ""
    incidentsByDay.set(date, (incidentsByDay.get(date) || 0) + 1)
  })

  // Sort by date
  return Array.from(incidentsByDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }))
}

export function getIncidentsByCategory(incidents: Incident[]) {
  const categoryCounts = new Map<string, number>()

  incidents.forEach((incident) => {
    const category = incident.Category || "Uncategorized"
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
  })

  return Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))
}

export function getIncidentsByPriority(incidents: Incident[]) {
  const priorityCounts = new Map<string, number>()

  incidents.forEach((incident) => {
    const priority = incident.Priority || "Unspecified"
    priorityCounts.set(priority, (priorityCounts.get(priority) || 0) + 1)
  })

  // Define the order of priorities
  const priorityOrder = ["1 - Critical", "2 - High", "3 - Moderate", "4 - Low", "Unspecified"]

  return Array.from(priorityCounts.entries())
    .sort((a, b) => {
      return priorityOrder.indexOf(a[0]) - priorityOrder.indexOf(b[0])
    })
    .map(([name, value]) => ({ name, value }))
}

export function getIncidentsByState(incidents: Incident[]) {
  const stateCounts = new Map<string, number>()

  incidents.forEach((incident) => {
    const state = incident.State || "Unknown"
    stateCounts.set(state, (stateCounts.get(state) || 0) + 1)
  })

  return Array.from(stateCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))
}

export function getAverageResolutionTimeByCategory(incidents: Incident[]) {
  const categoryTimes = new Map<string, number[]>()

  incidents.forEach((incident) => {
    if (incident.State === "Closed" && incident.businessDurationHours) {
      const category = incident.Category || "Uncategorized"
      if (!categoryTimes.has(category)) {
        categoryTimes.set(category, [])
      }
      categoryTimes.get(category)?.push(incident.businessDurationHours)
    }
  })

  const result = Array.from(categoryTimes.entries())
    .map(([category, times]) => {
      const average = times.reduce((sum, time) => sum + time, 0) / times.length
      return { category, average: Number.parseFloat(average.toFixed(2)) }
    })
    .sort((a, b) => b.average - a.average)
    .slice(0, 10) // Top 10 categories by resolution time

  return result
}

export function getIncidentsByMonth(incidents: Incident[]) {
  const monthCounts = new Map<string, number>()

  incidents.forEach((incident) => {
    if (incident.createdDate) {
      const month = incident.createdDate.toLocaleString("default", { month: "short", year: "numeric" })
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1)
    }
  })

  return Array.from(monthCounts.entries())
    .sort((a, b) => {
      // Extract month and year for proper sorting
      const [monthA, yearA] = a[0].split(" ")
      const [monthB, yearB] = b[0].split(" ")

      if (yearA !== yearB) return Number.parseInt(yearA) - Number.parseInt(yearB)

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months.indexOf(monthA) - months.indexOf(monthB)
    })
    .map(([name, value]) => ({ name, value }))
}

export function getIncidentsByAssignee(incidents: Incident[]) {
  const assigneeCounts = new Map<string, number>()

  incidents.forEach((incident) => {
    const assignee = incident["Assigned to"] || "Unassigned"
    assigneeCounts.set(assignee, (assigneeCounts.get(assignee) || 0) + 1)
  })

  return Array.from(assigneeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) // Top 15 assignees
    .map(([name, value]) => ({ name, value }))
}
