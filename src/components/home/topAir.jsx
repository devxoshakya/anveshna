import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbCardsFilled } from 'react-icons/tb';
import { FaCalendarAlt } from 'react-icons/fa';

const HomeSideBar = ({ animeData }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 //write a function to trunculate anime.title to 40 characters
    const truncateTitle = (title, maxLength) => {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };

//write a function to remove alphabet from sting only show integer
    const removeAlphabet = (str) => {
        return str.replace(/\D/g, '');
    };

  const displayedAnime = windowWidth <= 500 ? animeData.slice(0, 5) : animeData;

  return (
    <div className="max-w-md my-8 ml-2 mr-4 mt-[4.5rem] md:mt-0 md:ml-4 md:mb-0 gap-2 transition-all duration-200 ease-in-out">
        <h1 className='text-2xl md:text-xl font-bold mb-4'>TOP AIRING</h1>
      {displayedAnime.map((anime, index) => (
        <Link
          key={anime.id}
          to={`/watch/69420/${anime.id}`}
          className="text-decoration-none text-inherit"
          title={`${anime.title}`}
          aria-label={`Watch ${anime.title}`}
        >
          <div
            className={`flex items-center bg-[#141414] rounded-lg overflow-hidden gap-2 cursor-pointer mb-2 animate-slideUpAnimation`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              src={anime.imageSrc}
              alt={truncateTitle(anime.title, 40)}
              className="w-16 h-24 object-cover rounded-lg"
            />
            <div className="flex flex-col">
              <div className="flex items-center p-2 mt-1 rounded-md cursor-pointer transition-colors duration-200 ">
                {(() => {
                  switch ('RELEASING') {
                    case 'FINISHED':
                      return (
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      );
                    case 'Cancelled':
                      return (
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      );
                    case 'NOT_YET_RELEASED':
                      return (
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                      );
                    case 'RELEASING':
                      return (
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      );
                    default:
                      return (
                        <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
                      );
                  }
                })()}
                <p className="line-clamp-1 font-medium">
                  {truncateTitle(anime.title, 40)}
                </p>
              </div>
              <div className="text-sm text-[#666666A6] flex items-center">
                 <>
                 TV
                 </>
                  <>
                    <FaCalendarAlt className="ml-2 mr-1" />
                    2024
                  </>
        
                {(
                    <>
                      <TbCardsFilled className="ml-2" />
                      {removeAlphabet(anime.totalEpisodes)} / ?
                    </>
                  )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomeSideBar;