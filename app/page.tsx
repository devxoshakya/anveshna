"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
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
    <main className="flex min-h-screen flex-col items-center max-w-7xl mx-auto justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Image Section - Now first in mobile view */}
          <div className="lg:order-last lg:flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-36 md:pt-10 sm:h-80 md:h-[400px]">
              <Image
                src="/landing.png"
                alt="Anime showcase"
                height={400}
                width={400}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Hero Section */}
          <section className="text-center lg:text-left space-y-6 lg:max-w-xl lg:order-first">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Discover Your Next Favorite Anime
            </h1>
            <p className="text-xl md:text-2xl text-foreground">
              Search, stream, and enjoy thousands of anime titles in one place
            </p>

            {/* Search and Watch Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <div className="relative flex-grow items-center flex-row flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for anime..."
                  className=" h-12 pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  size="icon" 
                  className=" h-12 w-12" 
                  aria-label="Search"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 h-12"
                asChild
              >
                <Link href="/home">Watch Now</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
