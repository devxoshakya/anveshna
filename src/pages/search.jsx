import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CardGrid from '../components/cards/cardItem';
import { fetchSearchedAnime } from '../hooks/useAPI';
import { TypewriterEffectSmooth } from '../components/ui/writer.tsx';
const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const formatQuery = (query) => {
    const formattedQuery = query.replace(/\+/g, ' ').trim();
    return formattedQuery.charAt(0).toUpperCase() + formattedQuery.slice(1);
  };

  const words = [
    {
      text: "Search",
    },
    {
      text: "Results",
    },
    {
      text: "For",
    },
    {
      text: formatQuery(query),
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  useEffect(() => {
    if (query) {
      fetchSearchedAnime(query)
        .then(searchedAnime => {
          const data = searchedAnime
            .filter(anime => anime.bannerImage)
            .map(anime => ({
              id: anime.id,
              bannerImage: anime.bannerImage,
              title: anime.title.english || anime.title.romaji || 'No Title',
              title_romaji: anime.title.romaji,
              type: anime.format,
              totalEpisodes: anime.episodes,
              rating: anime.averageScore,
              duration: anime.duration,
              imageSrc: anime.coverImage.extraLarge,
              status: anime.status,
              color: anime.coverImage.color,
              relaseDate: anime.seasonYear,
            }));
          setSearchResults(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [query]);



  console.log('Search Results:', searchResults);

  return (

    <div className='mt-16 w-[70%] p-4 '>
      <div className='justify-center items-center flex'>
      <TypewriterEffectSmooth words={words} className='text-[40px]'/>
    
      </div>
      <CardGrid animes={searchResults} />
    </div>
  );
};

export default Search;