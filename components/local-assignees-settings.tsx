"use client"

import { useState } from "react"
import { useLocalAssignees } from "@/hooks/use-local-assignees"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Plus, RefreshCw, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Incident } from "@/lib/data"

export function LocalAssigneesSettings({ incidents }: { incidents: Incident[] }) {
  const { localAssignees, addLocalAssignee, removeLocalAssignee, resetToDefault } = useLocalAssignees()
  const [newAssignee, setNewAssignee] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Get all unique assignees from incidents
  const allAssignees = Array.from(new Set(incidents.map((inc) => inc["Assigned to"])))
    .filter(Boolean)
    .sort()

  const handleAddAssignee = () => {
    if (!newAssignee.trim()) {
      setError("Please enter an assignee name")
      return
    }

    // Check if the assignee exists in the dataset
    if (!allAssignees.includes(newAssignee)) {
      setError(`"${newAssignee}" is not found in the current dataset`)
      return
    }

    addLocalAssignee(newAssignee)
    setNewAssignee("")
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Assignees</CardTitle>
        <CardDescription>
          Manage which assignees are categorized as "Local" team members. All others will be categorized as "Group".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          {localAssignees.map((assignee) => (
            <Badge key={assignee} variant="secondary" className="px-3 py-1">
              {assignee}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-2 -mr-1"
                onClick={() => removeLocalAssignee(assignee)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </Badge>
          ))}
          {localAssignees.length === 0 && (
            <p className="text-sm text-muted-foreground">No local assignees defined. Add some below.</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add assignee..."
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            list="assignees-list"
          />
          <datalist id="assignees-list">
            {allAssignees.map((assignee) => (
              <option key={assignee} value={assignee} />
            ))}
          </datalist>
          <Button onClick={handleAddAssignee}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-muted-foreground">
          {localAssignees.length} local assignee{localAssignees.length !== 1 ? "s" : ""} defined
        </p>
        <Button variant="outline" onClick={resetToDefault}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </CardFooter>
    </Card>
  )
}
