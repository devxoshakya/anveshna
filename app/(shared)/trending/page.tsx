"use client";

import React, { useEffect, useState } from "react";
import { WindBreakerAnimeCard } from "@/components/cards/TrendingAnimeCard";
import { fetchAdvancedSearch, fetchTrendingAnime } from "@/hooks/useApi";
import { year as currentYear, getCurrentSeason } from "@/hooks/useTime";
import { ArrowLeft, ArrowRight, Calendar, TrendingUp } from "lucide-react";

export default function AnimeCardExample() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState<string>(getCurrentSeason());
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [page, setPage] = useState(1);
  const perPage = 21;

  // List of seasons for the dropdown
  const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"];
  
  // List of years from 2000 to current year
  const years = Array.from(
    { length: currentYear - 1978 },
    (_, i) => (currentYear - i).toString()
  );

  // Fetch anime based on selected season and year
  const fetchSeasonalAnime = async () => {
    setLoading(true);
    try {
      const data = await fetchAdvancedSearch(
        "",
        page,
        perPage,
        {
          season,
          year: selectedYear,
          type: "ANIME",
          sort: ["TRENDING_DESC"],
        }
      );
      
      setAnimeList(data.results || []);
    } catch (error) {
      console.error("Error fetching seasonal anime:", error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch anime when component mounts or when season/year/page changes
  useEffect(() => {
    fetchSeasonalAnime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, selectedYear, page]);

  // Handle season change
  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(e.target.value);
    setPage(1); // Reset to first page when season changes
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setPage(1); // Reset to first page when year changes
  };

  return (
    <div className="p-0 mt-16 max-w-8xl mx-auto">
      {/* Unified Season and Year Selection Bar */}
      <div className="mb-8 bg-background rounded-lg border border-[color:var(--border)] p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Header with icons */}
          <div className="flex items-center gap-2 text-center md:text-left w-full md:w-auto mb-3 md:mb-0">
            <TrendingUp className="h-5 w-5 text-primary hidden md:block" />
            <h2 className="text-lg md:text-xl font-semibold">
              <span className="md:hidden">
                {season.charAt(0) + season.slice(1).toLowerCase()} {selectedYear} Anime
              </span>
              <span className="hidden md:inline">
                Trending Anime from {selectedYear} in {season.charAt(0) + season.slice(1).toLowerCase()}
              </span>
            </h2>
          </div>
          
          {/* Controls group */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end">
            {/* Season selection */}
            <div className="relative flex items-center space-x-1 bg-muted/50 rounded-md p-1 max-w-full overflow-x-auto no-scrollbar">
              {seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSeason(s);
                    setPage(1);
                  }}
                  className={`px-2 md:px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    season === s 
                      ? "bg-background text-foreground border-2" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            
            {/* Year selector with calendar icon */}
            <div className="relative flex items-center bg-muted/50 rounded-md">
              <Calendar className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="appearance-none bg-transparent pl-8 pr-6 py-1.5 rounded-md text-sm font-medium focus:outline-none"
                aria-label="Select year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ArrowLeft className="h-3 w-3 rotate-90 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display results */}
      <div>
        {/* Loading indicator */}
        {loading && (
          <div className="w-full flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span>Loading anime...</span>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-muted h-96 rounded-lg" />
            ))}
          </div>
        ) : animeList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animeList.map((anime) => (
              <WindBreakerAnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4 opacity-40" />
            <p className="text-lg font-medium">No anime found for {season.charAt(0) + season.slice(1).toLowerCase()} {selectedYear}.</p>
            <p className="text-sm mt-2">Try selecting a different season or year.</p>
          </div>
        )}
      </div>
      
      {/* Right-aligned pagination with Lucide icons */}
      {animeList.length > 0 && (
        <div className="flex justify-end items-center mt-8">
          <div className="flex items-center bg-muted/30 rounded-md overflow-hidden">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 text-sm font-medium">
              {page}
            </div>
            <button
              onClick={() => setPage(page + 1)}
              className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
