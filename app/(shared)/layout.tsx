import type React from "react"
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { AppSidebar } from "@/components/layout/Sidebar"



export const metadata: Metadata = {
  title: "Anveshna.",
  description: "Anime streaming platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    
        
    <div className="flex min-h-screen flex-col">
    <Navbar />
    <AppSidebar />
    <main className="flex-1 md:ml-[70px] px-2 md:p-4 pt-4 overflow-auto hide-scrollbar">{children}</main>
  </div>
     
  )
}

