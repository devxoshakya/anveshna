import React, { useEffect, useRef, useState } from 'react';
import './player.css';
import Hls from 'hls.js';
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
} from '@vidstack/react';
import styled from 'styled-components';
import { fetchSkipTimes, fetchAnimeStreamingLinks } from '../../../hooks/useAPI';
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
  color: var(--global-text);
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
  ${({ $autoskip }) =>
    $autoskip &&
    `
    color: #d69e00; 
    svg {
      color: #d69e00; 
    }
  `}
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
  const [vttUrl, setVttUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  const [skipTimes, setSkipTimes] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [vttGenerated, setVttGenerated] = useState(false);

  const episodeNumber = getEpisodeNumber(episodeId);
  const animeVideoTitle = animeTitle;

  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('autoPlay') === 'true';
    const savedAutoNext = localStorage.getItem('autoNext') === 'true';
    const savedAutoSkip = localStorage.getItem('autoSkip') === 'true';

    setAutoPlay(savedAutoPlay);
    setAutoNext(savedAutoNext);
    setAutoSkip(savedAutoSkip);

    const allPlaybackInfo = JSON.parse(localStorage.getItem('all_episode_times') || '{}');
    if (allPlaybackInfo[episodeId]) {
      const { currentTime } = allPlaybackInfo[episodeId];
      setCurrentTime(parseFloat(currentTime));
    }

    fetchAndSetAnimeSource();
    fetchAndProcessSkipTimes();
    return () => {
      if (vttUrl) {
        URL.revokeObjectURL(vttUrl);
      }
    };
  }, [episodeId, malId, updateDownloadLink, vttUrl]);

  useEffect(() => {
    if (autoPlay && player.current) {
      player.current
        .play()
        .catch((e) => console.log('Playback failed to start automatically:', e));
    }
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
      const allPlaybackInfo = JSON.parse(localStorage.getItem('all_episode_times') || '{}');
      allPlaybackInfo[episodeId] = playbackInfo;
      localStorage.setItem('all_episode_times', JSON.stringify(allPlaybackInfo));

      if (autoSkip && skipTimes.length) {
        const skipInterval = skipTimes.find(
          ({ interval }) =>
            currentTime >= interval.startTime && currentTime < interval.endTime,
        );
        if (skipInterval) {
          player.current.currentTime = skipInterval.interval.endTime;
        }
      }
    }
  }

  function onError(event) {
    const { type, details, error } = event;
    console.error('Error type:', type);
    console.error('Error details:', details);
    console.error('Error message:', error.message);

    if (type === Hls.ErrorTypes.MEDIA_ERROR) {
      console.log('Media error encountered, attempting to recover...');
      if (player.current) {
        const hls = player.current.hls;
        if (details === Hls.ErrorDetails.BUFFER_STALLED_ERROR || details === Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL) {
          console.log('Buffer stalled error: trying to recover...');
          player.current.currentTime += 0.1; // Nudge the buffer by 100ms
        } else if (details === Hls.ErrorDetails.BUFFER_SEEK_OVER_HOLE) {
          console.log('Seek over hole: attempting to recover...');
          player.current.currentTime += 1; // Seek forward to bypass the gap
        } else {
          console.warn('Unhandled media error, attempting recovery...');
          hls.recoverMediaError();
        }
      }
    }
  }

  function generateWebVTTFromSkipTimes(skipTimes, totalDuration) {
    let vttString = 'WEBVTT\n\n';
    let previousEndTime = 0;

    const sortedSkipTimes = skipTimes.results.sort(
      (a, b) => a.interval.startTime - b.interval.startTime,
    );

    sortedSkipTimes.forEach((skipTime, index) => {
      const { startTime, endTime } = skipTime.interval;
      const skipType =
        skipTime.skipType.toUpperCase() === 'OP' ? 'Opening' : 'Outro';

      if (previousEndTime < startTime) {
        vttString += `${formatTime(previousEndTime)} --> ${formatTime(startTime)}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }

      vttString += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
      vttString += `${skipType}\n\n`;
      previousEndTime = endTime;

      if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
        vttString += `${formatTime(endTime)} --> ${formatTime(totalDuration)}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }
    });

    return vttString;
  }

  async function fetchAndProcessSkipTimes() {
    if (malId && episodeId) {
      const episodeNumber = getEpisodeNumber(episodeId);
      try {
        const response = await fetchSkipTimes({
          malId: malId.toString(),
          episodeNumber,
        });
        const filteredSkipTimes = response.results.filter(
          ({ skipType }) => skipType === 'op' || skipType === 'ed',
        );
        if (!vttGenerated) {
          const vttContent = generateWebVTTFromSkipTimes(
            { results: filteredSkipTimes },
            totalDuration,
          );
          const blob = new Blob([vttContent], { type: 'text/vtt' });
          const vttBlobUrl = URL.createObjectURL(blob);
          setVttUrl(vttBlobUrl);
          setSkipTimes(filteredSkipTimes);
          setVttGenerated(true);
        }
      } catch (error) {
        console.error('Failed to fetch skip times', error);
      }
    }
  }

  async function fetchAndSetAnimeSource() {
    try {
      const response = await fetchAnimeStreamingLinks(episodeId);

      // Check if the main source is available
      const mainSource = response.main;
      if (mainSource) {
        setSrc(mainSource);
        updateDownloadLink(mainSource.download);
      } else {
        // Fall back to the backup source
        const backupSource = response.backup;
        if (backupSource) {
          setSrc(backupSource);
          updateDownloadLink(backupSource.download);
        } else {
          console.error('No streaming source found');
        }
      }
    } catch (error) {
      console.error('Failed to fetch anime streaming links', error);
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function getEpisodeNumber(id) {
    const parts = id.split('-');
    return parts[parts.length - 1];
  }

  const toggleAutoNext = () => {
    setAutoNext(!autoNext);
    localStorage.setItem('autoNext', (!autoNext).toString());
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    localStorage.setItem('autoPlay', (!autoPlay).toString());
  };

  const toggleAutoSkip = () => {
    setAutoSkip(!autoSkip);
    localStorage.setItem('autoSkip', (!autoSkip).toString());
  };

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
    <div style={{ animation: 'popInAnimation 0.25s ease-in-out' }}>
      <MediaPlayer
        className='player'
        title={`${animeVideoTitle} - Episode ${episodeNumber}`}
        src={{ src: src, type: 'application/x-mpegurl' }}
        crossOrigin
        playsInline
        autoPlay={autoPlay}
        onLoadedMetadata={onLoadedMetadata}
        onProviderChange={onProviderChange}
        onTimeUpdate={onTimeUpdate}
        onError={onError} // Add the onError handler here
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
          <Poster className='vds-poster' src={banner} alt='' />
          {vttUrl && (
            <Track kind='chapters' src={vttUrl} default label='Skip Times' />
          )}
        </MediaProvider>
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
      <div
        className='player-menu flex'
        style={{
          backgroundColor: 'var(--global-div-tr)',
          borderRadius: 'var(--global-border-radius)',
        }}
      >
        <Button className='flex gap-1'  onClick={toggleAutoPlay}>
          {autoPlay ? <FaCheck className='mt-[2px]' /> : <RiCheckboxBlankFill className='mt-[2px]' />} Auto Play
        </Button>
        <Button className='flex gap-1' $autoskip onClick={toggleAutoSkip}>
          {autoSkip ? <FaCheck className='mt-[2px]' /> : <RiCheckboxBlankFill className='mt-[2px]' />} Auto Skip
        </Button>
        <Button className='flex gap-1' onClick={onPrevEpisode}>
          <TbPlayerTrackPrevFilled className='mt-[2px]' /> Prev
        </Button>
        <Button className='flex gap-1' onClick={onNextEpisode}>
          <TbPlayerTrackNextFilled className='mt-[2px]' /> Next
        </Button>
        <Button className='flex gap-1' onClick={toggleAutoNext}>
          {autoNext ? <FaCheck className='mt-[2px]' /> : <RiCheckboxBlankFill className='mt-[2px]' />} Auto Next
        </Button>
      </div>
    </div>
  );
};

export default Player;
