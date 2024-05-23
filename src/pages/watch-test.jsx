import React from 'react'
import Player from '../components/watch/video/player';


const Watcher = () => {

  const dummyData = {
    episodeId: "episode-123",
    banner: "https://example.com/banner.jpg",
    malId: "123456",
    animeTitle: "Dummy Anime Title",
    updateDownloadLink: (link) => console.log("Update Download Link:", link),
    onEpisodeEnd: () => console.log("Episode Ended"),
    onPrevEpisode: () => console.log("Previous Episode"),
    onNextEpisode: () => console.log("Next Episode"),
  };

  return (
    <div className='mt-16'>
      <Player {...dummyData} />
    </div>
  )
}

export default Watcher
