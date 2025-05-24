"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchAnimeInfo } from "@/hooks/useApi";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Star,
  Play,
  TrendingUp,
  BarChart3,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { SiMyanimelist, SiAnilist } from "react-icons/si";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function AnimePage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(1); // Default episode is 1
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params and extract slug
  useEffect(() => {
    async function resolveParams() {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
        
        // Get episode number from query param or default to 1
        const epParam = searchParams.get("ep");
        const ep = epParam ? parseInt(epParam, 10) : 1;
        setEpisodeNumber(isNaN(ep) ? 1 : ep); // Ensure it's a valid number
        
        // If no ep parameter exists, add ?ep=1 to the URL
        if (!epParam) {
          const currentParams = new URLSearchParams(searchParams.toString());
          currentParams.set("ep", "1");
          router.replace(`/watch/${resolvedParams.slug}?${currentParams.toString()}`, { scroll: false });
        }
        
        console.log("Anime slug:", resolvedParams.slug, "Episode:", ep);
      } catch (err) {
        console.error("Failed to resolve params:", err);
        setError("Failed to load page parameters.");
        setLoading(false);
      }
    }

    resolveParams();
  }, [params, searchParams, router]);

  // Fetch anime info when slug is available
  useEffect(() => {
    if (!slug) return;

    async function getAnimeInfo() {
      setLoading(true);
      try {
        const animeData = await fetchAnimeInfo(slug);
        setAnime(animeData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch anime info:", err);
        setError("Failed to load anime information. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    getAnimeInfo();
  }, [slug]);

  // Format anime release date to be more readable
  const formatReleaseDate = (date: string | number) => {
    if (!date) return "Unknown";
    if (typeof date === "number") return date.toString();
    return date;
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/2 bg-muted rounded-md mb-6"></div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-80 aspect-[3/4] bg-muted rounded-lg"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-muted rounded-md w-3/4"></div>
              <div className="h-4 bg-muted rounded-md w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-md"></div>
                <div className="h-4 bg-muted rounded-md"></div>
                <div className="h-4 bg-muted rounded-md"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-destructive text-xl">{error}</div>
        <Link
          href="/"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Return to home
        </Link>
      </div>
    );
  }

  if (!anime) return null;

  // Extract all needed anime properties
  const {
    title,
    description,
    image,
    cover,
    trailer,
    status,
    releaseDate,
    type,
    totalEpisodes,
    duration,
    rating,
    genres = [],
    studios = [],
    popularity,
    malId,
    color = "#3b82f6",
  } = anime;

  // Get the appropriate title
  const mainTitle =
    title?.english || title?.userPreferred || title?.romaji || "Unknown Title";

  const secondaryTitle =
    title?.romaji && title.romaji !== mainTitle
      ? title.romaji
      : title?.native || "";

  return (
    <div className="p-4 md:p-8">
      {/* Cover Image Background (blurred and darkened) */}
      {cover && (
        <div className="fixed inset-0 -z-10 opacity-10">
          <Image
            src={cover}
            alt={mainTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Anime Title Section */}
        <div className="flex items-center gap-2 mb-6">
          <StatusIndicator status={status} />
          <h1 className="text-2xl md:text-4xl font-bold">{mainTitle}</h1>
        </div>

        {/* Secondary Title */}
        {secondaryTitle && (
          <h2 className="text-lg md:text-xl text-muted-foreground mb-8">
            {secondaryTitle}
          </h2>
        )}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Image and Quick Info */}
          <div className="w-full md:w-80 flex flex-col gap-4">
            {/* Anime Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[color:var(--border)] shadow-md">
              {image && (
                <Image
                  src={image}
                  alt={mainTitle}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-[color:var(--border)] rounded-xl p-4 space-y-3 shadow-sm">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium">{status || "Unknown"}</span>
              </div>

              {/* Release Date */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Release
                </span>
                <span className="font-medium">
                  {formatReleaseDate(releaseDate)}
                </span>
              </div>

              {/* Episodes */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Play className="h-3.5 w-3.5" /> Episodes
                </span>
                <span className="font-medium">{totalEpisodes ? `${episodeNumber}/${totalEpisodes}` : "?"}</span>
              </div>

              {/* Duration */}
              {duration && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Duration
                  </span>
                  <span className="font-medium">{duration} min</span>
                </div>
              )}

              {/* Rating */}
              {rating && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500" /> Rating
                  </span>
                  <span className="font-medium">{rating}</span>
                </div>
              )}

              {/* Popularity */}
              {popularity && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Popularity
                  </span>
                  <span className="font-medium">
                    {popularity.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Type */}
              {type && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium">{type}</span>
                </div>
              )}

              {/* External Links */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {malId && (
                  <a
                    href={`https://myanimelist.net/anime/${malId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 p-2 rounded-md hover:bg-muted transition-colors"
                    title="View on MyAnimeList"
                  >
                    <SiMyanimelist className="w-6 h-6" />
                  </a>
                )}
                {anime.id && (
                  <a
                    href={`https://anilist.co/anime/${anime.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 p-2 rounded-md hover:bg-muted transition-colors"
                    title="View on AniList"
                  >
                    <SiAnilist className="w-6 h-6" />
                  </a>
                )}
                {trailer?.site === "youtube" && trailer?.id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 p-2 rounded-md hover:bg-muted transition-colors"
                    title="Watch Trailer"
                  >
                    <Youtube className="w-6 h-6 text-red-500" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-1">
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {description
                  ? description.replace(/<[^>]+>/g, "")
                  : "No description available."}
              </p>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-full bg-muted text-sm font-medium"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Studios */}
            {studios && studios.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Studios</h3>
                <div className="flex flex-wrap gap-2">
                  {studios.map((studio: any,index:any) => (
                    <span
                      key={Math
                        .random()
                        .toString(36)
                        .substring(2, 15) + index
                      }
                      className="px-3 py-1 rounded-full bg-muted text-sm font-medium"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Episode List Button */}
            <div className="mt-8">
              <Link
                href={`/watch/${slug}/episodes?ep=${episodeNumber}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Play className="h-4 w-4" />
                Watch Episodes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}