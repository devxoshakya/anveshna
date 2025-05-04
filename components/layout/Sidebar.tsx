"use client"

import { Home, Flame, Calendar, History, User2, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const sidebarItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Trending",
    href: "/trending",
    icon: Flame,
  },
  // {
  //   title: "Schedule",
  //   href: "/schedule",
  //   icon: Calendar,
  // },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  // {
  //   title: "Profile",
  //   href: "/profile",
  //   icon: User2,
  // },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
]

export function AppSidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden md:block fixed top-16 left-0 bottom-0 w-[70px] border-r bg-background z-30 ">
        <div className="flex flex-col items-center py-4 h-full">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-4 text-muted-foreground hover:text-foreground",
                  isActive && "text-primary",
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Mobile Bottom Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden h-16 bg-background border-t">
        <div className="flex w-full justify-around items-center">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex flex-col items-center justify-center w-full h-full", isActive && "text-primary")}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

