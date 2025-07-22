import { useEffect, useState } from "react";
import "./PlayerStyles.css";
import styled from "styled-components";
import { TbPlayerTrackPrev, TbPlayerTrackNext } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { CustomLoader } from "./Loader"; // adjust path if needed

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
  category: string;
  onPrevEpisode: () => void;
  onNextEpisode: () => void;
  onEpisodeEnd: () => Promise<void>;
  animeTitle?: string;
  serverName?: string;
};

export function Player({
  episodeId,
  category,
  onPrevEpisode,
  onNextEpisode,
  onEpisodeEnd,
  animeTitle,
  serverName = "vidcloud",
}: PlayerProps) {
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [autoSkip, setAutoSkip] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const toggleAutoPlay = () => setAutoPlay(!autoPlay);
  const toggleAutoNext = () => setAutoNext(!autoNext);
  const toggleAutoSkip = () => setAutoSkip(!autoSkip);

  const getIframeSrc = () => {
    const parts = episodeId.split("$");
    const extractedEpId = parts.length >= 3 ? parts[2] : "";
    const domain = serverName === "vidstreaming" ? "vidwish.live" : "megaplay.buzz";
    return `https://${domain}/stream/s-2/${extractedEpId}/${category}`;
  };

  return (
    <>
      <div style={{ animation: "popIn 0.25s ease-in-out" }} className="relative aspect-video rounded overflow-hidden">
        {/* Loader */}
        {showLoader && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <CustomLoader />
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={getIframeSrc()}
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          className="rounded w-full h-full"
          onLoad={() => setShowLoader(false)}
          onLoadStart={() => setShowLoader(true)}
        ></iframe>
      </div>

      <div
        id="player-menu"
        className="flex items-center md:gap-2 px-1 md:px-2 overflow-x-auto rounded bg-accent no-scrollbar mt-2"
      >
        <Button onClick={toggleAutoPlay} className="flex gap-1">
          {autoPlay ? <FaCheck className="mt-[2px]" /> : <RiCheckboxBlankFill className="mt-[2px]" />}
          Autoplay
        </Button>
        <Button $autoskip onClick={toggleAutoSkip} className="flex gap-1">
          {autoSkip ? <FaCheck className="mt-[2px]" /> : <RiCheckboxBlankFill className="mt-[2px]" />}
          Auto Skip
        </Button>
        <Button className="flex gap-1" onClick={onPrevEpisode}>
          <TbPlayerTrackPrev className="mt-[2px]" /> Prev
        </Button>
        <Button onClick={onNextEpisode} className="flex gap-1">
          <TbPlayerTrackNext className="mt-[2px]" /> Next
        </Button>
        <Button onClick={onEpisodeEnd} className="flex gap-1">
          {autoNext ? <FaCheck className="mt-[2px]" /> : <RiCheckboxBlankFill className="mt-[2px]" />}
          Auto Next
        </Button>
      </div>
    </>
  );
}

export default Player;
