import React, { useState, useEffect } from 'react';
import CardGrid from '../cards/cardRelated';
import { fetchAnimeDetails } from '../../hooks/useAPI';

const RelatedAnimeData = ({ animeId }) => {
  const [relatedAnime, setRelatedAnime] = useState([]);

  useEffect(() => {
    fetchAnimeDetails(animeId)
      .then(anime => {
        if (anime && anime.relation) {
          const filteredRelated = anime.relation
            .filter(item => item.type === "ANIME" && item.format !== "MANGA")
            .map(anime => ({
              id: anime.id,
              bannerImage: anime.bannerImage,
              title: anime.title.english || anime.title.romaji || 'No Title',
              title_romaji: anime.title.romaji,
              type: anime.format,
              totalEpisodes: anime.episodes,
              rating: anime.averageScore,
              duration: anime.duration,
              imageSrc: anime.coverImage.large,
              status: anime.status,
              color: anime.coverImage.color,
              relaseDate: anime.season ? `${anime.season}` : anime.year,
            }));
          setRelatedAnime(filteredRelated);
        }
      })
      .catch(error => {
        console.error('Error fetching anime details:', error);
      });
  }, [animeId]);

  return (
    <div className='gap-2 mt-2  mx-auto'>
      <h1 className='text-2xl ml-2 font-bold text-var(--global-text) mb-6 md:text-xl md:mb-1'>RELATED</h1>
      {relatedAnime.length > 0 ? (
        <CardGrid animes={relatedAnime} />
      ) : (
        <p>No related anime found.</p>
      )}
    </div>
  );
};

export default RelatedAnimeData;