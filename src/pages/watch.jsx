import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Image404URL from '../images/404-mobile.png';
import { fetchAnimeEmbeddedEpisodes, fetchAnimeEpisodes, fetchAnimeDetails, fetchAnimeRecommendations, fetchAnimeRelations } from '../hooks/useAPI';
import EpisodeList from '../components/watch/episodeList';
import Player from '../components/watch/video/player';
import EmbedPlayer from '../components/watch/video/embedPlayer';
import WatchAnimeData from '../components/watch/WatchAnimeData';
import SkeletonLoader from '../components/skeletons/skeletons';
import { MediaSource } from '../components/watch/video/mediaSource';
import Loader from '../components/loader/loader';


const LOCAL_STORAGE_KEYS = {
    LAST_WATCHED_EPISODE: 'last-watched-',
    WATCHED_EPISODES: 'watched-episodes-',
    LAST_ANIME_VISITED: 'last-anime-visited',
};

//pass seconds using anilist info 

const useCountdown = (seconds) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
      if (!seconds && seconds !== 0) {
          return; // Exit early if seconds is null or undefined
      }

      const targetTime = Date.now() + seconds;

      const timer = setInterval(() => {
          const now = Date.now();
          const distance = targetTime - now;

          if (distance < 0) {
              clearInterval(timer);
              setTimeLeft('Airing now or aired');
              return;
          }

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
      }, 1000);

      return () => clearInterval(timer);
  }, [seconds]);

  return timeLeft;
};



const Watch = () => {
  const videoPlayerContainerRef = useRef(null);
  const [videoPlayerWidth, setVideoPlayerWidth] = useState('100%');
  const getSourceTypeKey = (animeId) => `source-[${animeId}]`;
  const getLanguageKey = (animeId) => `subOrDub-[${animeId}]`;
  const updateVideoPlayerWidth = useCallback(() => {
      if (videoPlayerContainerRef.current) {
          const width = `${videoPlayerContainerRef.current.offsetWidth}px`;
          setVideoPlayerWidth(width);
      }
  }, [setVideoPlayerWidth, videoPlayerContainerRef]);
  const [maxEpisodeListHeight, setMaxEpisodeListHeight] = useState('100%');
  const { animeId, animeTitle, episodeNumber } = useParams();
  const garbageId = animeId;
  const STORAGE_KEYS = {
      SOURCE_TYPE: `source-[${animeId}]`,
      LANGUAGE: `subOrDub-[${animeId}]`,
  };
  const navigate = useNavigate();
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState({
      id: '0',
      number: 1,
      title: '',
      image: '',
      description: '',
      imageHash: '',
      airDate: '',
  });
  const [animeInfo, setAnimeInfo] = useState(null);
  const [relations, setRelations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEpisodeChanging, setIsEpisodeChanging] = useState(false);
  const [showNoEpisodesMessage, setShowNoEpisodesMessage] = useState(false);
  const [lastKeypressTime, setLastKeypressTime] = useState(0);
  const [sourceType, setSourceType] = useState(() => localStorage.getItem(STORAGE_KEYS.SOURCE_TYPE) || 'default');
  const [embeddedVideoUrl, setEmbeddedVideoUrl] = useState('');
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'sub');
  const [downloadLink, setDownloadLink] = useState('');
  const nextEpisodeAiringTime = animeInfo && animeInfo?.nextair?.timeUntilAiring 
      ? animeInfo?.nextair?.timeUntilAiring * 1000
      : null;
  const nextEpisodenumber = animeInfo?.nextAiringEpisode?.episode;
  const countdown = useCountdown(nextEpisodeAiringTime);
  const currentEpisodeIndex = episodes.findIndex((ep) => ep.id === currentEpisode.id);
  const [languageChanged, setLanguageChanged] = useState(false);
  //----------------------------------------------MORE VARIABLES----------------------------------------------
  const GoToHomePageButton = () => {
      const navigate = useNavigate();
      const handleClick = () => {
          navigate('/home');
      };
      return (<span className="bg-primary-accent text-white font-bold py-2 px-4 rounded hover:scale-105 transition transform duration-200" onClick={handleClick}>Go back Home</span>);
  };

  //FETCH VIDSTREAMING VIDEO
  const fetchVidstreamingUrl = async (episodeId) => {
    try {
        const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
        if (embeddedServers && embeddedServers.length > 0) {
            const vidstreamingServer = embeddedServers.find((server) => server.name === 'Vidstreaming');
            const selectedServer = vidstreamingServer || embeddedServers[0];
            setEmbeddedVideoUrl(selectedServer);
        }
    }
    catch (error) {
        console.error('Error fetching Vidstreaming servers for episode ID:', episodeId, error);
    }
};
//FETCH GOGO VIDEO
const fetchEmbeddedUrl = async (episodeId) => {
    try {
        const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
        if (embeddedServers && embeddedServers.length > 0) {
            const gogoServer = embeddedServers.find((server) => server.name === 'Gogo server');
            const selectedServer = gogoServer || embeddedServers[1];
            setEmbeddedVideoUrl(selectedServer);
        }
    }
    catch (error) {
        console.error('Error fetching gogo servers for episode ID:', episodeId, error);
    }
};
//SAVE TO LOCAL STORAGE NAVIGATED/CLICKED EPISODES
const updateWatchedEpisodes = (episode) => {
  console.log(animeId, episode, "here us the episode")
  const watchedEpisodesJson = localStorage.getItem(LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId);
  const watchedEpisodes = watchedEpisodesJson
      ? JSON.parse(watchedEpisodesJson)
      : [];
  if (!watchedEpisodes.some((ep) => ep.id === episode.id)) {
      watchedEpisodes.push(episode);
      localStorage.setItem(LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId, JSON.stringify(watchedEpisodes));
  }
};
const fetchAnimeData = async (animeId) => {
  // Fetch data from your API or service
  const response = await fetch(`https://anveshna-backend.vercel.app/api/v2/info/${animeId}`);
  const data = await response.json();
  return data;
};

const handleNavigate = async () => {
  const animeData = await fetchAnimeData(animeId);
  const animeTitletry = animeData.id_provider.idGogo || '';

  navigate(`/watch/${animeId}/${animeTitletry}/${episodeNumber || 1}`);
};

// Example usage (you might trigger this from a button click or similar event)
// Replace with actual animeId from your context
if (!animeTitle && !episodeNumber) {
  handleNavigate(animeId);
}

// UPDATES CURRENT EPISODE INFORMATION, UPDATES WATCHED EPISODES AND NAVIGATES TO NEW URL
const handleEpisodeSelect = useCallback(async (selectedEpisode) => {
  setIsEpisodeChanging(true);
  const animeTitle = selectedEpisode.id.split('-episode')[0];
  setCurrentEpisode({
      id: selectedEpisode.id,
      number: selectedEpisode.number,
      title: selectedEpisode.title,
      airDate: selectedEpisode.airDate,
  });
  localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId, JSON.stringify({
      id: selectedEpisode.id,
      title: selectedEpisode.title,
      number: selectedEpisode.number,
  }));
  updateWatchedEpisodes(selectedEpisode);
  navigate(`/watch/${animeId}/${encodeURI(animeTitle)}/${selectedEpisode.number || 1}`, {
      replace: true,
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
  setIsEpisodeChanging(false);
}, [animeId, navigate]);
//UPDATE DOWNLOAD LINK WHEN EPISODE ID CHANGES
const updateDownloadLink = useCallback((link) => {
  setDownloadLink(link);
}, []);
//AUTOPLAY BUTTON TOGGLE PROPS
const handleEpisodeEnd = async () => {
  const nextEpisodeIndex = currentEpisodeIndex + 1;
  if (nextEpisodeIndex >= episodes.length) {
      console.log('No more episodes.');
      return;
  }
  handleEpisodeSelect(episodes[nextEpisodeIndex]);
};
//NAVIGATE TO NEXT AND PREVIOUS EPISODES WITH SHIFT+N/P KEYBOARD COMBINATIONS (500MS DELAY)
const onPrevEpisode = () => {
  const prevIndex = currentEpisodeIndex - 1;
  if (prevIndex >= 0) {
      handleEpisodeSelect(episodes[prevIndex]);
  }
};
const onNextEpisode = () => {
  const nextIndex = currentEpisodeIndex + 1;
  if (nextIndex < episodes.length) {
      handleEpisodeSelect(episodes[nextIndex]);
  }
};

//loader


const [loader, setLoader] = useState(true);
useEffect(() => {
  setTimeout(() => {
    setLoader(false);
  }, 5550);
}, []);


//----------------------------------------------USEFFECTS----------------------------------------------
    //SETS DEFAULT SOURCE TYPE AND LANGUGAE TO DEFAULT AND SUB
    useEffect(() => {
      const defaultSourceType = 'default';
      const defaultLanguage = 'sub';
      setSourceType(localStorage.getItem(getSourceTypeKey(animeId || '')) ||
          defaultSourceType);
      setLanguage(localStorage.getItem(getLanguageKey(animeId || '')) || defaultLanguage);
  }, [animeId]);
  // SAVES LANGUAGE PREFERENCE TO LOCAL STORAGE
  useEffect(() => {
      localStorage.setItem(getLanguageKey(animeId), language);
  }, [language, animeId]);
  //FETCHES ANIME DATA AND ANIME INFO AS BACKUP
  useEffect(() => {
      let isMounted = true;
      const fetchInfo = async () => {
          if (!animeId) {
              console.error('Anime ID is null.');
              setLoading(false);
              return;
          }
          setLoading(true);
          try {
              const info = await fetchAnimeDetails(animeId);
              if (isMounted) {
                  setAnimeInfo(info);
              }
          }
          catch (error) {
              console.error('Failed to fetch anime data, trying fetchAnimeInfo as a fallback:', error);
              try {
                  const fallbackInfo = await fetchAnimeDetails(animeId);
                  if (isMounted) {
                      setAnimeInfo(fallbackInfo);
                  }
              }
              catch (fallbackError) {
                  console.error('Also failed to fetch anime info as a fallback:', fallbackError);
              }
              finally {
                  if (isMounted)
                      setLoading(false);
              }
          }
      };
      fetchInfo();
      return () => {
          isMounted = false;
      };
  }, [animeId]);
// FETCHES ANIME EPISODES BASED ON LANGUAGE, ANIME ID AND UPDATES COMPONENTS
useEffect(() => {
  let isMounted = true;
  const fetchData = async () => {
      setLoading(true);
      if (!animeId)
          return;
      try {
          const isDub = language === 'dub';
          const animeData = await fetchAnimeEpisodes(animeTitle);
          if (isMounted && animeData && Array.isArray(animeData.episodes)) {
              const transformedEpisodes = animeData.episodes
                  .filter((ep) => ep.id.includes('-episode-')) // Continue excluding entries without '-episode-'
                  .map((ep) => {
                  const episodePart = ep.id.split('-episode-')[1];
                  // New regex to capture the episode number including cases like "7-5"
                  const episodeNumberMatch = episodePart.match(/^(\d+(?:-\d+)?)/);
                  return {
                    ...ep,
                    number: episodeNumberMatch ? episodeNumberMatch[0] : ep.number,
                    id: ep.id,
                    title: ep.title,
                  };
                });
                setEpisodes((transformedEpisodes.reverse()));
              const navigateToEpisode = (() => {
                  if (languageChanged) {
                      const currentEpisodeNumber = episodeNumber || currentEpisode.number;
                      return (transformedEpisodes.find((ep) => ep.number === currentEpisodeNumber) || transformedEpisodes[transformedEpisodes.length - 1]);
                  }
                  else if (animeTitle && episodeNumber) {
                      const episodeId = `${animeTitle}-episode-${episodeNumber}`;
                      return (transformedEpisodes.find((ep) => ep.id === episodeId) ||
                          navigate(`/watch/${animeId}`, { replace: true }));
                  }
                  else {
                      const savedEpisodeData = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId);
                      const savedEpisode = savedEpisodeData
                          ? JSON.parse(savedEpisodeData)
                          : null;
                      return savedEpisode
                          ? transformedEpisodes.find((ep) => ep.number === savedEpisode.number) || transformedEpisodes[0]
                          : transformedEpisodes[0];
                  }
              })();
              if (navigateToEpisode) {
                  setCurrentEpisode({
                      id: navigateToEpisode.id,
                      number: navigateToEpisode.number,
                      title: navigateToEpisode.title,
                  });
                  const newAnimeTitle = navigateToEpisode.id.split('-episode-')[0];
                  navigate(`/watch/${animeId}/${newAnimeTitle}/${navigateToEpisode.number}`, { replace: true });
                  setLanguageChanged(false); // Reset the languageChanged flag after handling the navigation
              }
          }
      }
      catch (error) {
          console.error('Failed to fetch episodes:', error);
      }
      finally {
          if (isMounted)
              setLoading(false);
      }
  };
  // Last visited cache to order continue watching
  const updateLastVisited = () => {
      if (!animeInfo || !animeId)
          return; // Ensure both animeInfo and animeId are available
      const lastVisited = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED);
      const lastVisitedData = lastVisited ? JSON.parse(lastVisited) : {};
      lastVisitedData[animeId] = {
          timestamp: Date.now(),
          titleEnglish: animeInfo?.title?.english || '', // Assuming animeInfo contains the title in English
          titleRomaji: animeInfo?.title?.romaji || '', // Assuming animeInfo contains the title in Romaji
      };
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED, JSON.stringify(lastVisitedData));
  };
  if (animeId) {
      updateLastVisited();
  }
  fetchData();
  return () => {
      isMounted = false;
  };
}, [
  animeId,
  animeTitle,
  episodeNumber,
  navigate,
  language,
  languageChanged,
  currentEpisode.number,
]);

// FETCH EMBEDDED EPISODES IF VIDSTREAMING OR GOGO HAVE BEEN SELECTED
useEffect(() => {
  if (sourceType === 'vidstreaming' && currentEpisode.id) {
      fetchVidstreamingUrl(currentEpisode.id).catch(console.error);
  }
  else if (sourceType === 'gogo' && currentEpisode.id) {
      fetchEmbeddedUrl(currentEpisode.id).catch(console.error);
  }
}, [sourceType, currentEpisode.id]);
// UPDATE BACKGROUND IMAGE TO ANIME BANNER IF WIDTH IS UNDER 500PX / OR USE ANIME COVER IF NO BANNER FOUND
useEffect(() => {
  const updateBackgroundImage = () => {
      const bannerImage = animeInfo?.bannerImage || animeInfo?.coverImage?.large;
      if (animeInfo.image) {
          const img = new Image();
          img.onload = () => {
                setSelectedBackgroundImage(bannerImage);
          
          };
          img.onerror = () => {
              setSelectedBackgroundImage(bannerImage);
          };
          img.src = bannerImage;
      }
      else {
          setSelectedBackgroundImage(bannerImage);
      }
  };
  if (animeInfo && currentEpisode.id !== '0') {
      updateBackgroundImage();
  }
}, [animeInfo, currentEpisode]);
//UPDATES VIDEOPLAYER WIDTH WHEN WINDOW GETS RESIZED
useEffect(() => {
  updateVideoPlayerWidth();
  const handleResize = () => {
      updateVideoPlayerWidth();
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [updateVideoPlayerWidth]);
//UPDATES EPISODE LIST MAX HEIGHT BASED ON VIDEO PLAYER CURRENT HEIGHT
useEffect(() => {
  const updateMaxHeight = () => {
      if (videoPlayerContainerRef.current) {
          const height = videoPlayerContainerRef.current.offsetHeight;
          setMaxEpisodeListHeight(`${height}px`);
      }
  };
  updateMaxHeight();
  window.addEventListener('resize', updateMaxHeight);
  return () => window.removeEventListener('resize', updateMaxHeight);
}, []);
// SAVES SOURCE TYPE PREFERENCE TO LOCAL STORAGE
useEffect(() => {
  localStorage.setItem(getSourceTypeKey(animeId), sourceType);
}, [sourceType, animeId]);
//NAVIGATE TO NEXT AND PREVIOUS EPISODES WITH SHIFT+N/P KEYBOARD COMBINATIONS (500MS DELAY)
useEffect(() => {
  const handleKeyDown = (event) => {
      const targetTagName = event.target.tagName.toLowerCase();
      if (targetTagName === 'input' || targetTagName === 'textarea') {
          return;
      }
      if (!event.shiftKey || !['N', 'P'].includes(event.key.toUpperCase()))
          return;
      const now = Date.now();
      if (now - lastKeypressTime < 200)
          return;
      setLastKeypressTime(now);
      const currentIndex = episodes.findIndex((ep) => ep.id === currentEpisode.id);
      if (event.key.toUpperCase() === 'N' &&
          currentIndex < episodes.length - 1) {
          const nextEpisode = episodes[currentIndex + 1];
          handleEpisodeSelect(nextEpisode);
      }
      else if (event.key.toUpperCase() === 'P' && currentIndex > 0) {
          const prevEpisode = episodes[currentIndex - 1];
          handleEpisodeSelect(prevEpisode);
      }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [episodes, currentEpisode, handleEpisodeSelect, lastKeypressTime]);
//SET PAGE TITLE TO MIRURO + ANIME TITLE
useEffect(() => {
  if (animeInfo && animeInfo.title) {
      document.title =
          'Anveshna. | ' +
              (animeInfo.title.english ||
                  animeInfo.title.romaji ||
                  animeInfo.title.romaji ||
                  '');
  }
  else {
      document.title = 'Anveshna.';
  }
}, [animeInfo]);

//No idea
useEffect(() => {
  let isMounted = true;
  const fetchInfo = async () => {
      if (!animeId) {
          console.error('Anime ID is undefined.');
          return;
      }
      try {
          const info = await fetchAnimeDetails(animeTitle);
          if (isMounted) {
              setAnimeInfo(info);
          }
      }
      catch (error) {
          console.error('Failed to fetch anime info:', error);
      }
  };
  fetchInfo();
  return () => {
      isMounted = false;
  };
}, [animeId]);

useEffect(() => {
  let isMounted = true;
  const fetchRelations = async () => {
      if (!garbageId) {
          console.error('Anime ID is undefined.');
          return;
      }
      try {
          const data = await fetchAnimeRelations(garbageId);
          if (isMounted) {
              setRelations(data);
          }
      }
      catch (error) {
          console.error('Failed to fetch anime relations:', error);
      }
  };
  fetchRelations();
  return () => {
      isMounted = false;
  };
},[garbageId]);



useEffect(() => {
// Scroll to the top of the page
  window.scrollTo(0, 0);
}, []);


useEffect(() => { 
  let isMounted = true;
  const fetchRecommendations = async () => {
      if (!garbageId) {
          console.error('Anime ID is undefined.');
          return;
      }
      try {
          const data = await fetchAnimeRecommendations(garbageId);
          if (isMounted) {
              setRecommendations(data);
          }
      }
      catch (error) {
          console.error('Failed to fetch anime recommendations:', error);
      }
  };
  fetchRecommendations();
  return () => {
      isMounted = false;
  };
},[garbageId]);


//SHOW NO EPISODES DIV IF NO RESPONSE AFTER 10 SECONDS
useEffect(() => {
  const timeoutId = setTimeout(() => {
      if (!episodes || episodes.length === 0) {
          setShowNoEpisodesMessage(true);
      }
  }, 10000);
  return () => clearTimeout(timeoutId);
}, [loading, episodes]);
// SHOW NO EPISODES DIV IF NOT LOADING AND NO EPISODES FOUND
useEffect(() => {
  if (!loading && episodes.length === 0) {
      setShowNoEpisodesMessage(true);
  }
  else {
      setShowNoEpisodesMessage(false);
  }
}, [loading, episodes]);


//----------------------------------------------RETURN----------------------------------------------

return (
  <div className="container mx-auto p-4">
  {loader && <Loader className="mt-0 h-full w-full z-9999" />}
    {!loader && animeInfo && animeInfo.status === 'NOT_YET_AIRED' ? (
      <div className="text-center">
        <strong>
          <h2 className="text-2xl mb-2">Time Remaining:</h2>
        </strong>
        {!loader && animeInfo.nextAiringEpisode && countdown !== 'Airing now or aired' ? (
          <p className="flex justify-center items-center">
            <FaBell className="mr-2" /> {countdown}
          </p>
        ) : (
          <p>Unknown</p>
        )}
        {!loader && animeInfo.trailer && (
          <iframe
            className="mt-4 rounded"
            width="70%"
            height="100%"
            src={`https://www.youtube.com/embed/${animeInfo.trailer.id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    ) : showNoEpisodesMessage ? (
      <div className="text-center my-40 md:my-10">
        <h2 className="text-2xl mb-4">No episodes found :(</h2>
        <div className="mb-12">
          <img src={Image404URL} alt="404 Error" className="rounded mx-auto md:w-3/5" />
        </div>
        <button className="bg-primary-accent text-white font-bold py-2 px-4 rounded hover:scale-105 transition transform duration-200">Go To Home Page</button>
      </div>
    ) : (
      <div className="flex flex-1  md:flex-col gap-4">
        <div className="flex-1 min-w-[75%] md:min-w-full mt-14 relative">
          {loading ? (
            <SkeletonLoader />
          ) : sourceType === 'default' ? (
            <Player
              episodeId={currentEpisode.id}
              malId={animeInfo?.idMal}
              banner={selectedBackgroundImage}
              updateDownloadLink={updateDownloadLink}
              onEpisodeEnd={handleEpisodeEnd}
              onPrevEpisode={onPrevEpisode}
              onNextEpisode={onNextEpisode}
              animeTitle={animeInfo.title?.english || animeInfo.title?.romaji || ''}
            />
          ) : (
            <iframe
              src={embeddedVideoUrl}
              className="w-full h-full border-0 rounded"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        <div className="flex-1 mb-auto mt-14 md:mt-0 overflow-y-auto">
          { loading ? (
            <SkeletonLoader />
          ) : (
            <EpisodeList className=""
              animeId={animeId}
              episodes={episodes}
              selectedEpisodeId={currentEpisode.id}
              onEpisodeSelect={(episodeId) => {
                const episode = episodes.find((e) => e.id === episodeId);
                if (episode) {
                  handleEpisodeSelect(episode);
                }
              }}
              maxListHeight={maxEpisodeListHeight}
            />
          )}
        </div>
      </div>
    )}
    <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mt-4">
      <div className="w-[150%] md:w-full">
        { animeInfo && animeInfo.status !== 'Not yet aired' && (
          <MediaSource
            sourceType={sourceType}
            setSourceType={setSourceType}
            language={language}
            setLanguage={setLanguage}
            downloadLink={downloadLink}
            episodeId={currentEpisode.number.toString()}
            airingTime={animeInfo && animeInfo.status === 'RELEASING' ? countdown : undefined}
            nextEpisodenumber={nextEpisodenumber}
          />
        )}
        {!loader && animeInfo && <WatchAnimeData animeData={animeInfo} />}
      </div>
    </div>
  </div>
);
};

export default Watch;