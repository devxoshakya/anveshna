"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalPages: number
  initialPage?: number
  onPageChange?: (page: number) => void
  tabs?: string[]
  initialTab?: string
  onTabChange?: (tab: string) => void
}

export default function PaginationComponent({
  totalPages = 10,
  initialPage = 1,
  onPageChange,
  tabs = ["NEWEST", "POPULAR", "TOP RATED"],
  initialTab = "TOP RATED",
  onTabChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [activeTab, setActiveTab] = useState(initialTab)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)

  // Check if tabs container is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (tabsContainerRef.current) {
        const { scrollWidth, clientWidth } = tabsContainerRef.current
        setIsScrollable(scrollWidth > clientWidth)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)
    return () => window.removeEventListener("resize", checkScrollable)
  }, [])

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (tabsContainerRef.current && isScrollable) {
      const activeTabElement = tabsContainerRef.current.querySelector('[data-state="active"]')
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }
  }, [activeTab, isScrollable])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    onPageChange?.(page)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 p-4">
      <div
        ref={tabsContainerRef}
        className={cn(
          "flex rounded-md sm:w-auto overflow-x-auto hide-scrollbar",
          isScrollable && "after:content-[''] after:w-4 after:flex-shrink-0",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            data-state={activeTab === tab ? "active" : "inactive"}
            className={cn(
              "px-6 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out border-2 ",
              activeTab === tab 
                ? "bg-primary text-primary-foreground border-primary shadow-primary" 
                : "bg-card text-card-foreground hover:bg-muted border-border"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-md m-2 sm:m-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-2 shadow-xs hover:bg-muted transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        <div className="px-4 py-2 text-sm font-medium border-2 rounded-md bg-card text-card-foreground shadow-xs">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-2 shadow-xs hover:bg-muted transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  )
}
