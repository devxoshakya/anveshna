import React, { useState, useEffect } from 'react';
import Slideshow from '../components/home/slideshow';
import { fetchTrendingAnime, fetchTrendingAnime2 } from '../hooks/useAPI';
import { useNavigate } from 'react-router-dom';
import CardGrid from '../components/cards/cardItem';

const Home = () => {
  const [animeData, setAnimeData] = useState([]);

  useEffect(() => {
    fetchTrendingAnime()
      .then(trendingAnime => {
        const data = trendingAnime
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
            status : anime.status,
            color: anime.coverImage.color,
            relaseDate : anime.seasonYear,
          }));
        setAnimeData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


  const [animeData2, setAnimeData2] = useState([]);

  useEffect(() => {
    fetchTrendingAnime2()
      .then(trendingAnime => {
        const data = trendingAnime
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
            status : anime.status,
            color: anime.coverImage.color,
            relaseDate : anime.seasonYear,
          }));
        setAnimeData2(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className='text-white my-16'>
      <Slideshow data={animeData} />
      <div className=" mr-auto w-[70%] md:w-full  p-4">
        <CardGrid animes={animeData} />
        <br></br>
        <CardGrid animes={animeData2}/>
      </div>
    </div>
  );
};

export default Home;