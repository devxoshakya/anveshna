import React, { useState, useEffect } from 'react';
import { TbCardsFilled } from 'react-icons/tb';
import { FaStar } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';
import SkeletonLoader from '../skeletons/skeletons';
import { useNavigate } from 'react-router-dom';

const Slideshow = () => {
  const navigate = useNavigate();

  const handlePlayButtonClick = (id) => {
    navigate(`/watch/${id}`);
  };

// 1 : jujutsu kaisen, 2: evangelion , 3: attack on titan , 4: demon slayer , 5: your name

  const data = [
    {
      id: 21519,
      title: "Your Name.",
      videoLink: "https://github.com/devxoshakya/anveshna/raw/main/src/videos/5.webm",
      type: "MOVIE",
      totalEpisodes: 1,
      rating: 85,
      duration: 106,
    },
    {
      id: 101922,
      title: "Demon Slayer: Kimetsu no Yaiba",
      videoLink: "https://github.com/devxoshakya/anveshna/raw/main/src/videos/4.webm",
      type: "TV",
      totalEpisodes: 26,
      rating: 83,
      duration: 24,
    },
    {
      id: 113415,
      title: "Jujutsu Kaisen",
      videoLink:  "https://github.com/devxoshakya/anveshna/raw/main/src/videos/1.webm",
      type: "TV",
      totalEpisodes: 24,
      rating: 86,
      duration: 24,
    },{
      id: 16498,
      title: "Attack On Titan",
      videoLink:  "https://github.com/devxoshakya/anveshna/raw/main/src/videos/3.webm",
      type: "TV",
      totalEpisodes: 25,
      rating: 91,
      duration: 24,
    },{
      id: 30,
      title: "Neon Genesis Evangelion",
      videoLink:  "https://github.com/devxoshakya/anveshna/raw/main/src/videos/2.webm",
      type: "TV",
      totalEpisodes: 26,
      rating: 85,
      duration: 24,
    },
    
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setCurrentIndex(randomIndex);
    }
  }, [data]);

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className="relative h-[90vh] mt-18 md:h-[40vh]">
      {data.length === 0 ? (
        <SkeletonLoader />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            src={data[currentIndex].videoLink}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
          />
          <div className="absolute flex flex-col justify-end bottom-0 left-0 h-[100%] w-[80%] md:w-[60%] p-16 bg-gradient-to-r from-black">
            <h2
              className="text-[44px] md:text-[24px] font-bold opacity-100"
              onClick={() => handlePlayButtonClick(data[currentIndex].id)}
            >
              {truncateTitle(data[currentIndex].title, 45)}
            </h2>
            <p className='flex items-center text-white md:w-[100%]'>
              <span>{data[currentIndex].type}</span>
              <TbCardsFilled className="ml-2" />
              <span className='pl-1'>{data[currentIndex].totalEpisodes}</span>
              <FaStar className="ml-2" />
              <span className='pl-1'>{data[currentIndex].rating / 10}</span>
              <FaClock className="ml-2" />
              <span className='pl-1'>{data[currentIndex].duration} min</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slideshow;
