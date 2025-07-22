"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const categories = [
  "Action",
  "Adventure",
  "Cars",
  "Comedy",
  "Drama",
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
  "Supernatural",
  "Thriller",
  // Repeat removed to avoid redundancy
];

export default function CategoryNavigation() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const Router = useRouter();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // You can insert your filtering logic here
    console.log(`Category clicked: ${category}`);
    Router.push(`/search?&genres=${category}&sort=POPULARITY_DESC&type=ANIME`);
  };

  return (
    <div className="relative w-full max-w-full mt-2">
      <Swiper
        modules={[FreeMode]}
        slidesPerView="auto"
        spaceBetween={8}
        freeMode={true}
        className="py-2 w-full mx-auto px-1"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <button
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "whitespace-nowrap rounded-md px-6 py-1.5 text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted-foreground/20 bg-muted dark:bg-gray-800"
              )}
            >
              {category}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
