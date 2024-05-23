import { useEffect, useRef, useState } from 'react';
import './player.css';
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
} from '@vidstack/react';
import styled from 'styled-components';
// import { fetchAnimeStreamingLinks } from '../../../index';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa6';
import { RiCheckboxBlankFill } from 'react-icons/ri';

const Button = styled.button`
  padding: 0.25rem;
  font-size: 0.8rem;
  border: none;
  margin-right: 0.25rem;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: black;
  color: ;
  svg {
    margin-bottom: -0.1rem;
    color: grey;
  }
  @media (max-width: 500px) {
    font-size: 0.7rem;
  }

  &.active {
    background-color: var(--primary-accent);
  }
`;

const Player = ({
  episodeId,
  banner,
  malId,
  updateDownloadLink,
  onEpisodeEnd,
  onPrevEpisode,
  onNextEpisode,
  animeTitle,
}) => {
  const player = useRef(null);
  const [src, setSrc] = useState('');
  // const [vttUrl, setVttUrl] = useState('');
  const elementRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  // const [skipTimes, setSkipTimes] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  // const [vttGenerated, setVttGenerated] = useState(false);

  const episodeNumber = getEpisodeNumber(episodeId);
  const animeVideoTitle = animeTitle;

  const handleTouchStart = (event) => {
    // Handle touchstart event
    console.log('Touch started!');
  };

  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('autoPlay') === 'true';
    const savedAutoNext = localStorage.getItem('autoNext') === 'true';
    const savedAutoSkip = localStorage.getItem('autoSkip') === 'true';

    setAutoPlay(savedAutoPlay);
    setAutoNext(savedAutoNext);
    setAutoSkip(savedAutoSkip);

    const allPlaybackInfo = JSON.parse(
      localStorage.getItem('all_episode_times') || '{}',
    );
    if (allPlaybackInfo[episodeId]) {
      const { currentTime } = allPlaybackInfo[episodeId];
      setCurrentTime(parseFloat(currentTime));
    }

    // fetchAndSetAnimeSource();
    // fetchAndProcessSkipTimes();
    return () => {
      // if (vttUrl) {
      //   URL.revokeObjectURL(vttUrl);
      // }
    };
  }, [episodeId, malId, updateDownloadLink]);

  const resumeAudioContext = () => {
    if (player.current) {
      const audioContext = player.current.audioContext;
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      resumeAudioContext();
      if (autoPlay && player.current) {
        player.current.play().catch((e) => console.log('Playback failed to start automatically:', e));
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
  
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [autoPlay, src]);
  


  useEffect(() => {
    if (player.current && currentTime) {
      player.current.currentTime = currentTime;
    }
  }, [currentTime]);

  function onProviderChange(provider, _nativeEvent) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  function onLoadedMetadata() {
    if (player.current) {
      setTotalDuration(player.current.duration);
    }
  }

  function onTimeUpdate() {
    if (player.current) {
      const currentTime = player.current.currentTime;
      const duration = player.current.duration || 1;
      const playbackPercentage = (currentTime / duration) * 100;
      const playbackInfo = {
        currentTime,
        playbackPercentage,
      };
      const allPlaybackInfo = JSON.parse(
        localStorage.getItem('all_episode_times') || '{}',
      );
      allPlaybackInfo[episodeId] = playbackInfo;
      localStorage.setItem(
        'all_episode_times',
        JSON.stringify(allPlaybackInfo),
      );
      setCurrentTime(currentTime);
    }
  }

  function addPassiveEventListener(element, event, callback, options = {}) {
    const passiveOptions = { ...options, passive: true };
    element.addEventListener(event, callback, passiveOptions);
  }


  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      addPassiveEventListener(element, 'touchstart', handleTouchStart, { capture: true });
    }
  }, []);
  


//   async function fetchAndSetAnimeSource() {
//     try {
//       const response = await fetchAnimeStreamingLinks(episodeId);
//             const backupSource = response.sources.find(
//                 (source) => source.quality === 'default',
//               );
//               if (backupSource) {
//                 setSrc(backupSource.url);
//                 updateDownloadLink(response.download);
//               } else {
//                 console.error('Backup source not found');
//               }
//             } catch (error) {
//               console.error('Failed to fetch anime streaming links', error);
//             }
//           }
        
          // function formatTime(seconds) {
          //   const minutes = Math.floor(seconds / 60);
          //   const remainingSeconds = Math.floor(seconds % 60);
          //   return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
          // }
        
          function getEpisodeNumber(id) {
            const parts = id.split('-');
            return parts[parts.length - 1];
          }
        
          const toggleAutoPlay = () => {
            setAutoPlay(!autoPlay);
            localStorage.setItem('autoPlay', (!autoPlay).toString());
          };
        
          const toggleAutoNext = () => {
            setAutoNext(!autoNext);
            localStorage.setItem('autoNext', (!autoNext).toString());
          };
        
          // const toggleAutoSkip = () => {
          //   setAutoSkip(!autoSkip);
          //   localStorage.setItem('autoSkip', (!autoSkip).toString());
          // };
        
          const handlePlaybackEnded = async () => {
            if (!autoNext) return;
        
            try {
              player.current?.pause();
        
              await new Promise((resolve) => setTimeout(resolve, 200)); // Delay for transition
              await onEpisodeEnd();
            } catch (error) {
              console.error('Error moving to the next episode:', error);
            }
          };
        
          return (
            <div style={{ animation: 'popInAnimation 0.25s ease-in-out' }} ref={elementRef}>
              <MediaPlayer
                className='player'
                title={`${animeVideoTitle} - Episode ${episodeNumber}`}
                src='https://www117.vipanicdn.net/streamhls/14a369cc45ca9c73d70872708160af7d/ep.1.1709210525.m3u8'
                autoPlay={autoPlay}
                crossOrigin
                playsInline
                muted
                onLoadedMetadata={onLoadedMetadata}
                onProviderChange={onProviderChange}
                onTimeUpdate={onTimeUpdate}
                ref={player}
                aspectRatio='16/9'
                load='eager'
                posterLoad='eager'
                streamType='on-demand'
                storage='storage-key'
                keyTarget='player'
                onEnded={handlePlaybackEnded}
              >
                <MediaProvider>
                  <Poster className='vds-poster object-cover' src='https://s4.anilist.co/file/anilistcdn/media/anime/banner/153288-JNsWuMPMAuJL.jpg' alt='' />
                </MediaProvider>
                <DefaultAudioLayout icons={defaultLayoutIcons} />
                <DefaultVideoLayout icons={defaultLayoutIcons} />
              </MediaPlayer>
              <div
                className='player-menu flex m-0 '
                style={{
                  borderRadius: '50px',
                }}
              >
                <Button className='flex gap-1 mb-1' onClick={toggleAutoPlay}>
                  {autoPlay ? <FaCheck className='mt-[2px]'/> : <RiCheckboxBlankFill className='mt-[2px]' />} Autoplay
                </Button>
                {/* <Button className='flex gap-1' $autoskip onClick={toggleAutoSkip}>
                  {autoSkip ? <FaCheck className='mt-[2px]'/> : <RiCheckboxBlankFill className='mt-[2px]' />} Auto Skip
                </Button> */}
                <Button className='flex mb-1 gap-1' onClick={onPrevEpisode}>
                  <TbPlayerTrackPrevFilled className='mt-[2px]'/> Prev
                </Button>
                <Button className='flex mb-1 gap-1 ' onClick={onNextEpisode}>
                  <TbPlayerTrackNextFilled className='mt-[2px]' /> Next
                </Button>
                <Button className='flex mb-1 gap-1' onClick={toggleAutoNext}>
                  {autoNext ? <FaCheck className='mt-[2px]'/> : <RiCheckboxBlankFill className='mt-[2px]' />} Auto Next
                </Button>
              </div>
            </div>
          );
        };
        
export default Player;
        
