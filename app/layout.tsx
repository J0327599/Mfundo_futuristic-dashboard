import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LocalAssigneesProvider } from "@/hooks/use-local-assignees"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "IT Incident Dashboard",
  description: "Monitoring and analysis of IT incidents",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocalAssigneesProvider>{children}</LocalAssigneesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'