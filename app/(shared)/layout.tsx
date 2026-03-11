"use client";
import type React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { AppSidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import { usePathname } from "next/navigation"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isChat = pathname === "/chat";
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AppSidebar />
      <main className="flex-1 md:ml-17.5 md:p-4 pt-4 overflow-auto hide-scrollbar">{children}</main>
      {!isChat && (
        <div className="md:ml-17.5 mb-16 md:mb-0">
          <Footer />
        </div>
      )}
    </div>
  )
}

