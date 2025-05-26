import { useEffect, useRef, useState } from "react";
import "./PlayerStyles.css";
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  type MediaPlayerInstance,
  useMediaState,
} from "@vidstack/react";
import styled from "styled-components";
import { fetchAnimeStreamingLinks } from "@/hooks/useApi";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { TbPlayerTrackPrev, TbPlayerTrackNext } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { CustomLoader } from "./Loader";

const Button = styled.button<{ $autoskip?: boolean }>`
  padding: 0.25rem;
  font-size: 0.8rem;
  border: none;
  margin-right: 0.25rem;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
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

type PlayerProps = {
  episodeId: string;
  banner?: string;
  malId?: string;
  episodeNumber?: string;
  updateDownloadLink: (link: string) => void;
  onEpisodeEnd: () => Promise<void>;
  onPrevEpisode: () => void;
  onNextEpisode: () => void;
  animeTitle?: string;
  serverName?: string;
  language?: string;
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

export function Player({
  episodeId,
  banner,
  malId,
  updateDownloadLink,
  onEpisodeEnd,
  onPrevEpisode,
  onNextEpisode,
  episodeNumber,
  animeTitle,
  serverName = "vidcloud",
  language = "sub",
}: PlayerProps) {
  const player = useRef<MediaPlayerInstance>(null);
   const waiting = useMediaState('waiting',player);
  const canPlay = useMediaState('canPlay',player);
  const seeking = useMediaState('seeking',player);
  const [src, setSrc] = useState<string>("");
  const [subtitles, setSubtitles] = useState<any>([]);
  const [vttUrl, setVttUrl] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [skipTimes, setSkipTimes] = useState<SkipTime[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [vttGenerated, setVttGenerated] = useState<boolean>(false);
  const animeVideoTitle = animeTitle;

  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [autoSkip, setAutoSkip] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);

  useEffect(() => {
    setCurrentTime(parseFloat(localStorage.getItem("currentTime") || "0"));

    // Reset VTT generation flag for new episode
    setVttGenerated(false);
    
    // Main fetch - handles sources, subtitles, AND intro/outro data
    fetchAndSetAnimeSource();
    
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl);
    };
  }, [episodeId, malId, updateDownloadLink, serverName, language]);

  useEffect(() => {
    if (autoPlay && player.current) {
      player.current
        .play()
        .catch((e: Error) =>
          console.log("Playback failed to start automatically:", e)
        );
    }
  }, [autoPlay, src]);

  useEffect(() => {
    if (player.current && currentTime) {
      player.current.currentTime = currentTime;
    }
  }, [currentTime]);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    _nativeEvent: MediaProviderChangeEvent
  ) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // Also modify onLoadedMetadata to regenerate VTT with correct duration
  function onLoadedMetadata() {
    if (player.current) {
      const duration = player.current.duration;
      setTotalDuration(duration);
      
      // Regenerate VTT with correct duration if we have skip times but VTT was generated with estimated duration
      if (skipTimes.length > 0 && vttUrl) {
        const vttContent = generateWebVTTFromSkipTimes(
          skipTimes,
          duration
        );
        const blob = new Blob([vttContent], { type: "text/vtt" });
        
        // Revoke old URL and create new one
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

      // Insert default title chapter before this skip time if there's a gap
      if (previousEndTime < startTime) {
        vttString += `${formatTime(previousEndTime)} --> ${formatTime(
          startTime
        )}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }

      // Insert this skip time
      vttString += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
      vttString += `${skipType}\n\n`;
      previousEndTime = endTime;

      // Insert default title chapter after the last skip time
      if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
        vttString += `${formatTime(endTime)} --> ${formatTime(
          totalDuration
        )}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }
    });

    return vttString;
  }

  // Add this helper function to convert intro/outro to SkipTime format
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

  // Modified fetchAndSetAnimeSource function
  async function fetchAndSetAnimeSource() {
    try {
      // Transform episode ID for language switching
      let modifiedEpisodeId = episodeId;
      
      if (language === "dub") {
        // Change $sub to $dub for dub language
        modifiedEpisodeId = episodeId.replace(/\$sub$/, "$dub");
      } else {
        // Ensure $sub suffix for sub language
        if (!episodeId.endsWith("$sub")) {
          modifiedEpisodeId = episodeId.replace(/\$dub$/, "$sub");
        }
      }

      console.log(`Fetching streaming links for episode: ${modifiedEpisodeId}, server: ${serverName}`);
      
      const response = await fetchAnimeStreamingLinks(modifiedEpisodeId, serverName);
      if (!response || !response.sources || response.sources.length === 0) {
        console.error("No streaming sources found for this episode");
        return;
      }

      // Handle streaming sources
      const sources: StreamingSource[] = response.sources.map(
        (source: any) => ({
          url: source.url,
        })
      );
      if (sources.length > 0) {
        setSrc(sources[0].url);
        updateDownloadLink(sources[0].url);
      } else {
        console.error("No valid streaming sources found");
      }

      // Handle subtitles
      const subtitles = response.subtitles || [];
      if (subtitles.length > 0) {
        setSubtitles(subtitles);
      }

      // Handle intro/outro data from the same response
      if (response.intro || response.outro) {
        console.log("Processing intro/outro data from API response:", {
          intro: response.intro,
          outro: response.outro
        });
        
        const convertedSkipTimes = convertIntroOutroToSkipTimes(response.intro, response.outro);
        setSkipTimes(convertedSkipTimes);
        
        // Generate VTT for chapters if we have skip times and total duration
        if (convertedSkipTimes.length > 0) {
          // We'll generate VTT once we have totalDuration (in onLoadedMetadata)
          // or use a reasonable fallback
          const estimatedDuration = totalDuration || 1440; // 24 minutes default
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

    } catch (error) {
      console.error("Failed to fetch anime streaming links", error);
    }
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  function getEpisodeNumber(id: string): string {
    const parts = id.split("-");
    return parts[parts.length - 1];
  }

  const toggleAutoPlay = () => setAutoPlay(!autoPlay);
  const toggleAutoNext = () => setAutoNext(!autoNext);
  const toggleAutoSkip = () => setAutoSkip(!autoSkip);

  const handlePlaybackEnded = async () => {
    if (!autoNext) return;

    try {
      player.current?.pause();

      await new Promise((resolve) => setTimeout(resolve, 200)); // Delay for transition
      await onEpisodeEnd();
    } catch (error) {
      console.error("Error moving to the next episode:", error);
    }
  };

  const thumbnailSubtitle = subtitles.find(
    (subtitle: any) => subtitle.lang === "thumbnails"
  );

  useEffect(() => {
    if(canPlay) {
      // If the player is ready to play, we can set the current time}
      console.log("Player is ready to play", { canPlay, seeking, waiting });  
      setShowLoader(false);
    }else if (seeking || waiting) {
      setShowLoader(true);
    } else {
      // If the player is not ready, we show the loader
      console.log("Player is not ready to play", { canPlay, seeking, waiting });
      setShowLoader(true);
    }
  },[canPlay, seeking, waiting]);

  return (
    <>
       <div style={{ animation: "popIn 0.25s ease-in-out" }} className="relative">
        <MediaPlayer
          className="player"
          title={`${animeVideoTitle} - Episode ${episodeNumber}`}
          src={`https://hls-proxy-m3u8.vercel.app/m3u8-proxy?url=${encodeURIComponent(src)}`}
          autoPlay={autoPlay}
          crossOrigin
          playsInline
          onLoadedMetadata={onLoadedMetadata}
          onProviderChange={onProviderChange}
          onTimeUpdate={onTimeUpdate}
          ref={player}
          aspectRatio="16/9"
          load="eager"
          posterLoad="eager"
          streamType="on-demand"
          storage="storage-key"
          keyTarget="player"
          onEnded={handlePlaybackEnded}
        >
          <MediaProvider>
            <Poster className="vds-poster" src={banner} alt="" />
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
                  src={subtitle.url}
                  label={subtitle.lang}
                  {...(subtitle.lang === "English" ? { default: true } : {})}
                />
              ))}
          </MediaProvider>
          
          {/* Custom Loading Overlay */}
          {showLoader && <CustomLoader />}
          
          <DefaultAudioLayout icons={defaultLayoutIcons} />
          <DefaultVideoLayout
            thumbnails={`https://hls.pacalabs.top/proxy?url=${encodeURIComponent(
              thumbnailSubtitle?.url
            )}`}
            icons={defaultLayoutIcons}
          />
        </MediaPlayer>
      </div>
      
      <div
        id="player-menu"
        className="flex items-center md:gap-2 px-1 md:px-2 overflow-x-auto rounded bg-accent no-scrollbar"
      >
        <Button onClick={toggleAutoPlay} className="flex gap-1">
          {autoPlay ? (
            <FaCheck className="mt-[2px]" />
          ) : (
            <RiCheckboxBlankFill className="mt-[2px]" />
          )}{" "}
          Autoplay
        </Button>
        <Button $autoskip onClick={toggleAutoSkip} className="flex gap-1">
          {autoSkip ? (
            <FaCheck className="mt-[2px]" />
          ) : (
            <RiCheckboxBlankFill className="mt-[2px]" />
          )}{" "}
          Auto Skip
        </Button>
        <Button className="flex gap-1" onClick={onPrevEpisode}>
          <TbPlayerTrackPrev className="mt-[2px]" /> Prev
        </Button>
        <Button onClick={onNextEpisode} className="flex gap-1">
          <TbPlayerTrackNext className="mt-[2px]" /> Next
        </Button>
        <Button onClick={onEpisodeEnd} className="flex gap-1">
          {autoNext ? (
            <FaCheck className="mt-[2px]" />
          ) : (
            <RiCheckboxBlankFill className="mt-[2px]" />
          )}{" "}
          Auto Next
        </Button>
      </div>
    </>
  );
}
