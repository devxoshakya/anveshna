import React from 'react'
import { useState } from 'react';
import Player from '../components/watch/video/player';


const Watcher = () => {

  const demoEpisodes = [
    {
      episodeId: 'cowboy-bebop-episode-1',
      banner : "https://cdn.myanimelist.net/images/anime/1000/110531.jpg",
      malId : '44511',
      animeTitle : 'Chainsaw Man'
    }
  ];

  const [currentEpisode, setCurrentEpisode] = useState(demoEpisodes[0]);

  const handleEpisodeEnd = async () => {
    const nextEpisodeIndex = demoEpisodes.findIndex(
      (ep) => ep.episodeId === currentEpisode.episodeId
    ) + 1;
    if (nextEpisodeIndex < demoEpisodes.length) {
      setCurrentEpisode(demoEpisodes[nextEpisodeIndex]);
    }
  };

  const handlePrevEpisode = () => {
    const prevEpisodeIndex = demoEpisodes.findIndex(
      (ep) => ep.episodeId === currentEpisode.episodeId
    ) - 1;
    if (prevEpisodeIndex >= 0) {
      setCurrentEpisode(demoEpisodes[prevEpisodeIndex]);
    }
  };

  const handleNextEpisode = () => {
    const nextEpisodeIndex = demoEpisodes.findIndex(
      (ep) => ep.episodeId === currentEpisode.episodeId
    ) + 1;
    if (nextEpisodeIndex < demoEpisodes.length) {
      setCurrentEpisode(demoEpisodes[nextEpisodeIndex]);
    }
  };

  const updateDownloadLink = (link) => {
    console.log('Download link:', link);
  };

  return (
    <div className='mt-16'>
      <Player
        episodeId={currentEpisode.episodeId}
        banner={currentEpisode.banner}
        malId={currentEpisode.malId}
        updateDownloadLink={updateDownloadLink}
        onEpisodeEnd={handleEpisodeEnd}
        onPrevEpisode={handlePrevEpisode}
        onNextEpisode={handleNextEpisode}
        animeTitle={currentEpisode.animeTitle}
      />
    </div>
  )
}

export default Watcher
