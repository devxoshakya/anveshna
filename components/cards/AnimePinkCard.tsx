import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface AnimePinkCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  year?: number | string;
  episodes?: number | string;
  score?: number | string;
  genres?: string[];
  status?: string;
}

export const AnimePinkCard: React.FC<AnimePinkCardProps> = ({
  id,
  title,
  subtitle,
  description,
  image,
  year,
  episodes,
  score,
  genres = [],
  status = "Ongoing",
}) => {
  return (
    <div className="max-w-md">
      <div className={cn(
        "flex overflow-hidden rounded-lg bg-pink-50 dark:bg-pink-950/30",
        "shadow-sm hover:shadow-md transition-all duration-300"
      )}>
        {/* Image Section */}
        <div className="w-[120px] h-[180px] relative flex-shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="120px"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-4 flex-grow relative">
          {/* Status Indicator */}
          <div className="absolute top-2 right-2 flex items-center">
            <div 
              className={cn(
                "w-2 h-2 rounded-full",
                status === 'Ongoing' ? "bg-lime-500" : "",
                status === 'Completed' ? "bg-blue-500" : "",
                status === 'Cancelled' ? "bg-red-500" : "",
                status === 'Not yet aired' ? "bg-orange-500" : "",
                !['Ongoing', 'Completed', 'Cancelled', 'Not yet aired'].includes(status) ? "bg-gray-500" : ""
              )}
            />
          </div>
          
          {/* Title */}
          <h3 className="text-rose-800 dark:text-rose-300 font-bold mb-1">
            {title}
          </h3>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-amber-600 dark:text-amber-500 text-sm italic mb-2">
              {subtitle}
            </p>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-3">
              {description}
            </p>
          )}
          
          {/* Tags/Genres */}
          <div className="flex flex-wrap gap-1 mt-auto mb-2">
            {genres.map((genre) => (
              <span 
                key={genre} 
                className="bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
          
          {/* Info bar */}
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            {year && <div>{year}</div>}
            
            {episodes && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0h-1.5m-15-1.5h15m-15 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" />
                </svg>
                {episodes}
              </div>
            )}
            
            {score && (
              <div className="flex items-center gap-1 ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-amber-600">{score}</span>
              </div>
            )}
          </div>
          
          {/* Watch Link */}
          <Link 
            href={`/watch/${id}`}
            className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg"
            aria-label={`Watch ${title}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimePinkCard;
