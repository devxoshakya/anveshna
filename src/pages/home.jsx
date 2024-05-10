import React from 'react'
import Slideshow from '../components/home/slideshow'
import { toContainElement } from '@testing-library/jest-dom/matchers';
import { type } from '@testing-library/user-event/dist/type';

const data = [
    {
      id: 1,
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/163270-QshLCttd04s6.jpg",
      title: 'Wind Breakers',
      type: 'TV',
      totalEpisodes: 12,
      rating: 8.5,
      duration: 24,
    }
  ];

const home = () => {
  return (
    <div className='text-white my-24'>
      <Slideshow data={data}/>
      {/* <Slideshow  data={data}/> */}
      {/* <Slideshow  data={data}/> */}

    </div>
  )
}

export default home
