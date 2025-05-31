import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/skeletons/skeletons";
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { FaPlay } from 'react-icons/fa';
import { TbCards } from 'react-icons/tb';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';

// Keep just the Title styled component for dynamic color on hover
const Title = styled.h6<{ $isHovered: boolean; color?: string }>`
  color: ${(props) => (props.$isHovered ? props.color : 'var(--foreground)')};
  transition: color 0.2s ease-in-out;
`;

export const CardItem: React.FC<{ anime: any }> = ({ anime }) => {
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [anime.id]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const imageSrc = anime.image || '';
  const animeColor = anime.color || '#999999';
  const displayTitle = useMemo(
    () => anime.title.english || anime.title.romaji || 'No Title',
    [anime.title.english, anime.title.romaji],
  );

  const truncateTitle = useMemo(
    () => (title: string, maxLength: number) =>
      title.length > maxLength ? `${title.slice(0, maxLength)}...` : title,
    [],
  );

  const handleImageLoad = () => {
    setLoading(false);
  };

  // No longer need the displayDetail since we're showing type text directly
  // over the dark overlay without a background

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <Link
          href={`/watch/${anime.id}`}
          className={cn(
            "text-foreground animate-in slide-in-from-bottom duration-400",
            "no-underline hover:z-10 focus:z-10 active:z-10"
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          title={anime.title.english || anime.title.romaji}
        >
          <div className="w-full rounded-lg cursor-pointer transform scale-100 transition-transform duration-200">
            <div className="transition-transform duration-200 hover:translate-y-[-5px] sm:hover:translate-y-[-5px]">
              <div className={cn(
                "relative text-left overflow-hidden rounded-lg",
                "pt-[138.3%] bg-card shadow-sm transition-colors duration-200",
                "animate-in slide-in-from-bottom duration-500"
              )}>
                <div className="absolute inset-0 overflow-hidden group">
                  <img
                    src={imageSrc}
                    onLoad={handleImageLoad}
                    loading="eager"
                    alt={(anime.title.english || anime.title.romaji) + ' Cover Image'}
                    className={cn(
                      "absolute inset-0 w-full h-full rounded-lg",
                      "transition-all duration-300 ease-in-out",
                      "object-cover"
                    )}
                  />
                  
                  {/* Dark overlay on hover - making it darker and more visible */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black to-black/50 transition-all duration-300",
                      isHovered ? "opacity-80" : "opacity-0"
                    )}
                  ></div>
                  
                  {/* Play icon - enhanced visibility */}
                  <div className={cn(
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                    "transition-all duration-300 z-50",
                    "opacity-0 scale-90",
                    isHovered ? "opacity-100 scale-100" : ""
                  )}>
                    <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                      <FaPlay className="text-2xl" />
                    </div>
                  </div>
                </div>
                
                {/* Anime type displayed over the dark overlay - improved visibility */}
                {isHovered && (
                  <div 
                    className={cn(
                      "absolute bottom-3 left-3 text-sm font-extrabold z-20",
                      "animate-in fade-in duration-300"
                    )}
                    style={{ 
                      color: anime.color || "white",
                      textShadow: "0px 0px 4px rgba(0,0,0,0.8)" 
                    }}
                  >
                    {anime.type}
                  </div>
                )}
              </div>
            </div>
            
            <div className={cn(
              "flex items-center p-1 my-1 gap-1.5 rounded-sm cursor-pointer",
              "transition-colors duration-200 hover:bg-muted"
            )}>
              <StatusIndicator status={anime.status} />
              <Title
                $isHovered={isHovered}
                color={anime.color}
                title={'Title: ' + (anime.title.english || anime.title.romaji)}
                className="m-0 overflow-hidden whitespace-nowrap text-ellipsis transition-colors duration-200 md:text-[15px] font-bold sm:text-base text-sm"
              >
                {truncateTitle(displayTitle, 35)}
              </Title>
            </div>
            
            <div>
              <div className={cn(
                "animate-in slide-in-from-right duration-400 w-full",
                "font-medium text-[10px] md:text-xs",
                "flex flex-nowrap items-center justify-between p-0 overflow-hidden"
              )}>
                {/* Mobile-friendly indicators with responsive sizing */}
                {anime.releaseDate && (
                  <div className="flex items-center gap-0.5 md:gap-1 bg-muted/70 px-1 md:px-1.5 py-0.5 md:py-1 rounded-md">
                    <FaCalendarAlt className="text-muted-foreground w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                    <span className="text-muted-foreground md:block hidden">{anime.releaseDate}</span>
                    <span className="text-muted-foreground md:hidden block">{anime.releaseDate}</span>
                  </div>
                )}
                {(anime.totalEpisodes || anime.episodes) && (
                  <div className="flex items-center gap-0.5 md:gap-1 bg-muted/70 px-1 md:px-1.5 py-0.5 md:py-1 rounded-md">
                    <TbCards className="text-muted-foreground w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                    <span className="text-muted-foreground">{anime.totalEpisodes || anime.episodes}</span>
                  </div>
                )}
                {anime.rating && (
                  <div className="flex items-center gap-0.5 md:gap-1 bg-muted/70 px-1 md:px-[6px] py-0.5 md:py-1 rounded-md min-w-fit">
                    <FaStar className="text-primary w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                    <span className="text-muted-foreground">{anime.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

CardItem.displayName = "CardItem";