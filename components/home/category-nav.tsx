"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = [
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  // Add more categories as needed
]

export default function CategoryNavigation() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Check if scrolling is needed and update arrow visibility
  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      // Initial check
      checkScroll()

      // Check on window resize
      window.addEventListener("resize", checkScroll)

      return () => {
        container.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [])

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    // Add your filtering logic here
  }

  return (
    <div className="relative w-full max-w-full flex items-center">
      {/* Left scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-0 z-10 h-full rounded-none bg-white/80 backdrop-blur-sm dark:bg-gray-950/80",
          !showLeftArrow && "hidden",
        )}
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Scrollable categories */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={cn(
              "whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === category
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-0 z-10 h-full rounded-none bg-white/80 backdrop-blur-sm dark:bg-gray-950/80",
          !showRightArrow && "hidden",
        )}
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
