import React, { useState, useEffect } from 'react';

const WatchAnimeData = ({ animeData }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const getAnimeIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2];
  };

  const animeColor = animeData.color || '#999999';

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  const animeId = getAnimeIdFromUrl();

  useEffect(() => {
    setDescriptionExpanded(false);
  }, [animeId]);

  const removeHTMLTags = (description) => {
    return description.replace(/<[^>]+>/g, '').replace(/\([^)]*\)/g, '');
  };

  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showTrailer) {
        setShowTrailer(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTrailer]);

  function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const isScreenUnder500px = () => window.innerWidth < 500;

  return (
    <>
      {animeData && (
        <div className="mb-6 md:mb-0">
          <div className="rounded bg-[#0E0E0E] my-4 p-3 text-var(--global-text) flex  items-center md:flex-row md:items-start">
            <div className="flex flex-col items-center">
              <img 
                src={animeData.coverImage?.large} 
                alt="Anime Title" 
                className="rounded max-h-60 w-40 mr-4 mb-2 md:max-h-48 md:w-32"
              />
              {animeData.trailer && animeData.status !== 'Not yet aired' && (
                <button 
                  onClick={toggleTrailer} 
                  className="bg-[#141414] text-gray-300 font-medium rounded w-40 mr-4 mb-2 mt-2 p-0 h-10 transition-transform transform hover:scale-105 focus:scale-105 md:w-32 md:text-sm"
                >
                  <p><strong>TRAILER</strong></p>
                </button>
              )}
              {showTrailer && (
                <div 
                  className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-md animate-fadeIn animate-slideUp"
                  onClick={toggleTrailer}
                >
                  <div 
                    className="bg-var(--global-div) w-[45%] h-[40%] rounded overflow-hidden aspect-w-16 aspect-h-9 md:w-11/12"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${animeData.trailer.id}`}
                      allowFullScreen
                      className="w-full h-full border-none"
                      title='Anime Trailer'
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="text-left text-sm mt-4 md:mt-0">
              <p className="text-2xl ml-2 font-bold text-var(--global-text) mb-2 md:text-xl md:mb-1">
              {animeData.title?.english || animeData.title?.romaji || ''}
              </p>
              <p className="italic mt-0 ml-2 text-var(--animeData.color) leading-none mb-2 md:leading-tight md:mb-1" style={{color: animeColor}}>
                {animeData.title?.romaji || animeData.title?.native || ''}
              </p>
              {!isScreenUnder500px() && animeData.description && (
                <div>
                  <p className="text-[#111111] mt-0 mb-1 leading-6 md:leading-5">
                    <button onClick={toggleDescription} className="bg-var(--global-div) text-[#555555A5] font-semibold flex border-none p-2 rounded my-2 text-left transition-colors focus:outline-none md:my-1">
                      {isDescriptionExpanded ? removeHTMLTags(animeData.description) : `${removeHTMLTags(animeData.description).substring(0, 100)}...`}
                      {isDescriptionExpanded ? '[Show Less]' : '[Show More]'}
                    </button>
                  </p>
                </div>
              )}
              <div className="grid ml-2 grid-cols-2 gap-4 md:grid-cols-1 md:gap-0 xl:grid-cols-[1.25fr_1fr]">
                <div className="rounded pt-2.5 text-[#444444] flex flex-col items-start">
                  <div>
                    {animeData.format ? (
                      <p>Type: <strong>{animeData.format}</strong></p>
                    ) : (
                      <p>Type: <strong>Unknown</strong></p>
                    )}
                    {animeData.year ? (
                      <p>Year: <strong>{animeData.year}</strong></p>
                    ) : (
                      <p>Year: <strong>Unknown</strong></p>
                    )}
                    {animeData.status && (
                      <p>Status: <strong>{animeData.status === 'Completed' ? 'Finished' : animeData.status === 'Ongoing' ? 'Airing' : animeData.status}</strong></p>
                    )}
                    {animeData.decimalScore ? (
                      <p>Rating: <strong>{animeData.averageScore/10}</strong></p>
                    ) : (
                      <p>Rating: <strong>Unknown</strong></p>
                    )}
                  </div>
                </div>
                <div className="mt-2.5 text-[#444444] md:mt-0">
                  <div>
                    {animeData.episodes !== null ? (
                      <p>Episodes: <strong>{animeData.episodes}</strong></p>
                    ) : (
                      <p>Episodes: <strong>Unknown</strong></p>
                    )}
                    {animeData.duration ? (
                      <p>Duration: <strong>{animeData.duration} min</strong></p>
                    ) : (
                      <p>Duration: <strong>Unknown</strong></p>
                    )}
                    {animeData.season ? (
                      <p>Season: <strong>{capitalizeFirstLetter(animeData.season)}</strong></p>
                    ) : (
                      <p>Season: <strong>Unknown</strong></p>
                    )}
                    {animeData.genres && animeData.genres.length > 0 ? (
                      <p>Genres: <strong>{animeData.genres.join(', ')}</strong></p>
                    ) : (
                      <p>Genres: <strong>Unknown</strong></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isScreenUnder500px() && animeData.description && (
            <div className='bg-[#0E0E0E]'>
              <p className="leading-none text-[#222222] text-left mt-4">
                <button onClick={toggleDescription} className="bg-var(--global-div) text-[#555555A5] font-semibold flex border-none p-2 rounded mb-2 text-left transition-colors focus:outline-none md:mb-1">
                  {isDescriptionExpanded ? removeHTMLTags(animeData.description) : `${removeHTMLTags(animeData.description).substring(0, 100)}...`}
                  {isDescriptionExpanded ? '[Show Less]' : '[Show More]'}
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WatchAnimeData;
