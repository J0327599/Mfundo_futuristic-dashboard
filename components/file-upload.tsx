"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileUp, Loader2 } from "lucide-react"
import { parse } from "csv-parse/sync"
import type { Incident } from "@/lib/data"

interface FileUploadProps {
  onDataLoaded: (incidents: Incident[]) => void
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const processIncidents = (incidents: Incident[]) => {
    // Process the data to add computed fields
    return incidents.map((incident) => {
      // Convert created date string to Date object
      const createdDate = incident.Created ? new Date(incident.Created) : undefined

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
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setFileName(file.name)

    try {
      const fileContent = await readFileContent(file)
      const fileExtension = file.name.split(".").pop()?.toLowerCase()

      let incidents: Incident[] = []

      if (fileExtension === "csv") {
        incidents = parseCSV(fileContent)
      } else if (fileExtension === "json") {
        incidents = parseJSON(fileContent)
      } else {
        throw new Error("Unsupported file format. Please upload a CSV or JSON file.")
      }

      const processedIncidents = processIncidents(incidents)
      onDataLoaded(processedIncidents)
    } catch (err) {
      console.error("Error processing file:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }

  const parseCSV = (content: string): Incident[] => {
    try {
      return parse(content, {
        columns: true,
        skip_empty_lines: true,
      }) as Incident[]
    } catch (error) {
      throw new Error("Failed to parse CSV file. Please check the format.")
    }
  }

  const parseJSON = (content: string): Incident[] => {
    try {
      const data = JSON.parse(content)

      // Check if it's an array
      if (!Array.isArray(data)) {
        throw new Error("JSON file must contain an array of incidents")
      }

      // Validate that it has the required fields
      if (data.length > 0 && !("Number" in data[0])) {
        throw new Error("JSON data is missing required fields")
      }

      return data as Incident[]
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid JSON format. Please check the file.")
      }
      throw error
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file-upload">Upload Dataset</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            disabled={isLoading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <Button variant="outline" size="icon" disabled={isLoading} asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            </label>
          </Button>
        </div>
        {fileName && !error && !isLoading && <p className="text-sm text-muted-foreground">Loaded: {fileName}</p>}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
