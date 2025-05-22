import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  year?: number | string;
  episodes?: number | string;
  score?: number | string;
  genres?: string[];
  status?: string;
  variant?: 'default' | 'minimal';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  id,
  title,
  subtitle,
  image,
  year,
  episodes,
  score,
  genres = [],
  status = "Ongoing",
  variant = 'default'
}) => {
  return (
    <Link href={`/watch/${id}`}>
      <div className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden",
        variant === 'default' ? "bg-pink-100/80 dark:bg-pink-950/30" : "",
        "transition-all duration-300 hover:-translate-y-1",
        "shadow-sm hover:shadow-md"
      )}>
        {/* Main Card Content */}
        <div className="flex flex-row gap-4 p-4 w-full">
          {/* Image Section */}
          <div className="relative h-40 w-32 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col flex-1 justify-between">
            {/* Header */}
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-rose-800 dark:text-rose-300">{title}</h3>
              {subtitle && <p className="text-amber-600 text-sm">{subtitle}</p>}
              
              <div className="flex flex-wrap gap-1 mt-1">
                {genres.slice(0, 2).map((genre) => (
                  <span 
                    key={genre} 
                    className="bg-amber-500/90 text-white dark:bg-amber-700/90 text-xs px-2 py-0.5 rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats at Bottom */}
            <div className="flex items-center justify-between mt-auto pt-2">
              {year && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{year}</span>
                </div>
              )}
              
              {episodes && (
                <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                  {episodes} ep
                </div>
              )}

              {score && (
                <div className="flex items-center gap-1 ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-amber-600">{score}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-2 right-2">
          <div 
            className={cn(
              "w-3 h-3 rounded-full",
              status === 'Ongoing' ? "bg-lime-500" : "",
              status === 'Completed' ? "bg-blue-500" : "",
              status === 'Cancelled' ? "bg-red-500" : "",
              status === 'Not yet aired' ? "bg-orange-500" : "",
              !['Ongoing', 'Completed', 'Cancelled', 'Not yet aired'].includes(status) ? "bg-gray-500" : ""
            )}
          />
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
