import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { TbCardsFilled } from 'react-icons/tb';

const CardItemContent = ({ anime }) => {
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

  const imageSrc = anime.imageSrc || '';
  const animeColor = anime.color || '#999999';

  const truncateTitle = useMemo(
    () => (title, maxLength) =>
      title.length > maxLength ? `${title.slice(0, maxLength)}...` : title,
    [],
  );

  const handleStatusCheck = useMemo(() => {
    switch (anime.status) {
      case 'RELEASING':
        return (
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
        );
      case 'FINISHED':
        return (
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
        );
      case 'CANCELLED':
        return (
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
        );
      case 'NOT_YET_RELEASED':
        return (
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></div>
        );
      default:
        return (
          <div className="w-2 h-2 bg-gray-500 rounded-full mr-2 flex-shrink-0"></div>
        );
    }
  }, [anime.status]);

  
  

  const handleImageLoad = () => {
    setLoading(false);
  };

  const displayDetail = useMemo(() => {
    return (
      <div
        className={`absolute bottom-0 m-1 p-1 font-bold text-sm text-white bg-gray-800 bg-opacity-70 rounded-md backdrop-blur-sm ${
          isHovered ? 'opacity-90' : 'opacity-0'
        } transition-opacity duration-300`} 
        
      >
        {anime.type}
      </div>
    );
  }, [isHovered, anime.type]);

  const skeletonLoading = (
    <div className="animate-pulse">
      <div className="bg-gray-300 rounded-lg h-48"></div>
      <div className="flex items-center mt-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded mt-1 w-20"></div>
      <div className="h-3 bg-gray-200 rounded mt-1"></div>
    </div>
  );

  return (
    <>
      {loading ? (
        skeletonLoading
      ) : (
        <Link
          to={`/watch/${anime.id}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="text-gray-800 hover:z-10 transition-transform duration-300 transform hover:scale-105"
          title={anime.title.english || anime.title.romaji}
        >
          <div className=" overflow-hidden">
          <div className="overflow-hidden relative">
            <div
              className={`absolute inset-0 rounded-lg ${
                isHovered
                  ? 'bg-gradient-radial from-black/40 via-transparent to-transparent'
                  : ''
              }`}
            />
            <img
              src={imageSrc}
              onLoad={handleImageLoad}
              loading="eager"
              alt={anime.title || anime.title.romaji + ' Cover Image'}
              className="w-full rounded-lg shadow-md h-60 md:h-36 object-cover"
            />
            <FaPlay
              title={'Play ' + (anime.title || anime.title_romaji)}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl opacity-0 ${
                isHovered ? 'opacity-100' : ''
              } transition-opacity duration-300`}
            />
            {isHovered && displayDetail}
          </div>
            <div
              className="flex items-center pt-2 rounded-b-lg"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {handleStatusCheck}
              <div
                className="truncate font-semibold"
                title={'Title: ' + (anime.title || anime.title_romaji)}
                style={{ color: animeColor }}
              >
                {truncateTitle(anime.title || anime.title_romaji, 24)}
              </div>
            </div>
            <div className="">
              <div className="text-sm text-[#666666A6] truncate font-semibold" title="Romaji Title">
                {truncateTitle(anime.title_romaji || 'NO TITLE', 24)}
              </div>
              <div className="md:text-[12px] text-sm text-[#666666A6] font-semibold flex items-center">
                {anime.relaseDate && (
                  <>
                    <FaCalendarAlt className="mr-1" />
                    {anime.relaseDate}
                  </>
                )}
                {(anime.totalEpisodes || anime.episodes) && (
                  <>
                    <TbCardsFilled className="mx-1" />
                    {anime.totalEpisodes || anime.episodes}
                  </>
                )}
                {anime.rating && (
                  <>
                    <FaStar className="mx-1" />
                    {anime.rating/10}
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};
export default function CardGrid({animes}) {
    return (
      <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-7 gap-8 md:gap-4">
        {Array.isArray(animes) && animes.length > 0 ? (
          animes.map((anime) => (
            <CardItemContent key={anime.id} anime={anime} />
          ))
        ) : (
          <div className="text-center text-white"></div>)}
      </div>
    );
  }

// // Sample anime data
// const animes = [
//   {
//     id: 1,
//     title: { english: 'Anime Title 1', romaji: 'アニメタイトル 1' },
//     image: 'https://example.com/anime-cover-1.jpg',
//     type: 'TV',
//     status: 'Ongoing',
//     releaseDate: '2023-01-01',
//     episodes: 12,
//     rating: 8.5,
//     color: '#ff6347',
//   },
//   {
//     id: 2,
//     title: { english: 'Anime Title 2', romaji: 'アニメタイトル 2' },
//     image: 'https://example.com/anime-cover-2.jpg',
//     type: 'Movie',
//     status: 'Completed',
//     releaseDate: '2022-05-15',
//     episodes: null,