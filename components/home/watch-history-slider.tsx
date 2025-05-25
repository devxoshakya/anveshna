"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Play } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { cn } from "@/lib/utils";

// Helper function to calculate progress percentage
const calculateProgress = (current: string, total: string): number => {
  const currentSeconds = convertTimeToSeconds(current);
  const totalSeconds = convertTimeToSeconds(total);

  return totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;
};

// Helper function to convert time format (MM:SS) to seconds
const convertTimeToSeconds = (time: string): number => {
  if (!time) return 0;

  const parts = time.split(":");
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  }
  return 0;
};

// Helper function to calculate slides per view based on window width
const calculateSlidesPerView = (windowWidth: number): number => {
  if (windowWidth >= 1200) return 5;
  if (windowWidth >= 1000) return 4;
  if (windowWidth >= 700) return 3;
  if (windowWidth >= 500) return 2;
  return 2;
};

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  WATCH_HISTORY: 'watch-history',
  ALL_EPISODE_TIMES: 'all_episode_times'
};

interface WatchHistoryItem {
  episodeNumber: number;
  episodeId: string;
  timestamp: number;
  animeTitle?: string;
  animeImage?: string;
  episodeImage?: string;
  cover?: string;
}

interface EpisodePlaybackInfo {
  currentTime: number;
  playbackPercentage: number;
}

export default function WatchHistorySlider() {
  const [watchHistoryData, setWatchHistoryData] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Initialize window width on client side
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWatchHistoryData(localStorage.getItem(LOCAL_STORAGE_KEYS.WATCH_HISTORY));
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    const debouncedResize = setTimeout(handleResize, 200);
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(debouncedResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Process watch history data
  const watchHistoryItems = useMemo(() => {
    if (!watchHistoryData) return [];
    
    try {
      const historyData: Record<string, WatchHistoryItem> = JSON.parse(watchHistoryData);
      const episodePlaybackData: Record<string, EpisodePlaybackInfo> = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.ALL_EPISODE_TIMES) || '{}'
      );

      // Convert to array and sort by timestamp (most recent first)
      const sortedHistory = Object.entries(historyData)
        .map(([animeId, item]) => ({
          animeId,
          ...item,
          playbackInfo: episodePlaybackData[item.episodeId] || { currentTime: 0, playbackPercentage: 0 }
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      return sortedHistory;
    } catch (error) {
      console.error('Failed to parse watch history data:', error);
      return [];
    }
  }, [watchHistoryData]);

  // Handle removing item from watch history
  const handleRemoveItem = (animeId: string) => {
    try {
      const currentHistory = JSON.parse(watchHistoryData || '{}');
      delete currentHistory[animeId];
      
      const newHistoryData = JSON.stringify(currentHistory);
      localStorage.setItem(LOCAL_STORAGE_KEYS.WATCH_HISTORY, newHistoryData);
      setWatchHistoryData(newHistoryData);
    } catch (error) {
      console.error('Failed to remove item from watch history:', error);
    }
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Swiper settings
  const swiperSettings = useMemo(
    () => ({
      modules: [FreeMode, Autoplay, Keyboard],
      spaceBetween: 16,
      slidesPerView: calculateSlidesPerView(windowWidth),
      freeMode: true,
      grabCursor: true,
      keyboard: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
    }),
    [windowWidth]
  );

  // Don't render component if no watch history
  if (!watchHistoryData || watchHistoryItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4">
      <div className="mb-1 text-muted-foreground text-sm font-medium">Your Watchlist</div>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Continue Watching
      </h2>

      <Swiper
        {...swiperSettings}
        className="w-full"
      >
        {watchHistoryItems.map((item) => {
          const currentTimeFormatted = formatTime(item.playbackInfo.currentTime);
          const hasProgress = item.playbackInfo.currentTime > 0;
          
          return (
            <SwiperSlide key={item.animeId} className="!w-[280px] md:!w-[330px] h-auto">
              <div className="relative rounded-md overflow-hidden group border-2 border-border shadow-sm hover:shadow-primary transition-shadow duration-300"
                style={{borderRadius: 'var(--radius-lg)'}}>
                <div className="relative aspect-video bg-muted">
                  {/* Image with zoom effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={item.episodeImage || item.animeImage || item.cover || "/placeholder-anime.jpg"}
                      alt={item.animeTitle || "Anime"}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-300 ease-in-out",
                        "group-hover:scale-110"
                      )}
                    />
                  </div>

                  {/* Close button - visible only on hover */}
                  <button
                    className="absolute top-2 right-2 bg-background/80 border border-border rounded-md p-1 text-foreground 
                      hover:bg-primary hover:text-primary-foreground transition-all duration-200 
                      opacity-0 group-hover:opacity-100 z-10"
                    onClick={() => handleRemoveItem(item.animeId)}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Play button - visible on hover for all cards */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    )}
                  >
                    <a href={`/watch/${item.animeId}?ep=${item.episodeNumber}`} className="block">
                      <div className="bg-background/80 border-2 border-primary rounded-full p-3 transform scale-90 
                        group-hover:scale-100 transition-all duration-300 shadow-primary hover:bg-background">
                        <Play className="w-8 h-8 fill-primary text-primary" />
                      </div>
                    </a>
                  </div>

                  {/* Episode indicator */}
                  <div className="absolute bottom-2 left-2 bg-background/80 border border-border px-1.5 py-0.5 text-foreground text-xs rounded-md">
                    EP {item.episodeNumber}
                  </div>

                  {/* Progress indicator */}
                  {hasProgress && (
                    <div className="absolute bottom-2 right-2 bg-background/80 border border-border px-1.5 py-0.5 text-foreground text-xs rounded-md">
                      <span className="font-bold">{currentTimeFormatted}</span>
                    </div>
                  )}

                  {/* Progress bar */}
                  {hasProgress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/30">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.max(item.playbackInfo.playbackPercentage, 5)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-2 bg-accent border-2 border-t-0 rounded-b-md">
                  <h3 className="text-sm font-medium text-accent-foreground truncate">
                    {item.animeTitle || "Unknown Anime"}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
