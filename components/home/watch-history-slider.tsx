"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
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

// Sample data for the watch history items
const watchHistoryData = [
  {
    id: 1,
    title: "Orb: On the Movements of the Earth",
    episode: 1,
    currentTime: "10:58",
    totalTime: "25:02",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: true,
  },
  {
    id: 2,
    title: "KOWLOON GENERIC ROMANCE",
    episode: 1,
    currentTime: "",
    totalTime: "",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: false,
  },
  {
    id: 3,
    title: "Viral Hit",
    episode: 1,
    currentTime: "",
    totalTime: "",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: true,
  },
  {
    id: 4,
    title: "Bungo Stray Dogs 5",
    episode: 1,
    currentTime: "",
    totalTime: "",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: false,
  },
  {
    id: 5,
    title: "Bungo Stray Dogs 4",
    episode: 13,
    currentTime: "22:21",
    totalTime: "23:47",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: true,
  },
  {
    id: 6,
    title: "Bungo Stray Dogs 3",
    episode: 12,
    currentTime: "03:29",
    totalTime: "23:41",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: false,
  },
  {
    id: 7,
    title: "Skip and Loafer",
    episode: 1,
    currentTime: "",
    totalTime: "",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: false,
  },
  {
    id: 8,
    title: "Kimi ni Todoke: From Me to You",
    episode: 1,
    currentTime: "",
    totalTime: "",
    thumbnail: "https://image.tmdb.org/t/p/w500/7HKKNIctUv23vK1lkWetyobRSOR.jpg",
    hasPlayButton: false,
  },
];

export default function WatchHistorySlider() {
  const [items, setItems] = useState(watchHistoryData);

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-1 text-muted-foreground text-sm font-medium">Your Watchlist</div>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Continue Watching
      </h2>

      <Swiper
        modules={[FreeMode]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode={true}
        className="w-full"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="!w-[280px] md:!w-[330px] h-auto">
            <div className="relative rounded-md overflow-hidden group border-2 border-border shadow-sm hover:shadow-primary transition-shadow duration-300"
              style={{borderRadius: 'var(--radius-lg)'}}>
              <div className="relative aspect-video bg-muted">
                {/* Image with zoom effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
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
                  onClick={() => handleRemoveItem(item.id)}
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
                  <div className="bg-background/80 border-2 border-primary rounded-full p-3 transform scale-90 
                    group-hover:scale-100 transition-all duration-300 shadow-primary hover:bg-background">
                    <Play className="w-8 h-8 fill-primary text-primary" />
                  </div>
                </div>

                {/* Episode indicator */}
                <div className="absolute bottom-2 left-2 bg-background/80 border border-border px-1.5 py-0.5 text-foreground text-xs rounded-md">
                  EP {item.episode}
                </div>

                {/* Progress indicator */}
                {item.currentTime && item.totalTime && (
                  <div className="absolute bottom-2 right-2 bg-background/80 border border-border px-1.5 py-0.5 text-foreground text-xs rounded-md">
                    <span className="font-bold">{item.currentTime}</span>
                    <span className="font-medium"> /{item.totalTime}</span>
                  </div>
                )}

                {/* Progress bar */}
                {item.currentTime && item.totalTime && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/30">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${calculateProgress(item.currentTime, item.totalTime)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="p-2 bg-accent border-2 border-t-0 rounded-b-md">
                <h3 className="text-sm font-medium text-accent-foreground truncate">
                  {item.title}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
