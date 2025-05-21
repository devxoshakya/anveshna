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
import CategoryNavigation from "@/components/home/category-nav";
import WatchHistorySlider from "@/components/home/watch-history-slider";
import PaginationComponent from "@/components/home/pagination-component";
import styled from "styled-components";
import { CardGrid, StyledCardGrid } from "@/components/cards/CardGrid";
import { SkeletonCard } from "@/components/skeletons/skeletons";
import { HomeSideBar } from "@/components/home/HomeCardList";

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


  const Section = styled.section`
  padding: 0rem;
  border-radius: var(--global-border-radius);
`;



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

   const renderCardGrid = (
    animeData: any[],
    isLoading: boolean,
    hasError: boolean,
  ) => (
    <Section>
      {isLoading || hasError ? (
        <StyledCardGrid>
          {Array.from({ length: itemsCount }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </StyledCardGrid>
      ) : (
        <CardGrid
          animeData={animeData}
          hasNextPage={false}
          onLoadMore={() => {}}
        />
      )}
    </Section>
  );

  return (
    <div className="pt-16">
      <HomeCarousel
        data={trendingAnime}
        loading={loading.trending}
        error={error}
      />
      <CategoryNavigation/>
      <WatchHistorySlider/>
      <PaginationComponent
          totalPages={10}
          initialPage={1}
          tabs={["NEWEST", "POPULAR", "TOP RATED"]}
          initialTab="TOP RATED"
        />
        {renderCardGrid(
                trendingAnime,
                loading.trending,
                false,
              )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              padding: '0.75rem 0',
            }}
          >
            TOP AIRING
          </div>
          <HomeSideBar animeData={topAiring} />
          </div>
    </div>
  );
};

export default HomePage;
