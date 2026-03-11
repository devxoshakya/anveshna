"use client"

import { Search, Command, Bell, User, Shuffle } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Image from "next/image"
import { useState, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const formattedQuery = searchQuery.trim().replace(/\s+/g, '+');
      router.push(`/search?query=${formattedQuery}&sort=POPULARITY_DESC&type=ANIME`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-background">
      <div className="flex h-15 items-center px-4 md:pr-6">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/loader.png"
              alt="Logo"
              width={4000}
              height={4000}
              className="h-full w-36 object-contain"
            />
          </Link>
        </div>
        <div className="relative flex flex-1 items-center max-w-md mx-auto">
          <div className="relative w-full flex items-center ">
            <Search className="absolute left-3 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search Anime" 
              className="w-full bg-muted border-1 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 h-8 w-8"
              onClick={handleSearch}
            >
              <Command className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute right-0 flex gap-2 translate-x-[calc(100%+0.5rem)]">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 border-1 bg-muted"
              onClick={handleSearch}
            >
              <Search className="h-8 w-8" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 border-1 bg-muted"
              // onClick={() => router.push('/search?sort=POPULARITY_DESC&random=true')}
            >
              <Shuffle className="h-8 w-8" />
            </Button>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

