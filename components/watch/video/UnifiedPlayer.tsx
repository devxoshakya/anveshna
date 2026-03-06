"use client";

import { useEffect, useRef, useState } from "react";
import "./PlayerStyles.css";
import {
  MediaPlayer,
  MediaProvider,
  Track,
  type MediaPlayerInstance,
  useMediaStore,
} from "@vidstack/react";
import styled from "styled-components";
import { fetchAnimeStreamingLinks, MEDIA_PROXY_URL } from "@/hooks/useApi";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { TbPlayerTrackPrev, TbPlayerTrackNext } from "react-icons/tb";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { MdSwapHoriz } from "react-icons/md";
import { CustomLoader } from "./Loader";

const Button = styled.button<{ $autoskip?: boolean; $active?: boolean }>`
  padding: 0.25rem;
  font-size: 0.8rem;
  border: none;
  margin-right: 0.25rem;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
  color: var(--global-text);
  transition: all 0.2s ease;
  
  svg {
    margin-bottom: -0.1rem;
    color: grey;
  }
  
  @media (max-width: 500px) {
    font-size: 0.7rem;
  }

  ${({ $active }) =>
    $active &&
    `
    background-color: var(--primary-accent);
    color: white;
    svg {
      color: white;
    }
  `}

  ${({ $autoskip }) =>
    $autoskip &&
    `
    color: #d69e00; 
    svg {
      color: #d69e00; 
    }
  `}

  &:hover {
    opacity: 0.8;
  }
`;

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  animation: popIn 0.25s ease-in-out;
`;

const IframeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
  }
`;

type PlayerMode = 'advanced' | 'iframe';

type UnifiedPlayerProps = {
  episodeId: string;
  category?: string;
  banner?: string;
  malId?: string;
  episodeNumber?: string;
  updateDownloadLink?: (link: string) => void;
  onEpisodeEnd: () => Promise<void>;
  onPrevEpisode: () => void;
  onNextEpisode: () => void;
  animeTitle?: string;
  serverName?: string;
  language?: string;
  defaultMode?: PlayerMode;
};

type StreamingSource = {
  url: string;
  quality: string;
};

type SkipTime = {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: string;
};

export function UnifiedPlayer({
  episodeId,
  category = "sub",
  banner,
  malId,
  updateDownloadLink = () => {},
  onEpisodeEnd,
  onPrevEpisode,
  onNextEpisode,
  episodeNumber,
  animeTitle,
  serverName = "vidcloud",
  language = "sub",
  defaultMode = "advanced",
}: UnifiedPlayerProps) {
  const player = useRef<MediaPlayerInstance>(null);
  const [waiting, setWaiting] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [seeking, setSeeking] = useState(false);
  
  // Player state
  const [playerMode, setPlayerMode] = useState<PlayerMode>("advanced"); 
  const [src, setSrc] = useState<string>("");
  const [subtitles, setSubtitles] = useState<any>([]);
  const [vttUrl, setVttUrl] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [skipTimes, setSkipTimes] = useState<SkipTime[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [vttGenerated, setVttGenerated] = useState<boolean>(false);
  const [hasValidHLSLink, setHasValidHLSLink] = useState<boolean>(false);
  
  // Player controls
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [autoSkip, setAutoSkip] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);

  const animeVideoTitle = animeTitle;

  useEffect(() => {
    setCurrentTime(parseFloat(localStorage.getItem("currentTime") || "0"));
    setVttGenerated(false);
    setHasValidHLSLink(false);
    
    // Always try to fetch data first to determine player mode
    fetchAndSetAnimeSource();
    
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl);
    };
  }, [episodeId, malId, updateDownloadLink, serverName, language]);

  useEffect(() => {
    if (hasValidHLSLink && autoPlay && player.current && playerMode === "advanced") {
      player.current
        .play()
        .catch((e: Error) => {
          // Silent error handling for autoplay failure
        });
    }
  }, [autoPlay, src, playerMode, hasValidHLSLink]);

  useEffect(() => {
    if (hasValidHLSLink && player.current && currentTime && playerMode === "advanced") {
      player.current.currentTime = currentTime;
    }
  }, [currentTime, playerMode, hasValidHLSLink]);

  function onLoadedMetadata() {
    if (player.current) {
      const duration = player.current.duration;
      setTotalDuration(duration);
      
      if (skipTimes.length > 0 && vttUrl) {
        const vttContent = generateWebVTTFromSkipTimes(skipTimes, duration);
        const blob = new Blob([vttContent], { type: "text/vtt" });
        
        URL.revokeObjectURL(vttUrl);
        const newVttBlobUrl = URL.createObjectURL(blob);
        setVttUrl(newVttBlobUrl);
      }
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
        localStorage.getItem("all_episode_times") || "{}"
      );
      allPlaybackInfo[episodeId] = playbackInfo;
      localStorage.setItem(
        "all_episode_times",
        JSON.stringify(allPlaybackInfo)
      );

      if (autoSkip && skipTimes.length) {
        const skipInterval = skipTimes.find(
          ({ interval }) =>
            currentTime >= interval.startTime && currentTime < interval.endTime
        );
        if (skipInterval) {
          player.current.currentTime = skipInterval.interval.endTime;
        }
      }
    }
  }

  function generateWebVTTFromSkipTimes(
    skipTimes: SkipTime[],
    totalDuration: number
  ): string {
    let vttString = "WEBVTT\n\n";
    let previousEndTime = 0;

    const sortedSkipTimes = skipTimes.sort(
      (a, b) => a.interval.startTime - b.interval.startTime
    );

    sortedSkipTimes.forEach((skipTime, index) => {
      const { startTime, endTime } = skipTime.interval;
      const skipType =
        skipTime.skipType.toUpperCase() === "OP" ? "Opening" : "Outro";

      if (previousEndTime < startTime) {
        vttString += `${formatTime(previousEndTime)} --> ${formatTime(
          startTime
        )}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }

      vttString += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
      vttString += `${skipType}\n\n`;
      previousEndTime = endTime;

      if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
        vttString += `${formatTime(endTime)} --> ${formatTime(
          totalDuration
        )}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }
    });

    return vttString;
  }

  function convertIntroOutroToSkipTimes(introData?: {start: number, end: number}, outroData?: {start: number, end: number}): SkipTime[] {
    const skipTimes: SkipTime[] = [];
    
    if (introData) {
      skipTimes.push({
        interval: {
          startTime: introData.start,
          endTime: introData.end
        },
        skipType: "op"
      });
    }
    
    if (outroData) {
      skipTimes.push({
        interval: {
          startTime: outroData.start,
          endTime: outroData.end
        },
        skipType: "ed"
      });
    }
    
    return skipTimes;
  }

  async function fetchAndSetAnimeSource() {
    try {
      // Transform episode ID for language switching (sub/dub logic)
      let modifiedEpisodeId = episodeId;
      
      if (language === "dub") {
        modifiedEpisodeId = episodeId.replace(/\$sub$/, "$dub");
      } else {
        if (!episodeId.endsWith("$sub")) {
          modifiedEpisodeId = episodeId.replace(/\$dub$/, "$sub");
        }
      }

      const response = await fetchAnimeStreamingLinks(modifiedEpisodeId, serverName, language);
      
      if (!response || !response.success || !response.data) {
        setHasValidHLSLink(false);
        setPlayerMode("iframe");
        return;
      }

      const data = response.data;
      
      // Check if we have a valid HLS link
      if (data.link && (typeof data.link === 'string' || data.link.file)) {
        const streamUrl = typeof data.link === 'string' ? data.link : data.link.file;
        
        // Validate if it's a proper HLS link
        if (streamUrl && (streamUrl.includes('.m3u8') || data.linkType === 'hls')) {
          setSrc(streamUrl);
          updateDownloadLink(streamUrl);
          setHasValidHLSLink(true);
          setPlayerMode("advanced");
          
          // Handle subtitles/tracks
          const tracks = data.tracks || [];
          if (tracks.length > 0) {
            // Filter out thumbnails and process subtitles
            const subtitleTracks = tracks.filter((track: any) => track.kind !== 'thumbnails');
            setSubtitles(subtitleTracks);
          }

          // Handle intro/outro data
          if (data.intro || data.outro) {
            const convertedSkipTimes = convertIntroOutroToSkipTimes(
              data.intro, 
              data.outro
            );
            setSkipTimes(convertedSkipTimes);
            
            if (convertedSkipTimes.length > 0) {
              const estimatedDuration = totalDuration || 1440;
              const vttContent = generateWebVTTFromSkipTimes(
                convertedSkipTimes,
                estimatedDuration
              );
              const blob = new Blob([vttContent], { type: "text/vtt" });
              const vttBlobUrl = URL.createObjectURL(blob);
              setVttUrl(vttBlobUrl);
              setVttGenerated(true);
            }
          }
        } else {
          setHasValidHLSLink(false);
          setPlayerMode("iframe");
        }
      } else {
        setHasValidHLSLink(false);
        setPlayerMode("iframe");
      }

    } catch (error) {
      setHasValidHLSLink(false);
      setPlayerMode("iframe");
    }
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Iframe player functions
  const getIframeSrc = () => {
    const parts = episodeId.split("$");
    const extractedEpId = parts.length >= 3 ? parts[2] : "";
    const domain = serverName === "vidstreaming" ? "vidwish.live" : "megaplay.buzz";
    return `https://${domain}/stream/s-2/${extractedEpId}/${language}`;
  };

  const toggleAutoPlay = () => setAutoPlay(!autoPlay);
  const toggleAutoNext = () => setAutoNext(!autoNext);
  const toggleAutoSkip = () => setAutoSkip(!autoSkip);
  
  // Manual toggle function (only allow if HLS link is available)
  const togglePlayerMode = () => {
    if (hasValidHLSLink) {
      setPlayerMode(prev => prev === "advanced" ? "iframe" : "advanced");
    }
  };

  const handlePlaybackEnded = async () => {
    if (!autoNext) return;

    try {
      if (player.current && hasValidHLSLink) {
        player.current.pause();
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
      await onEpisodeEnd();
    } catch (error) {
      // Silent error handling
    }
  };

  useEffect(() => {
    if (playerMode === "advanced" && hasValidHLSLink) {
      if (canPlay) {
        setShowLoader(false);
      } else if (seeking || waiting) {
        setShowLoader(true);
      } else {
        setShowLoader(true);
      }
    } else if (playerMode === "iframe") {
      // For iframe, we'll handle loading in the iframe onLoad events
      setShowLoader(true);
    }
  }, [canPlay, seeking, waiting, playerMode, hasValidHLSLink]);

  return (
    <>
      <PlayerContainer>
        {playerMode === "advanced" && hasValidHLSLink ? (
          <div className="relative">
            <MediaPlayer
              className="player"
              title={`${animeVideoTitle} - Episode ${episodeNumber}`}
              src={{
                src: `${MEDIA_PROXY_URL}fetch?url=${encodeURIComponent(src)}`,
                type: 'application/x-mpegurl'
              }}
              autoPlay={autoPlay}
              crossOrigin
              playsInline
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              onWaiting={() => setWaiting(true)}
              onCanPlay={() => { setCanPlay(true); setWaiting(false); }}
              onSeeking={() => setSeeking(true)}
              onSeeked={() => setSeeking(false)}
              onError={(error) => {
                console.error('Video player error:', error);
                // Fallback to iframe if HLS fails
                if (hasValidHLSLink) {
                  setHasValidHLSLink(false);
                  setPlayerMode("iframe");
                }
              }}
              ref={player}
              aspectRatio="16/9"
              load="eager"
              posterLoad="eager"
              poster={banner}
              streamType="on-demand"
              storage={`player-${episodeId}`}
              keyTarget="player"
              onEnded={handlePlaybackEnded}
            >
              <MediaProvider>
                {vttUrl && (
                  <Track
                    kind="chapters"
                    src={vttUrl}
                    default
                    label="Skip Times"
                  />
                )}

                {subtitles &&
                  subtitles.map((subtitle: any, index: number) => (
                    <Track
                      key={String(index)}
                      kind="subtitles"
                      type="vtt"
                      src={subtitle.file || subtitle.url}
                      label={subtitle.label || subtitle.lang}
                      {...(subtitle.default || subtitle.label === "English" ? { default: true } : {})}
                    />
                  ))}
              </MediaProvider>

              {showLoader && <CustomLoader />}
              
              <DefaultAudioLayout icons={defaultLayoutIcons} />
              <DefaultVideoLayout
                thumbnails={subtitles.find((s: any) => s.kind === 'thumbnails')?.file}
                icons={defaultLayoutIcons}
              />
            </MediaPlayer>
          </div>
        ) : (
          <IframeContainer>
            {showLoader && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <CustomLoader />
              </div>
            )}
            <iframe
              src={getIframeSrc()}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              onLoad={() => setShowLoader(false)}
              onLoadStart={() => setShowLoader(true)}
            />
          </IframeContainer>
        )}
      </PlayerContainer>

      <div
        id="player-menu"
        className="flex items-center md:gap-2 px-1 md:px-2 overflow-x-auto rounded bg-accent no-scrollbar mt-2"
      >
        {hasValidHLSLink && (
          <Button onClick={togglePlayerMode} $active={playerMode === "advanced"} className="flex gap-1">
            <MdSwapHoriz className="mt-0.5" />
            {playerMode === "advanced" ? "HLS" : "Iframe"}
          </Button>
        )}
        
        {!hasValidHLSLink && (
          <Button disabled className="flex gap-1 opacity-50 cursor-not-allowed">
            <FaExternalLinkAlt className="mt-0.5" />
            Iframe Only
          </Button>
        )}
        
        <Button onClick={toggleAutoPlay} className="flex gap-1">
          {autoPlay ? <FaCheck className="mt-0.5" /> : <RiCheckboxBlankFill className="mt-0.5" />}
          Autoplay
        </Button>
        
        {playerMode === "advanced" && hasValidHLSLink && (
          <Button $autoskip onClick={toggleAutoSkip} className="flex gap-1">
            {autoSkip ? <FaCheck className="mt-0.5" /> : <RiCheckboxBlankFill className="mt-0.5" />}
            Auto Skip
          </Button>
        )}
        
        <Button className="flex gap-1" onClick={onPrevEpisode}>
          <TbPlayerTrackPrev className="mt-0.5" /> Prev
        </Button>
        
        <Button onClick={onNextEpisode} className="flex gap-1">
          <TbPlayerTrackNext className="mt-0.5" /> Next
        </Button>
        
        <Button onClick={onEpisodeEnd} className="flex gap-1">
          {autoNext ? <FaCheck className="mt-0.5" /> : <RiCheckboxBlankFill className="mt-0.5" />}
          Auto Next
        </Button>
      </div>
    </>
  );
}

export default UnifiedPlayer;