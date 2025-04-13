import type { Incident } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function RecentIncidents({ incidents }: { incidents: Incident[] }) {
  // Sort incidents by created date (newest first) and take the 5 most recent
  const recentIncidents = [...incidents]
    .sort((a, b) => {
      return (b.createdDate?.getTime() || 0) - (a.createdDate?.getTime() || 0)
    })
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {recentIncidents.map((incident) => (
        <div key={incident.Number} className="flex flex-col space-y-2 border-b pb-4 last:border-0">
          <div className="flex items-center justify-between">
            <div className="font-medium">{incident.Number}</div>
            <PriorityBadge priority={incident.Priority} />
          </div>
          <div className="text-sm">{incident["Short description"]}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>Assigned to: {incident["Assigned to"] || "Unassigned"}</div>
            <div>{incident.createdDate ? format(incident.createdDate, "MMM d, yyyy HH:mm") : "Unknown date"}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const variant = "outline"
  const label = priority || "Unknown"

  switch (priority) {
    case "1 - Critical":
      return <Badge variant="destructive">{label}</Badge>
    case "2 - High":
      return <Badge className="bg-orange-500">{label}</Badge>
    case "3 - Moderate":
      return <Badge className="bg-yellow-500">{label}</Badge>
    case "4 - Low":
      return <Badge className="bg-green-500">{label}</Badge>
    default:
      return <Badge variant="outline">{label}</Badge>
  }
}
