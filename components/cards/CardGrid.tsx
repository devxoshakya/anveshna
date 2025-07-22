import React, { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { CardItem } from './CardItem';

interface CardGridProps {
  animeData: any[];
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  animeData,
  hasNextPage,
  onLoadMore,
}) => {
  // Use a ref to track if we're currently in the process of loading more
  const isLoadingMoreRef = useRef(false);
  // Use a ref to store the latest hasNextPage value to avoid closure issues in event handlers
  const hasNextPageRef = useRef(hasNextPage);
  
  // Update ref when prop changes
  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
  }, [hasNextPage]);
  
  const handleLoadMore = useCallback(() => {
    if (hasNextPageRef.current && !isLoadingMoreRef.current) {
      isLoadingMoreRef.current = true;
      onLoadMore();
      
      // Reset the loading flag after a delay to prevent multiple triggers
      setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 1000);
    }
  }, [onLoadMore]);

  useEffect(() => {
    // Scroll handler with throttling
    let scrollThrottleTimeout: number | undefined;
    
    const handleScroll = () => {
      // Bail early if we're already loading or there's no next page
      if (isLoadingMoreRef.current || !hasNextPageRef.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;
      const scrollTop = 
        document.documentElement.scrollTop || document.body.scrollTop;
      
      // Larger threshold (500px) to trigger load before reaching bottom
      const threshold = 500;
      
      if (windowHeight + scrollTop >= documentHeight - threshold) {
        handleLoadMore();
      }
    };
    
    // Throttled scroll handler to improve performance
    const throttledScroll = () => {
      if (!scrollThrottleTimeout) {
        scrollThrottleTimeout = window.setTimeout(() => {
          handleScroll();
          scrollThrottleTimeout = undefined;
        }, 200);
      }
    };
    
    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollThrottleTimeout) clearTimeout(scrollThrottleTimeout);
    };
  }, [handleLoadMore]);

  return (
    <StyledCardGrid>
      {animeData.map((anime, index) => (
        <CardItem key={`${anime.id}-${index}`} anime={anime} />
      ))}
    </StyledCardGrid>
  );
};

export const StyledCardGrid = styled.div`
  margin: 0 auto;
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  grid-template-rows: auto;
  gap: 2rem;
  transition: 0s;

  @media (max-width: 1000px) {
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: 1rem;
  }

  @media (max-width: 450px) {
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
    gap: 0.8rem;
  }
`;