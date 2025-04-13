"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LocalAssigneesContextType = {
  localAssignees: string[]
  addLocalAssignee: (name: string) => void
  removeLocalAssignee: (name: string) => void
  resetToDefault: () => void
}

const defaultLocalAssignees = ["Vincent THELA", "Martin BALOYI", "Refiloe RAMONYANE"]

const LocalAssigneesContext = createContext<LocalAssigneesContextType | undefined>(undefined)

export function LocalAssigneesProvider({ children }: { children: ReactNode }) {
  const [localAssignees, setLocalAssignees] = useState<string[]>(defaultLocalAssignees)

  // Load saved assignees from localStorage on mount
  useEffect(() => {
    const savedAssignees = localStorage.getItem("localAssignees")
    if (savedAssignees) {
      try {
        setLocalAssignees(JSON.parse(savedAssignees))
      } catch (error) {
        console.error("Failed to parse saved assignees:", error)
      }
    }
  }, [])

  // Save assignees to localStorage when they change
  useEffect(() => {
    localStorage.setItem("localAssignees", JSON.stringify(localAssignees))
  }, [localAssignees])

  const addLocalAssignee = (name: string) => {
    if (!localAssignees.includes(name)) {
      setLocalAssignees([...localAssignees, name])
    }
  }

  const removeLocalAssignee = (name: string) => {
    setLocalAssignees(localAssignees.filter((assignee) => assignee !== name))
  }

  const resetToDefault = () => {
    setLocalAssignees(defaultLocalAssignees)
  }

  return (
    <LocalAssigneesContext.Provider
      value={{
        localAssignees,
        addLocalAssignee,
        removeLocalAssignee,
        resetToDefault,
      }}
    >
      {children}
    </LocalAssigneesContext.Provider>
  )
}

export function useLocalAssignees() {
  const context = useContext(LocalAssigneesContext)
  if (context === undefined) {
    throw new Error("useLocalAssignees must be used within a LocalAssigneesProvider")
  }
  return context
}
