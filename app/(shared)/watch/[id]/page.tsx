"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAnimeData } from "@/hooks/useApi";
import { usePaheEpisodes } from "@/hooks/usePaheApi";
import { UnifiedPlayer } from "@/components/watch/video/UnifiedPlayer";
import { EpisodeList } from "@/components/watch/EpisodeList";
import { WatchAnimeData } from "@/components/watch/WatchAnimeData";
import { AnimeDataList } from "@/components/watch/AnimeDataList";
import { ArrowLeft } from "lucide-react";
import Loader from "@/app/loading";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Episode {
  id: string;
  episode: number;
  number: number;
  session: string;
  title?: string;
  image?: string;
  description?: string;
  createdAt?: string;
  url?: string;
}

interface AnimeInfo {
  id: string;
  title: {
    english?: string;
    romaji?: string;
    userPreferred?: string;
  };
  episodes: Episode[];
  totalEpisodes?: number;
  image?: string;
  cover?: string;
  description?: string;
  status?: string;
  malId?: string;
  [key: string]: any;
}

export default function WatchPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [animeId, setAnimeId] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [animeLoading, setAnimeLoading] = useState(true);
  const [animeError, setAnimeError] = useState<string | null>(null);
  const [episodeError, setEpisodeError] = useState<string | null>(null);

  const { data: paheEpisodesResponse, loading: episodesLoading, error: episodesError } =
    usePaheEpisodes(animeInfo?.malId);

  const episodes = useMemo<Episode[]>(() => {
    return (paheEpisodesResponse?.episodes || []).map((episode) => ({
      id: episode.session,
      episode: episode.episode,
      number: episode.episode,
      session: episode.session,
      title: episode.title,
      image: episode.snapshot,
      url: episode.link,
    }));
  }, [paheEpisodesResponse]);

  // Resolve params and query parameters
  useEffect(() => {
    async function resolveParams() {
      try {
        const resolvedParams = await params;
        setAnimeId(resolvedParams.id);

        // Get episode number from query param or default to 1
        const epParam = searchParams.get("ep");
        const ep = epParam ? parseInt(epParam, 10) : 1;
        setEpisodeNumber(isNaN(ep) ? 1 : ep);

        // If no ep parameter exists, add ?ep=1 to the URL
        if (!epParam) {
          const currentParams = new URLSearchParams(searchParams.toString());
          currentParams.set("ep", "1");
          router.replace(
            `/watch/${resolvedParams.id}?${currentParams.toString()}`,
            { scroll: false }
          );
        }
      } catch (err) {
        setAnimeError("Failed to load page parameters.");
        setAnimeLoading(false);
      }
    }

    resolveParams();
  }, [params, searchParams, router]);

  useEffect(() => {
    if (!animeId) return;

    async function fetchData() {
      setAnimeLoading(true);
      try {
        const animeData = await fetchAnimeData(animeId);
        setAnimeInfo(animeData);
        setAnimeError(null);
      } catch (err) {
        setAnimeError("Failed to load anime information. Please try again later.");
      } finally {
        setAnimeLoading(false);
      }
    }

    fetchData();
  }, [animeId]);

  useEffect(() => {
    if (!episodes.length) {
      setCurrentEpisode(null);
      if (!episodesLoading && paheEpisodesResponse) {
        setEpisodeError("No episodes were returned for this anime.");
      }
      return;
    }

    const episode = episodes.find((ep) => ep.episode === episodeNumber);
    if (episode) {
      setCurrentEpisode(episode);
      setEpisodeError(null);
      return;
    }

    const firstEpisode = episodes[0];
    setCurrentEpisode(firstEpisode);
    setEpisodeNumber(firstEpisode.episode);
  }, [episodeNumber, episodes, episodesLoading, paheEpisodesResponse]);

  useEffect(() => {
    if (!animeId || episodes.length === 0) return;

    const matchedEpisode = episodes.find((ep) => ep.episode === episodeNumber);
    if (matchedEpisode) {
      setEpisodeError(null);
      return;
    }

    const firstEpisode = episodes[0];
    setEpisodeNumber(firstEpisode.episode);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("ep", firstEpisode.episode.toString());
    router.replace(`/watch/${animeId}?${currentParams.toString()}`, {
      scroll: false,
    });
  }, [animeId, episodeNumber, episodes, router, searchParams]);

  // Save to watch history - separate function
  const saveToWatchHistory = useCallback((episode: Episode) => {
    if (!animeInfo || !episode) return;
    
    try {
      const watchHistory = JSON.parse(
        localStorage.getItem("watch-history") || "{}"
      );
      watchHistory[animeId] = {
        episodeNumber: episode.episode,
        episodeId: episode.id,
        timestamp: Date.now(),
        animeTitle: animeInfo?.title?.english || animeInfo?.title?.romaji,
        animeImage: animeInfo?.image || animeInfo?.cover,
        episodeImage: episode.image,
        cover: animeInfo?.cover,
      };
      localStorage.setItem("watch-history", JSON.stringify(watchHistory));
    } catch (error) {
      // Silent error handling
    }
  }, [animeId, animeInfo]);

  // Save to history whenever currentEpisode changes (including page load)
  useEffect(() => {
    if (currentEpisode && animeInfo) {
      saveToWatchHistory(currentEpisode);
    }
  }, [currentEpisode, animeInfo, saveToWatchHistory]);

  // Handle episode selection
  const handleEpisodeSelect = useCallback(
    (episodeId: string) => {
      const episode = episodes.find((ep) => ep.id === episodeId);
      if (episode) {
        setEpisodeNumber(episode.episode);
        setCurrentEpisode(episode);

        // Update URL with new episode number
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("ep", episode.episode.toString());
        router.replace(`/watch/${animeId}?${currentParams.toString()}`, {
          scroll: false,
        });

        // Note: saveToWatchHistory will be called automatically by useEffect when currentEpisode changes
      }
    },
    [episodes, animeId, router, searchParams]
  );

  const goToPreviousEpisode = useCallback(() => {
    if (episodeNumber > 1) {
      const prevEpisode = episodes.find(
        (ep) => ep.episode === episodeNumber - 1
      );
      if (prevEpisode) {
        handleEpisodeSelect(prevEpisode.id);
      }
    }
  }, [episodeNumber, episodes, handleEpisodeSelect]);

  const goToNextEpisode = useCallback(() => {
    const nextEpisode = episodes.find((ep) => ep.episode === episodeNumber + 1);
    if (nextEpisode) {
      handleEpisodeSelect(nextEpisode.id);
    }
  }, [episodeNumber, episodes, handleEpisodeSelect]);

  const handleEpisodeEnd = useCallback(async () => {
    goToNextEpisode();
  }, [goToNextEpisode]);

  if (animeLoading || episodesLoading) {
    return <Loader />;
  }

  if (animeError || episodesError || episodeError) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-destructive text-xl mb-4">
            {animeError || episodesError || episodeError}
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  if (!animeInfo || !currentEpisode) return null;

  const animeTitle =
    animeInfo.title?.english || animeInfo.title?.romaji || "Unknown Anime";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-9xl mx-auto mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-lg w-full">
              {currentEpisode ? (
                <UnifiedPlayer
                  episodeId={currentEpisode.id}
                  anilistId={animeId}
                  banner={animeInfo.cover}
                  malId={animeInfo.malId}
                  onEpisodeEnd={handleEpisodeEnd}
                  onPrevEpisode={goToPreviousEpisode}
                  onNextEpisode={goToNextEpisode}
                  animeTitle={animeTitle}
                  episodeNumber={episodeNumber.toString()}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading video...</p>
                  </div>
                </div>
              )}
            </div>
            <WatchAnimeData animeData={animeInfo} />
          </div>
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg">
              <div className="max-h-96 overflow-hidden">
                <EpisodeList
                  animeId={animeId}
                  episodes={episodes}
                  selectedEpisodeId={currentEpisode.id}
                  onEpisodeSelect={handleEpisodeSelect}
                  maxListHeight="24rem"
                />
              </div>
            </div>
            <AnimeDataList animeData={animeInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
