import React, { useState, useEffect } from 'react';
import Slideshow from '../components/home/slideshow';
import { fetchTrendingAnime } from '../hooks/useAPI';

const Home = () => {
  const [animeData, setAnimeData] = useState([]);

  useEffect(() => {
    fetchTrendingAnime()
      .then(trendingAnime => {
        const data = trendingAnime
          .filter(anime => anime.bannerImage) // Filter out anime without a banner image
          .map(anime => ({
            id: anime.id,
            bannerImage: anime.bannerImage,
            title: anime.title.english || anime.title.userPreferred, // Use English title if available, otherwise fallback to userPreferred
            type: anime.format,
            totalEpisodes: anime.episodes,
            rating: anime.averageScore,
            duration: anime.duration,
          }));
        setAnimeData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className='text-white my-24'>
      <Slideshow data={animeData} />
    </div>
  );
};

export default Home;
