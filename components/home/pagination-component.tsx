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
    <div className="flex justify-between items-center w-full rounded-md">
      <div
        ref={tabsContainerRef}
        className={cn(
          "flex rounded-md sm:w-auto overflow-x-auto scrollbar-hide",
          isScrollable && "after:content-[''] after:w-4 after:flex-shrink-0",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            data-state={activeTab === tab ? "active" : "inactive"}
            className={cn(
              "px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab ? "bg-purple-200 text-purple-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center rounded-md m-2 sm:m-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        <div className="px-4 border-l border-r py-2 text-sm font-medium">{currentPage}</div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  )
}
