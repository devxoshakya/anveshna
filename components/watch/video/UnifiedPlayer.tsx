"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TbPlayerTrackPrev, TbPlayerTrackNext } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { RiCheckboxBlankFill } from "react-icons/ri";
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

const MEGAPLAY_EMBED_BASE = "https://megaplay.buzz/stream/ani";
const noop = () => {};

function buildMegaPlayEmbedUrl(
  anilistId?: string | number,
  episodeNumber?: string | number,
  language: string = "sub",
) {
  if (!anilistId || !episodeNumber) return "";

  const normalizedLanguage = language.toLowerCase() === "dub" ? "dub" : "sub";

  return `${MEGAPLAY_EMBED_BASE}/${encodeURIComponent(String(anilistId))}/${encodeURIComponent(String(episodeNumber))}/${normalizedLanguage}`;
}

type UnifiedPlayerProps = {
  episodeId: string;
  anilistId?: string | number;
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
};

export function UnifiedPlayer(props: UnifiedPlayerProps) {
  const {
    anilistId,
    updateDownloadLink = noop,
    onEpisodeEnd,
    onPrevEpisode,
    onNextEpisode,
    episodeNumber,
    animeTitle,
    language = "sub",
  } = props;

  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const iframeSrc = useMemo(
    () => buildMegaPlayEmbedUrl(anilistId, episodeNumber, language),
    [anilistId, episodeNumber, language],
  );

  useEffect(() => {
    setShowLoader(true);
  }, [iframeSrc]);

  useEffect(() => {
    updateDownloadLink(iframeSrc);
  }, [iframeSrc, updateDownloadLink]);

  const toggleAutoPlay = () => setAutoPlay(!autoPlay);
  const toggleAutoNext = () => setAutoNext(!autoNext);

  return (
    <>
      <PlayerContainer>
        <IframeContainer>
          {showLoader && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <CustomLoader />
            </div>
          )}
          {iframeSrc ? (
            <iframe
              src={iframeSrc}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              onLoad={() => setShowLoader(false)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-card text-sm text-muted-foreground">
              No stream available for this episode.
            </div>
          )}
        </IframeContainer>
      </PlayerContainer>

      <div
        id="player-menu"
        className="flex items-center md:gap-2 px-1 md:px-2 overflow-x-auto rounded bg-accent no-scrollbar mt-2"
      >
        <Button onClick={toggleAutoPlay} className="flex gap-1">
          {autoPlay ? <FaCheck className="mt-0.5" /> : <RiCheckboxBlankFill className="mt-0.5" />}
          Autoplay
        </Button>
        
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