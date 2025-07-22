"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchAnimeInfo,
  fetchAnimeEpisodes,
  fetchAnimeStreamingLinks,
} from "@/hooks/useApi";
import { Player } from "@/components/watch/video/IFramePLayer";
import { EpisodeList } from "@/components/watch/EpisodeList";
import { MediaSource } from "@/components/watch/video/MediaSource";
import { WatchAnimeData } from "@/components/watch/WatchAnimeData";
import { AnimeDataList } from "@/components/watch/AnimeDataList";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Episode {
  id: string;
  title: string;
  number: number;
  image: string;
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
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Player settings
  const [serverName, setServerName] = useState<string>("vidcloud");
  const [language, setLanguage] = useState<string>("sub");
  const [downloadLink, setDownloadLink] = useState<string>("");
  const nextEpisodeAiringTime =
    animeInfo && animeInfo.nextAiringEpisode
      ? animeInfo.nextAiringEpisode.airingTime * 1000
      : null;
  const nextEpisodenumber = animeInfo?.nextAiringEpisode?.episode;
  const countdown = useCountdown(nextEpisodeAiringTime);

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

        console.log("Anime ID:", resolvedParams.id, "Episode:", ep);
      } catch (err) {
        console.error("Failed to resolve params:", err);
        setError("Failed to load page parameters.");
        setLoading(false);
      }
    }

    resolveParams();
  }, [params, searchParams, router]);

  // Fetch anime info and episodes
  useEffect(() => {
    if (!animeId) return;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch anime info
        const animeData = await fetchAnimeInfo(animeId);
        console.log("Fetched anime data:", animeData);
        setAnimeInfo(animeData);

        // Fetch episodes based on language preference
        const isDub = language === "dub";
        const episodesData = animeData.episodes;

        if (episodesData && Array.isArray(episodesData)) {
          const transformedEpisodes = episodesData.map((ep: any) => ({
            id: ep.id,
            title: ep.title || `Episode ${ep.number}`,
            number: ep.number,
            image: ep.image,
            createdAt: ep.createdAt,
            url: ep.url,
          }));
          setEpisodes(transformedEpisodes);
          console.log("Transformed episodes:", transformedEpisodes);

          // Find and set current episode
          const currentEp = transformedEpisodes.find(
            (ep: Episode) => ep.number === episodeNumber
          );
          if (currentEp) {
            setCurrentEpisode(currentEp);
          } else if (transformedEpisodes.length > 0) {
            // Fallback to first episode if specified episode not found
            setCurrentEpisode(transformedEpisodes[0]);
            setEpisodeNumber(transformedEpisodes[0].number);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch anime data:", err);
        setError("Failed to load anime information. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [animeId, language]);

  // Update current episode when episode number changes
  useEffect(() => {
    if (episodes.length > 0) {
      const episode = episodes.find((ep) => ep.number === episodeNumber);
      if (episode) {
        setCurrentEpisode(episode);
      }
    }
  }, [episodeNumber, episodes]);

  // Handle episode selection
  const handleEpisodeSelect = useCallback(
    (episodeId: string) => {
      const episode = episodes.find((ep) => ep.id === episodeId);
      if (episode) {
        setEpisodeNumber(episode.number);
        setCurrentEpisode(episode);

        // Update URL with new episode number
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("ep", episode.number.toString());
        router.replace(`/watch/${animeId}?${currentParams.toString()}`, {
          scroll: false,
        });

        // Save to localStorage for watch history
        const watchHistory = JSON.parse(
          localStorage.getItem("watch-history") || "{}"
        );
        watchHistory[animeId] = {
          episodeNumber: episode.number,
          episodeId: episode.id,
          timestamp: Date.now(),
          animeTitle: animeInfo?.title?.english || animeInfo?.title?.romaji,
          animeImage: animeInfo?.image || animeInfo?.cover,
          episodeImage: episode.image,
          cover: animeInfo?.cover,
        };
        localStorage.setItem("watch-history", JSON.stringify(watchHistory));
      }
    },
    [episodes, animeId, animeInfo, router, searchParams]
  );

  // Navigation functions
  const goToPreviousEpisode = useCallback(() => {
    if (episodeNumber > 1) {
      const prevEpisode = episodes.find(
        (ep) => ep.number === episodeNumber - 1
      );
      if (prevEpisode) {
        handleEpisodeSelect(prevEpisode.id);
      }
    }
  }, [episodeNumber, episodes, handleEpisodeSelect]);

  const goToNextEpisode = useCallback(() => {
    const nextEpisode = episodes.find((ep) => ep.number === episodeNumber + 1);
    if (nextEpisode) {
      handleEpisodeSelect(nextEpisode.id);
    }
  }, [episodeNumber, episodes, handleEpisodeSelect]);

  // Handle episode end (for auto-next feature)
  const handleEpisodeEnd = useCallback(async () => {
    goToNextEpisode();
  }, [goToNextEpisode]);

  // Update download link callback
  const updateDownloadLink = useCallback((link: string) => {
    setDownloadLink(link);
  }, []);

  // Handle server name change
  const handleServerChange = useCallback((newServerName: string) => {
    setServerName(newServerName);
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background ">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded-md mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-destructive text-xl mb-4">{error}</div>
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
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-9xl mx-auto mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player and Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* Video Player */}
            <div className="relative rounded-lg w-full">
              {currentEpisode ? (
                <Player
                  episodeId={currentEpisode.id}
                  // banner={animeInfo.cover}
                  // malId={animeInfo.malId}
                  // updateDownloadLink={updateDownloadLink}
                  onEpisodeEnd={handleEpisodeEnd}
                  onPrevEpisode={goToPreviousEpisode}
                  onNextEpisode={goToNextEpisode}
                  animeTitle={animeTitle}
                  // episodeNumber={episodeNumber.toString()}
                  serverName={serverName}
                  category={language}
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

            {/* Media Source Controls */}
            <div className="">
              <MediaSource
                serverName={serverName}
                setServerName={handleServerChange}
                language={language}
                setLanguage={handleLanguageChange}
                downloadLink={downloadLink}
                episodeId={episodeNumber.toString()}
                airingTime={
                animeInfo && animeInfo.status === 'Ongoing'
                  ? countdown
                  : undefined
              }
              nextEpisodenumber={nextEpisodenumber}
              />
            </div>

            {/* Anime Details */}
            <WatchAnimeData animeData={animeInfo} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Episode List */}
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

            {/* Related Anime */}
            <AnimeDataList animeData={animeInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
