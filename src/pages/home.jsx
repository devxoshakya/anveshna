import React, { useState, useEffect } from 'react';
import Slideshow from '../components/home/slideshow';
import { fetchTrendingAnime, fetchPopularAnime} from '../hooks/useAPI';
import CardGrid from '../components/cards/cardItem';

const Home = () => {
  window.scrollTo(0, 0);
  const [activeTab, setActiveTab] = useState('TRENDING');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [trendingData, setTrendingData] = useState([]);
  const [popularData, setPopularData] = useState([]);

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
            status: anime.status,
            color: anime.coverImage.color,
            relaseDate: anime.seasonYear,
          }));
        setTrendingData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  

  useEffect(() => {
    fetchPopularAnime()
      .then(popularAnime => {
        const data = popularAnime
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
        setPopularData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // useEffect(() => {
  //   fetchTopAirAnime()
  //     .then(topAirAnime => {
  //       const data = topAirAnime
  //         .map(anime => ({
  //           id: anime.id,
  //           title: anime.title || 'No Title',
  //           totalEpisodes: anime.latestEp,
  //           imageSrc: anime.image_url,
  //         }));
  //       setTopAirData(data);
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // },[]);



  const displayData = activeTab === 'TRENDING' ? trendingData : popularData;

  return (
    <div className='text-white my-16'>
      <Slideshow data={trendingData} />
      <div className='flex md:flex-col'>
      <div className=" w-full mx-auto md:w-full p-4">
        <div className="flex mx-auto justify-center gap-4 my-8">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              activeTab === 'TRENDING' ? 'bg-[#333333] text-[var(--global-text)]' : 'bg-transparent text-[var(--global-text)] hover:bg-[#222222]'
            }`}
            onClick={() => handleTabClick('TRENDING')}
            >
            TRENDING
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              activeTab === 'POPULAR' ? 'bg-[#333333] text-[var(--global-text)]' : 'bg-transparent text-[var(--global-text)] hover:bg-[#222222]'
            }`}
            onClick={() => handleTabClick('POPULAR')}
            >
            POPULAR
          </button>
        </div>
        <CardGrid animes={displayData} />
        </div>
      </div>
    </div>
  );
};

export default Home;