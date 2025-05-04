"use client";
import Link from "next/link";
import Image from "next/image";
import { Home, TrendingUp, Calendar, History, Settings } from "lucide-react";
import { Bell, Menu, Search, User, X } from "lucide-react";
import { AnimeSearch } from "@/components/layout/anime-search";
import { useState, useEffect } from "react";
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAiringAnime,
  fetchTopAnime,
  fetchUpcomingSeasons,
} from "@/hooks/useApi";
import { HomeCarousel } from "@/components/layout/home-slide";

const HomePage = () => {
  // Set a default value that doesn't rely on window
  const [itemsCount, setItemsCount] = useState(24);

  const [watchedEpisodes, setWatchedEpisodes] = useState<any[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [popularAnime, setPopularAnime] = useState<any[]>([]);
  const [topAnime, setTopAnime] = useState<any[]>([]);
  const [topAiring, setTopAiring] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    trending: true,
    popular: true,
    topRated: true,
    topAiring: true,
    upcoming: true,
  });

  const filterAndTrimAnime = (animeList: any) =>
    animeList.results
      /*       .filter(
              (anime: Anime) =>
                anime.totalEpisodes !== null &&
                anime.duration !== null &&
                anime.releaseDate !== null,
            ) */
      .slice(0, itemsCount);

  useEffect(() => {
    // Update itemsCount based on window width after component mounts
    setItemsCount(window.innerWidth > 500 ? 24 : 15);
    
    // Optional: Add a resize listener to update itemsCount when window is resized
    const handleResize = () => {
      setItemsCount(window.innerWidth > 500 ? 24 : 15);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCount = Math.ceil(itemsCount * 1.4);

    const fetchData = async () => {
      try {
        setError(null);
        setLoading({
          trending: true,
          popular: true,
          topRated: true,
          topAiring: true,
          upcoming: true,
        });

        const [trending, popular, topRated, topAiring, upcoming] =
          await Promise.all([
            fetchTrendingAnime(1, fetchCount),
            fetchPopularAnime(1, fetchCount),
            fetchTopAnime(1, fetchCount),
            fetchTopAiringAnime(1, 6),
            fetchUpcomingSeasons(1, 6),
          ]);

        setTrendingAnime(filterAndTrimAnime(trending));
        setPopularAnime(filterAndTrimAnime(popular));
        setTopAnime(filterAndTrimAnime(topRated));
        setTopAiring(filterAndTrimAnime(topAiring));
        setUpcoming(filterAndTrimAnime(upcoming));
      } catch (fetchError) {
        setError("An unexpected error occurred");
      } finally {
        setLoading({
          trending: false,
          popular: false,
          topRated: false,
          topAiring: false,
          upcoming: false,
        });
      }
    };

    fetchData();
  }, [itemsCount]); // Only depend on itemsCount

  return (
    <div className="h-screen pt-16">
      <HomeCarousel
        data={trendingAnime}
        loading={loading.trending}
        error={error}
      />
    </div>
  );
};

export default HomePage;
