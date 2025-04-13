"use client"

import { useState } from "react"
import type { Incident } from "@/lib/data"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface IncidentDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  incidents: Incident[]
  filterFn?: (incident: Incident) => boolean
}

export function IncidentDetailDialog({
  isOpen,
  onClose,
  title,
  description,
  incidents,
  filterFn,
}: IncidentDetailDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter incidents based on the provided filter function and search query
  const filteredIncidents = incidents
    .filter(filterFn || (() => true))
    .filter((incident) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        incident.Number.toLowerCase().includes(query) ||
        incident["Short description"].toLowerCase().includes(query) ||
        incident.Category.toLowerCase().includes(query) ||
        incident["Assigned to"].toLowerCase().includes(query) ||
        incident.State.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => (b.createdDate?.getTime() || 0) - (a.createdDate?.getTime() || 0))
    .slice(0, 100) // Limit to 100 incidents for performance

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Caller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident) => (
                  <TableRow key={incident.Number}>
                    <TableCell className="font-medium">{incident.Number}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{incident["Caller"]}</TableCell>
                    <TableCell>{incident.Category}</TableCell>
                    <TableCell>{incident["Assigned to"] || "Unassigned"}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={incident.Priority} />
                    </TableCell>
                    <TableCell>
                      <StateBadge state={incident.State} />
                    </TableCell>
                    <TableCell>
                      {incident.createdDate ? format(incident.createdDate, "MMM d, yyyy") : "Unknown"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No incidents found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "1 - Critical":
      return <Badge variant="destructive">{priority}</Badge>
    case "2 - High":
      return <Badge className="bg-orange-500">{priority}</Badge>
    case "3 - Moderate":
      return <Badge className="bg-yellow-500">{priority}</Badge>
    case "4 - Low":
      return <Badge className="bg-green-500">{priority}</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

function StateBadge({ state }: { state: string }) {
  switch (state) {
    case "Closed":
      return <Badge className="bg-green-500">{state}</Badge>
    case "Resolved":
      return <Badge className="bg-green-700">{state}</Badge>
    case "In Progress":
      return <Badge className="bg-blue-500">{state}</Badge>
    case "Open":
      return <Badge className="bg-yellow-500">{state}</Badge>
    case "Pending":
      return <Badge className="bg-orange-500">{state}</Badge>
    default:
      return <Badge variant="outline">{state}</Badge>
  }
}
