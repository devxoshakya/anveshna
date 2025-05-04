"use client"

import { Search, Command, Bell, User,Shuffle} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-background md:pr-36">
      <div className="flex h-15 items-center px-4">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/landing.png"
              alt="Logo"
              width={4000}
              height={4000}
              className="h-full w-36 object-contain pt-4"
            />
          </Link>
        </div>
        <div className="relative flex flex-1 items-center max-w-md mx-auto">
          <div className="relative w-full flex items-center ">
            <Search className="absolute left-3 h-4 w-4" />
            <Input type="search" placeholder="Search Anime" className="w-full bg-muted border-1 pl-10" />
            <Button variant="ghost" size="icon" className="absolute right-1 h-8 w-8">
              <Command className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute right-0 flex gap-2 translate-x-[calc(100%+0.5rem)]">
            <Button variant="secondary" size="icon" className="h-10 w-10 border-1 bg-muted">
              <Search className="h-8 w-8" />
            </Button>
            <Button variant="secondary" size="icon" className="h-10 w-10 border-1 bg-muted">
              <Shuffle className="h-8 w-8" />
            </Button>
          </div>
        </div>
        {/* <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
              <path d="m8 12 2 2 6-6" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <User className="h-5 w-5" />
          </Button>
        </div> */}
      </div>
    </header>
  )
}

