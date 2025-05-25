"use client";

import { SearchFilters } from "@/components/layout/SearchFilter";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CardGrid, StyledCardGrid } from "@/components/cards/CardGrid";
import { SkeletonCard } from "@/components/skeletons/skeletons";
import { fetchAdvancedSearch } from "@/hooks/useApi";

export interface Paging {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
  results: any[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 4rem;
  
  /* Hide scrollbars */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }

  @media (min-width: 1500px) {
    margin-left: 8rem;
    margin-right: 8rem;
    margin-top: 2rem;
  }
`;

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort");

  // Adjusting initialization to ensure non-null values
  let initialSortDirection: "DESC" | "ASC" = "DESC"; // Default to 'DESC'
  if (sortParam) {
    initialSortDirection = sortParam.endsWith("_DESC") ? "DESC" : "ASC";
  }
  const initialSortValue = sortParam
    ? sortParam.replace(/(_DESC|_ASC)$/, "")
    : "POPULARITY_DESC";

  const initialSort = {
    value: initialSortValue,
    label:
      initialSortValue.replace("_DESC", "").charAt(0) +
      initialSortValue.replace("_DESC", "").slice(1).toLowerCase(),
  };
  const genresParam = searchParams.get("genres");
  const initialGenres = genresParam
    ? genresParam.split(",").map((value) => ({ value, label: value }))
    : [];

  const initialYear = {
    value: searchParams.get("year") || "",
    label: searchParams.get("year") || "Any",
  };

  const initialSeason = {
    value: searchParams.get("season") || "",
    label: searchParams.get("season") || "Any",
  };

  const initialFormat = {
    value: searchParams.get("format") || "",
    label: searchParams.get("format") || "Any",
  };

  const initialStatus = {
    value: searchParams.get("status") || "",
    label: searchParams.get("status") || "Any",
  };

  // State hooks
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedFormat, setSelectedFormat] = useState(initialFormat);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [sortDirection, setSortDirection] = useState<"DESC" | "ASC">(
    initialSortDirection
  );

  //Other logic
  const [animeData, setAnimeData] = useState<Paging[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const delayTimeout = useRef<NodeJS.Timeout | null>(null);

  // ...existing code...

  const updateSearchParams = useCallback(() => {
    const params = new URLSearchParams();

    // Preserve query parameter if it exists
    const queryParam = searchParams.get("query");
    if (queryParam) {
      params.set("query", queryParam);
    }

    if (selectedGenres.length > 0) {
      params.set("genres", selectedGenres.map((g) => g.value).join(","));
    }
    if (selectedYear.value) params.set("year", selectedYear.value);
    if (selectedSeason.value) params.set("season", selectedSeason.value);
    if (selectedFormat.value) params.set("format", selectedFormat.value);
    if (selectedStatus.value) params.set("status", selectedStatus.value);

    const sortBase = selectedSort.value.replace(/(_DESC|_ASC)$/, "");
    const sortParam =
      sortDirection === "DESC" ? `${sortBase}_DESC` : `${sortBase}_ASC`;
    params.set("sort", sortParam);

    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    selectedSort,
    sortDirection,
    router,
    searchParams
  ]);

  useEffect(() => {
    setPage(1);

    const scrollToTopWithDelay = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 350);
    };

    scrollToTopWithDelay();
  }, [
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    selectedSort,
    sortDirection,
    searchParams.get("query") // Add query parameter to the dependency array
  ]);

  const initiateFetchAdvancedSearch = useCallback(async () => {
    // Don't fetch if we're already fetching more data
    if (isFetchingMore && page > 1) return;
    
    // Set the appropriate loading state
    if (page === 1) {
      setIsLoading(true);
      setAnimeData([]); // Clear data on new search
    } else {
      setIsFetchingMore(true);
    }
    
    const sortBase = selectedSort.value.replace(/(_DESC|_ASC)$/, "");
    const sortParam = sortDirection === "DESC" ? `${sortBase}_DESC` : sortBase;
    
    // Get query from URL if it exists
    const queryParam = searchParams.get("query") || "";
    
    try {
      const fetchedData = await fetchAdvancedSearch(queryParam.replace(/\+/g, ' '), page, 17, {
        genres: selectedGenres.map((g) => g.value),
        year: selectedYear.value,
        season: selectedSeason.value,
        format: selectedFormat.value,
        status: selectedStatus.value,
        sort: [sortParam], // Ensure this is correctly formatted
      });
      
      // Only append new data if this is a subsequent page load
      if (page === 1) {
        setAnimeData(fetchedData.results);
      } else {
        // Use function form of setState to avoid race conditions
        setAnimeData(prevData => [...prevData, ...fetchedData.results]);
      }
      
      setHasNextPage(fetchedData.hasNextPage);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [
    page,
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    selectedSort,
    sortDirection,
    isFetchingMore,
    searchParams
  ]);

  const handleLoadMore = useCallback(() => {
    // Only increment page if we're not already loading and there is a next page
    if (!isFetchingMore && hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetchingMore, hasNextPage]);

  useEffect(() => {
    // Clear existing timeout to ensure no double fetches
    if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);

    // Debounce to minimize fetches during rapid state changes
    delayTimeout.current = setTimeout(() => {
      initiateFetchAdvancedSearch();
    }, page > 1 ? 300 : 0); // No delay for initial load, 300ms for pagination

    // Cleanup timeout on unmount or before executing a new fetch
    return () => {
      if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);
    };
  }, [initiateFetchAdvancedSearch, page]);

  return (
    <Container>
      <SearchFilters
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        updateSearchParams={updateSearchParams}
      />

      <div>
        {(isLoading && page === 1) ? (
          <StyledCardGrid>
            {Array.from({ length: 17 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </StyledCardGrid>
        ) : (
          <>
            <CardGrid
              animeData={animeData}
              hasNextPage={hasNextPage}
              onLoadMore={handleLoadMore}
            />
          </>
        )}
        {!isLoading && !isFetchingMore && animeData.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "10vh",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            No Results
          </div>
        )}
      </div>
    </Container>
  );
};

// Loading component for Suspense fallback
const SearchPageLoading = () => (
  <Container>
    <StyledCardGrid>
      {Array.from({ length: 17 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </StyledCardGrid>
  </Container>
);

// Main export with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <Search />
    </Suspense>
  );
}
