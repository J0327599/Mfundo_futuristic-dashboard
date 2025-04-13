"use client"

import { useState, useEffect } from "react"
import type { Incident } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Moon, Sun } from "lucide-react"
import { format } from "date-fns"
import { useTheme } from "next-themes"

export function DashboardHeader({ incidents }: { incidents: Incident[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the earliest and latest dates from the incidents
  const dates = incidents.map((inc) => inc.createdDate).filter(Boolean) as Date[]
  const minDate = dates.length ? new Date(Math.min(...dates.map((d) => d.getTime()))) : undefined
  const maxDate = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined

  // Format date range for display
  const dateRangeText =
    minDate && maxDate ? `${format(minDate, "MMM d, yyyy")} - ${format(maxDate, "MMM d, yyyy")}` : "Last 3 months"

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">IT Incident Dashboard</h1>
        <p className="text-muted-foreground">Monitoring and analysis of IT incidents from {dateRangeText}</p>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        {mounted ? (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" className="w-10 h-10" disabled>
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
