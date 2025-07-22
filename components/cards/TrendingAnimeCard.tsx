import React, { useMemo, useState } from "react";
import Image from "next/image";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { FaStar, FaCalendarAlt, FaFire, FaTv } from "react-icons/fa";
import { SiMyanimelist, SiAnilist } from "react-icons/si";
import { cn } from "@/lib/utils";

interface WindBreakerAnimeCardProps {
  anime: any;
}

export const WindBreakerAnimeCard: React.FC<WindBreakerAnimeCardProps> = ({
  anime,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const truncateTitle = useMemo(
    () => (title: string, maxLength: number) =>
      title.length > maxLength ? `${title.slice(0, maxLength)}...` : title,
    [],
  );

  // Extract properties
  const id = anime.id;
  const title =
    anime.title?.english ||
    anime.title?.userPreferred ||
    anime.title?.romaji ||
    anime.title;
  const romajiTitle = anime.title?.romaji || "";
  const description = anime.description || "";
  const image = anime.image || anime.coverImage;
  const cover = anime.cover;
  const trailer = anime.trailer;
  const type = anime.type;
  const releaseDate = anime.releaseDate || anime.year;
  const popularity = anime.popularity;
  const episodes = anime.episodes || anime.totalEpisodes;
  const rating = anime.rating || anime.score;
  const genres = Array.isArray(anime.genres) ? anime.genres : [];
  const status = anime.status || "Ongoing";
  const malId = anime.malId;
  const alId = anime.alId || anime.id;
  const duration = anime.duration;
  const nativeTitle = anime.title?.native || "";
  const color = anime.color || "var(--primary)";

  // CSS color variables from globals.css
  const cardBg = "bg-card";
  const cardBorder = "border border-[color:var(--border)]";
  const cardShadow = "shadow-md";
  const cardRadius = "rounded-xl";
  const pillBg = "bg-muted";
  const pillText = "text-muted-foreground";
  const genrePillBg = `bg-[${color}]`;
  const genrePillText = "text-secondary-foreground";
  const titleText = "text-foreground";
  const subtitleText = "text-amber-600";
  const descText = "text-muted-foreground";

  // Height transition
  const cardHover = isHovered ? "max-h-[600px]" : "max-h-[420px]";

  return (
    <div
      className={cn(
        cardBg,
        cardBorder,
        cardShadow,
        cardRadius,
        cardHover,
        "transition-all duration-300 w-full flex flex-row p-4 gap-4 overflow-hidden items-start"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minHeight: 220,
        cursor: "pointer",
        boxShadow: `0 2px 8px 0 ${color}22`,
      }}
    >
      {/* Image + Cover */}
      <div className="flex flex-col gap-2 items-center">
        <div className="relative w-40 h-56 flex-shrink-0 rounded-lg overflow-hidden object-cover bg-muted">
          {image && (
            <Image
              src={image}
              alt={title}
              width={900}
              height={1800}
              className="object-cover object-center z-10"
              
              priority
              style={{ zIndex: 2, objectFit: "cover" }}
            />
          )}
        </div>
        {/* MAL & AL links below image, full width of image */}
        <div className="mt-2 w-40 flex gap-2 items-center justify-center">
          {alId && (
            <a
              href={`https://anilist.co/anime/${alId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 flex-1 px-0 py-1 rounded bg-secondary text-secondary-foreground font-semibold text-sm border border-[color:var(--border)] shadow hover:bg-secondary/80 transition min-w-0"
              style={{ width: '50%' }}
            >
              <SiAnilist className="w-6 h-6" />
            </a>
          )}
          {malId && (
            <a
              href={`https://myanimelist.net/anime/${malId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center flex-1 px-0 py-0 rounded bg-secondary text-secondary-foreground font-semibold text-sm border border-[color:var(--border)] shadow hover:bg-secondary/80 transition min-w-0"
              style={{ width: '50%' }}
            >
              <SiMyanimelist className="w-8 h-8" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <StatusIndicator status={status} />
          <h2 className={cn("font-bold text-xl", titleText, "leading-tight line-clamp-1 md:line-clamp-2")}>
            {title}
          </h2>
        </div>
        {romajiTitle && (
          <div className={cn("text-xs mb-1", subtitleText)}>
            {romajiTitle}
          </div>
        )}
        {nativeTitle && (
          <div className="text-[10px] text-muted-foreground mb-1 italic">
            {nativeTitle}
          </div>
        )}
        <div 
          className={cn("text-sm mb-2 relative md:max-h-24 max-h-12 ", descText)} 
          style={{ 
            lineHeight: "1.3",
            // maxHeight: isHovered ? "150px" : "60px",
            overflow: "auto",
            transition: "max-height 0.3s ease",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 155, 155, 0.5) transparent"
          }}
        >
          <div className="pr-1">
            {description.replace(/<[^>]+>/g, "")}
          </div>
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t pointer-events-none",
              isHovered ? "from-transparent to-transparent" : "from-card to-transparent"
            )}
            style={{
              opacity: isHovered ? 0 : 1,
              transition: "opacity 0.3s ease"
            }}
          />
        </div>
        {/* Info Pills */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          {type && (
            <span
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded",
                pillBg,
                pillText,
                "font-semibold text-xs"
              )}
            >
              <FaTv className="w-3 h-3 opacity-70" /> {type}
            </span>
          )}
          {releaseDate && (
            <span
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded",
                pillBg,
                pillText,
                "font-semibold text-xs"
              )}
            >
              <FaCalendarAlt className="w-3 h-3 opacity-70" /> {releaseDate}
            </span>
          )}
          {popularity && (
            <span
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded",
                pillBg,
                pillText,
                "font-semibold text-xs"
              )}
            >
              <FaFire className="w-3 h-3 opacity-70" />{" "}
              {popularity.toLocaleString()}
            </span>
          )}
          {episodes && (
            <span
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded",
                pillBg,
                pillText,
                "font-semibold text-xs"
              )}
            >
              {" "} EP
              <span className="font-bold">{episodes}</span> /{" "}
              <span className="opacity-70">
                {anime.totalEpisodes || episodes}
              </span>
            </span>
          )}
          {duration && (
            <span
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded",
                pillBg,
                pillText,
                "font-semibold text-xs"
              )}
            >
              <span>{duration}m</span>
            </span>
          )}
          {rating && (
            <span
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded",
                pillBg,
                "text-green-700",
                "font-semibold text-xs"
              )}
            >
              <FaStar className="w-3 h-3 mb-[2px]" /> {rating}
            </span>
          )}
        </div>
        {/* Genre Pills */}
        <div className="flex flex-wrap gap-1 mt-1">
          {genres.map((genre: string, idx: number) => (
            <span
              key={genre}
              className={cn(
                "text-xs px-1 py-0.5 rounded-sm font-semibold",
                genrePillBg,
                genrePillText,
              
              )}
              style={{ background: color, color: "#fff" }}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WindBreakerAnimeCard;
