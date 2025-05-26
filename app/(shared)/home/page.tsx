"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
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
import { CardGrid, StyledCardGrid } from "@/components/cards/CardGrid";
import { SkeletonCard, SkeletonSlide } from "@/components/skeletons/skeletons";
import { HomeSideBar } from "@/components/home/HomeCardList";
import { getNextSeason } from "@/hooks/useTime";
import PaginationComponent from "@/components/home/pagination-component";

// Define the interface for an episode and anime for better type safety
interface Episode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  image: string;
  timestamp: number;
  [key: string]: any;
}

interface Anime {
  id: string;
  title: {
    english?: string;
    romaji?: string;
    userPreferred?: string;
  };
  image?: string;
  coverImage?: string;
  type?: string;
  status?: string;
  releaseDate?: string;
  currentEpisode?: number;
  totalEpisodes?: number;
  rating?: number;
  color?: string;
  [key: string]: any;
}

interface Paging {
  results: Anime[];
  [key: string]: any;
}

// Styled components for layout
const Section = styled.section`
  padding: 0rem;
  border-radius: var(--radius);
`;

const SimpleLayout = styled.div`
  margin: 0 auto;
  margin-top: 4rem;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContentSidebarLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$isActive ? 'var(--primary)' : 'var(--muted-foreground)'};
  font-size: 1rem;
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--primary);
    transform: scaleX(${props => props.$isActive ? 1 : 0});
    transition: transform 0.2s ease-in-out;
  }

  &:hover:after {
    transform: scaleX(1);
  }
`;

const ErrorMessage = styled.div<{ title?: string }>`
  background-color: var(--destructive);
  color: var(--destructive-foreground);
  padding: 1rem;
  border-radius: var(--radius);
  margin-top: 1rem;
  
  &:before {
    content: "${props => props.title || 'Error'}";
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const HomePage = () => {
  const [itemsCount, setItemsCount] = useState(
    typeof window !== 'undefined' ? (window.innerWidth > 500 ? 24 : 15) : 24
  );

  // Reduced active time to 5mins
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'TRENDING';
    
    const time = Date.now();
    const savedData = localStorage.getItem('home tab');
    if (savedData) {
      try {
        const { tab, timestamp } = JSON.parse(savedData);
        if (time - timestamp < 300000) {
          return tab;
        } else {
          localStorage.removeItem('home tab');
        }
      } catch (e) {
        localStorage.removeItem('home tab');
      }
    }
    return 'TRENDING';
  });

  // Unified state management
  const [state, setState] = useState({
    watchedEpisodes: [] as Episode[],
    trendingAnime: [] as Anime[],
    popularAnime: [] as Anime[],
    topAnime: [] as Anime[],
    topAiring: [] as Anime[],
    upcoming: [] as Anime[],
    error: null as string | null,
    loading: {
      trending: true,
      popular: true,
      topRated: true,
      topAiring: true,
      upcoming: true,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);



  // Effect for window resizing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setItemsCount(window.innerWidth > 500 ? 24 : 15);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Effect to fetch watched episodes from local storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const fetchWatchedEpisodes = () => {
      const watchedEpisodesData = localStorage.getItem('watched-episodes');
      if (watchedEpisodesData) {
        try {
          const allEpisodes = JSON.parse(watchedEpisodesData);
          const latestEpisodes: Episode[] = [];
          Object.keys(allEpisodes).forEach((animeId) => {
            const episodes = allEpisodes[animeId];
            const latestEpisode = episodes[episodes.length - 1];
            latestEpisodes.push(latestEpisode);
          });
          setState((prevState) => ({
            ...prevState,
            watchedEpisodes: latestEpisodes,
          }));
        } catch (e) {
          console.error("Error parsing watched episodes:", e);
        }
      }
    };

    fetchWatchedEpisodes();
  }, []);

  // Effect to fetch anime data
  useEffect(() => {
    const fetchCount = Math.ceil(itemsCount * 1.4);
    const fetchData = async () => {
      try {
        setState((prevState) => ({ 
          ...prevState, 
          error: null,
          loading: {
            ...prevState.loading,
            trending: true,
            popular: true,
            topRated: true,
            topAiring: true,
            upcoming: true,
          }
        }));

        const [trending, popular, topRated, topAiring, upcoming] =
          await Promise.all([
            fetchTrendingAnime(currentPage, fetchCount),
            fetchPopularAnime(currentPage, fetchCount),
            fetchTopAnime(currentPage, fetchCount),
            fetchTopAiringAnime(1, 6),
            fetchUpcomingSeasons(1, 6),
          ]);

         

        setState((prevState) => ({
          ...prevState,
          trendingAnime: filterAndTrimAnime(trending),
          popularAnime: filterAndTrimAnime(popular),
          topAnime: filterAndTrimAnime(topRated),
          topAiring: filterAndTrimAnime(topAiring),
          upcoming: filterAndTrimAnime(upcoming),
          loading: {
            trending: false,
            popular: false,
            topRated: false,
            topAiring: false,
            upcoming: false,
          },
        }));
      } catch (fetchError) {
        setState((prevState) => ({
          ...prevState,
          error: 'An unexpected error occurred',
          loading: {
            trending: false,
            popular: false,
            topRated: false,
            topAiring: false,
            upcoming: false,
          },
        }));
      }
    };

    fetchData();
  }, [itemsCount,currentPage]);
  
  // Effect for page title
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = `Watari | Watch Anime Online, Free Anime Streaming`;
    }
  }, [activeTab]);

  // Effect to save active tab to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const time = Date.now();
    const tabData = JSON.stringify({ tab: activeTab, timestamp: time });
    localStorage.setItem('home tab', tabData);
  }, [activeTab]);

  const filterAndTrimAnime = (animeList: Paging): Anime[] =>
    animeList.results
      /*       .filter(
              (anime: Anime) =>
                anime.totalEpisodes !== null &&
                anime.duration !== null &&
                anime.releaseDate !== null,
            ) */
      .slice(0, itemsCount);

const renderCardGrid = (
    animeData: Anime[],
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

  

  const SEASON = getNextSeason();

  return (
    <SimpleLayout>
      {state.error && (
        <ErrorMessage title='Error Message'>
          <p>ERROR: {state.error}</p>
        </ErrorMessage>
      )}
      
        <HomeCarousel
          data={state.trendingAnime}
          loading={state.loading.trending}
          error={state.error}
        />
      <CategoryNavigation />
      
      <WatchHistorySlider />
      <ContentSidebarLayout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: '1rem',
          }}
        >
         <PaginationComponent totalPages={10} initialPage={1} initialTab="TRENDING" setPage={setCurrentPage}  setCategory={setActiveTab}/>
          <div>
            {activeTab === 'TRENDING' &&
              renderCardGrid(
                state.trendingAnime,
                state.loading.trending,
                !!state.error,
              )}
            {activeTab === 'POPULAR' &&
              renderCardGrid(
                state.popularAnime,
                state.loading.popular,
                !!state.error,
              )}
            {activeTab === 'TOP RATED' &&
              renderCardGrid(
                state.topAnime,
                state.loading.topRated,
                !!state.error,
              )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
            
            }}
          >
          
          </div>
          <HomeSideBar title="TOP AIRING" animeData={state.topAiring} />
          <div
           className="w-full h-8 md:h-10 border-1 rounded-md bg-list-background"
          >
          
          </div>
          <HomeSideBar title={`UPCOMING ${SEASON}`} animeData={state.upcoming} />
        </div>
      </ContentSidebarLayout>
    </SimpleLayout>
  );
};

export default HomePage;
