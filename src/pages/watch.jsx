import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { FaBell } from 'react-icons/fa';
import styled from 'styled-components';
import Image404URL from '../images/404-mobile.png';
import { fetchAnimeEmbeddedEpisodes, fetchAnimeEpisodes, fetchAnimeDetails } from '../hooks/useAPI';
import EpisodeList from '../components/watch/episodeList';
import Player from '../components/watch/video/player';
import EmbedPlayer from '../components/watch/video/embedPlayer';
import WatchAnimeData from '../components/watch/WatchAnimeData';
import AnimeDataList from '../components/watch/animeDataList';

const WatchContainer = styled.div``;

const WatchWrapper = styled.div`
  font-size: 0.9rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--global-primary-bg);
  color: var(--global-text);

  @media (min-width: 1000px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const DataWrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr; // Aim for a 3:1 ratio
  width: 100%; // Make sure this container can expand enough
  @media (max-width: 1000px) {
    grid-template-columns: auto;
  }
`;

const SourceAndData = styled.div`
  width: ${({ $videoPlayerWidth }) => $videoPlayerWidth};
`;

const RalationsTable = styled.div`
  padding: 0;
  margin-top: 1rem;
  @media (max-width: 1000px) {
    margin-top: 0rem;
  }
`;

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--global-border-radius);

  @media (min-width: 1000px) {
    flex: 1 1 auto;
  }
`;

const EpisodeListContainer = styled.div`
  width: 100%;
  max-height: 100%;

  @media (min-width: 1000px) {
    flex: 1 1 500px;
    max-height: 100%;
  }

  @media (max-width: 1000px) {
    padding-left: 0rem;
  }
`;

const NoEpsFoundDiv = styled.div`
  text-align: center;
  margin-top: 10rem;
  margin-bottom: 10rem;
  @media (max-width: 1000px) {
    margin-top: 2.5rem;
    margin-bottom: 6rem;
  }
`;

const NoEpsImage = styled.div`
  margin-bottom: 3rem;
  max-width: 100%;

  img {
    border-radius: var(--global-border-radius);
    max-width: 100%;
    @media (max-width: 500px) {
      max-width: 70%;
    }
  }
`;

const StyledHomeButton = styled.button`
  color: white;
  border-radius: var(--global-border-radius);
  border: none;
  background-color: var(--primary-accent);
  margin-top: 0.5rem;
  font-weight: bold;
  padding: 1rem;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease-in-out;
  &:hover,
  &:active,
  &:focus {
    transform: translate(-50%, -50%) scale(1.05);
  }
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

const IframeTrailer = styled.iframe`
  position: relative;
  border-radius: var(--global-border-radius);
  border: none;
  top: 0;
  left: 0;
  width: 70%;
  height: 100%;
  text-items: center;
  @media (max-width: 1000px) {
    width: 100%;
    height: 100%;
  }
`;

const LOCAL_STORAGE_KEYS = {
  LAST_WATCHED_EPISODE: 'last-watched-',
  WATCHED_EPISODES: 'watched-episodes-',
  LAST_ANIME_VISITED: 'last-anime-visited',
};

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) {
      return; // Exit early if targetDate is null or undefined
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Airing now or aired');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Main Component
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
  const [loading, setLoading] = useState(true);
  const [isEpisodeChanging, setIsEpisodeChanging] = useState(false);
  const [showNoEpisodesMessage, setShowNoEpisodesMessage] = useState(false);
  const [lastKeypressTime, setLastKeypressTime] = useState(0);
  const [sourceType, setSourceType] = useState(
    () => localStorage.getItem(STORAGE_KEYS.SOURCE_TYPE) || 'default',
  );
  const [embeddedVideoUrl, setEmbeddedVideoUrl] = useState('');
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'sub',
  );
  const [downloadLink, setDownloadLink] = useState('');
  const nextEpisodeAiringTime =
    animeInfo && animeInfo.nextAiringEpisode
      ? animeInfo.nextAiringEpisode.airingTime * 1000
      : null;
  const nextEpisodenumber = animeInfo?.nextAiringEpisode?.episode;
  const countdown = useCountdown(nextEpisodeAiringTime);
  const currentEpisodeIndex = episodes.findIndex(
    (ep) => ep.id === currentEpisode.id,
  );
  const [languageChanged, setLanguageChanged] = useState(false);

  const GoToHomePageButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/home');
    };

    return (
      <StyledHomeButton onClick={handleClick}>Go back Home</StyledHomeButton>
    );
  };

  const fetchVidstreamingUrl = async (episodeId) => {
    try {
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
      if (embeddedServers && embeddedServers.length > 0) {
        const vidstreamingServer = embeddedServers.find(
          (server) => server.name === 'Vidstreaming',
        );
        const selectedServer = vidstreamingServer || embeddedServers[0];
        setEmbeddedVideoUrl(selectedServer.url);
      }
    } catch (error) {
      console.error(
        'Error fetching Vidstreaming servers for episode ID:',
        episodeId,
        error,
      );
    }
  };

  const fetchEmbeddedUrl = async (episodeId) => {
    try {
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
      if (embeddedServers && embeddedServers.length > 0) {
        const gogoServer = embeddedServers.find(
          (server) => server.name === 'Gogo server',
        );
        const selectedServer = gogoServer || embeddedServers[0];
        setEmbeddedVideoUrl(selectedServer.url);
      }
    } catch (error) {
      console.error(
        'Error fetching embedded servers for episode ID:',
        episodeId,
        error,
      );
    }
  };

  const fetchEpisodeList = useCallback(async () => {
    if (!animeId) return;

    const apiMethod =
      sourceType === 'gogoanime' ? fetchAnimeEpisodes : fetchAnimeEmbeddedEpisodes;
    const episodes = await apiMethod(animeId, language);

    if (episodes.length > 0) {
      setEpisodes(episodes);
      const foundEpisode = episodes.find(
        (ep) => ep.number === parseInt(episodeNumber, 10),
      );
      const initialEpisode = foundEpisode || episodes[0];
      setCurrentEpisode(initialEpisode);
      setSelectedBackgroundImage(initialEpisode.image);
      setShowNoEpisodesMessage(false);
    } else {
      setShowNoEpisodesMessage(true);
    }
    setLoading(false);
  }, [animeId, episodeNumber, language, sourceType]);

  const fetchAnimeInfoData = useCallback(async () => {
    if (!animeId) return;

    const animeInfoData = await fetchAnimeDetails(animeId);
    setAnimeInfo(animeInfoData);

    if (animeInfoData.episodes.length > 0) {
      setEpisodes(animeInfoData.episodes);
      const foundEpisode = animeInfoData.episodes.find(
        (ep) => ep.number === parseInt(episodeNumber, 10),
      );
      const initialEpisode = foundEpisode || animeInfoData.episodes[0];
      setCurrentEpisode(initialEpisode);
      setSelectedBackgroundImage(initialEpisode.image);
      setShowNoEpisodesMessage(false);
    } else {
      setShowNoEpisodesMessage(true);
    }
    setLoading(false);
  }, [animeId, episodeNumber]);

  useEffect(() => {
    const handleResize = () => {
      if (videoPlayerContainerRef.current) {
        const { width } = videoPlayerContainerRef.current.getBoundingClientRect();
        setMaxEpisodeListHeight(`calc(100vh - ${width}px - 20px)`);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const savedSourceType = localStorage.getItem(getSourceTypeKey(animeId));
    const savedLanguage = localStorage.getItem(getLanguageKey(animeId));

    if (savedSourceType) {
      setSourceType(savedSourceType);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    fetchEpisodeList();
    fetchAnimeInfoData();
    updateVideoPlayerWidth();

    window.addEventListener('resize', updateVideoPlayerWidth);

    return () => {
      window.removeEventListener('resize', updateVideoPlayerWidth);
    };
  }, [animeId, episodeNumber, fetchEpisodeList, fetchAnimeInfoData, updateVideoPlayerWidth]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const now = Date.now();
      if (now - lastKeypressTime < 1000) {
        return; // Ignore key presses that occur within 1 second of the previous one
      }
      setLastKeypressTime(now);

      if (event.key === 'ArrowLeft') {
        const prevEpisodeIndex = currentEpisodeIndex - 1;
        if (prevEpisodeIndex >= 0) {
          setCurrentEpisode(episodes[prevEpisodeIndex]);
          navigate(
            `/watch/${animeId}/${animeTitle}/${episodes[prevEpisodeIndex].number}`,
          );
        }
      } else if (event.key === 'ArrowRight') {
        const nextEpisodeIndex = currentEpisodeIndex + 1;
        if (nextEpisodeIndex < episodes.length) {
          setCurrentEpisode(episodes[nextEpisodeIndex]);
          navigate(
            `/watch/${animeId}/${animeTitle}/${episodes[nextEpisodeIndex].number}`,
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentEpisodeIndex, episodes, animeId, animeTitle, navigate, lastKeypressTime]);

  useEffect(() => {
    if (sourceType === 'vidstreaming') {
      fetchVidstreamingUrl(currentEpisode.id);
    } else if (sourceType === 'gogoanime') {
      fetchEmbeddedUrl(currentEpisode.id);
    }
  }, [currentEpisode.id, sourceType]);

  const handleSourceTypeChange = useCallback(
    (event) => {
      const selectedSourceType = event.target.value;
      setSourceType(selectedSourceType);
      localStorage.setItem(getSourceTypeKey(animeId), selectedSourceType);
      setLanguageChanged(true);
    },
    [animeId],
  );

  const handleLanguageChange = useCallback(
    (event) => {
      const selectedLanguage = event.target.value;
      setLanguage(selectedLanguage);
      localStorage.setItem(getLanguageKey(animeId), selectedLanguage);
      setLanguageChanged(true);
    },
    [animeId],
  );

  const getPlayerContent = () => {
    if (sourceType === 'gogoanime') {
      return (
        <EmbedPlayer
          src={embeddedVideoUrl}
          animeTitle={animeTitle}
          episodeNumber={episodeNumber}
        />
      );
    }

    return (
      <Player
        episodeId={currentEpisode.id}
        animeId={animeId}
        title={animeTitle}
        episodeNumber={episodeNumber}
      />
    );
  };

  return (
    <WatchContainer>
      <WatchWrapper>
        {loading && ''}
        {!loading && (
          <>
            {showNoEpisodesMessage ? (
              <NoEpsFoundDiv>
                <NoEpsImage>
                  <img src={Image404URL} alt="404 - Not Found" />
                </NoEpsImage>
                <GoToHomePageButton />
              </NoEpsFoundDiv>
            ) : (
              <>
                <EpisodeListContainer>
                  <EpisodeList
                    episodes={episodes}
                    currentEpisode={currentEpisode}
                    onEpisodeClick={setCurrentEpisode}
                    maxHeight={maxEpisodeListHeight}
                  />
                </EpisodeListContainer>
                <SourceAndData $videoPlayerWidth={videoPlayerWidth}>
                  <VideoPlayerContainer ref={videoPlayerContainerRef}>
                    {getPlayerContent()}
                  </VideoPlayerContainer>
                  <DataWrapper>
                    <AnimeDataList
                      animeId={animeId}
                      animeTitle={animeTitle}
                      selectedBackgroundImage={selectedBackgroundImage}
                      animeInfo={animeInfo}
                      sourceType={sourceType}
                      language={language}
                      handleSourceTypeChange={handleSourceTypeChange}
                      handleLanguageChange={handleLanguageChange}
                      countdown={countdown}
                      nextEpisodenumber={nextEpisodenumber}
                      currentEpisode={currentEpisode}
                      downloadLink={downloadLink}
                      setDownloadLink={setDownloadLink}
                    />
                  </DataWrapper>
                  {animeInfo && (
                    <RalationsTable>
                      <WatchAnimeData
                        title="Relations"
                        animeInfo={animeInfo}
                        animeId={animeId}
                        currentEpisode={currentEpisode}
                        sourceType={sourceType}
                        language={language}
                        setSelectedBackgroundImage={setSelectedBackgroundImage}
                      />
                    </RalationsTable>
                  )}
                </SourceAndData>
              </>
            )}
          </>
        )}
      </WatchWrapper>
    </WatchContainer>
  );
};

export default Watch;
