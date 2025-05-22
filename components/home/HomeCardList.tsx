import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { TbCards } from "react-icons/tb";
import { FaStar, FaCalendarAlt } from "react-icons/fa";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { MdKeyboardArrowRight } from "react-icons/md";


// Outer container with 1px border
const SidebarStyled = styled.div`
  transition: 0.2s ease-in-out;
  margin: 0;
  padding: 1rem;
  background-color: #efd09f;
  max-width: 24rem;
  border: 1px solid var(--muted-foreground);
  border-radius: 8px;
  overflow: hidden;
  @media (max-width: 1000px) {
    max-width: unset;
  }
`;

// Status indicator with title in one line
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  gap: 0.4rem;
  z-index: 10;
  position: relative;
`;

// Card with background image and gradient overlay
const AnimeCard = styled.div`
  position: relative;
  height: 5.5rem;
  border-radius: 8px;

  margin-bottom: 0.5rem;
  cursor: pointer;
  animation: slideUp 0.5s ease-in-out;
  animation-fill-mode: backwards;
  overflow: hidden;
  background-color: var(--card);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      #f2e3c6 0%,
      #f6ebd5 30%,
    
      #fff9ee 100%
    );
    opacity: 0.7;
    z-index: 2;
  }

  &:hover {
    transform: translateX(0.35rem);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 500px) {
    &:hover {
      transform: none;
    }
  }
`;

// Background cover image
const BackgroundImage = styled.div<{ $bgImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${(props) => props.$bgImage || ""});
  background-size: cover;
  background-position: center;
  z-index: 1;
`;

// Full height image on the left
const AnimeImageStyled = styled.img`
  position: absolute;
  height: 100%;
  width: auto;
  object-fit: cover;
  left: 0;
  top: 0;
  border-radius: 8px;
  z-index: 3;
`;

// Content container positioned for proper alignment
const InfoStyled = styled.div`
  position: relative;
  z-index: 5;
  margin-left: 4.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1.1rem 0;
`;

// Title with better visibility
const Title = styled.p`
  color: #603f0b;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
  margin: 0;
`;

// Single line details
const Details = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #603f0b;
  margin: 0;
  flex-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.5rem;

  svg {
    margin-right: 0.25rem;
  }
`;

interface AnimeData {
  id: string;
  title: {
    english?: string;
    romaji?: string;
    userPreferred?: string;
  };
  image?: string;
  coverImage?: string;
  type?: string;
  status?: string;
  releaseDate?: string;
  currentEpisode?: number;
  totalEpisodes?: number;
  rating?: number;
}

export const HomeSideBar: React.FC<{ animeData: AnimeData[], title: string }> = ({
  animeData, title
}) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedAnime = windowWidth <= 500 ? animeData.slice(0, 5) : animeData;

  return (
    <SidebarStyled>
      <div className="flex items-center justify-start mb-2">
        <MdKeyboardArrowRight className="h-6 w-6 mb-1 m-0" />
        <h2 className="text-lg font-bold">{title}</h2>
        </div>
      {displayedAnime.map((anime: AnimeData, index) => (
        <Link
          href={`/watch/${anime.id}`}
          key={anime.id}
          style={{ textDecoration: "none", color: "inherit" }}
          title={`${
            anime.title.userPreferred ||
            anime.title.english ||
            anime.title.romaji
          }`}
          aria-label={`Watch ${
            anime.title.userPreferred ||
            anime.title.english ||
            anime.title.romaji
          }`}
        >
          <AnimeCard style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Background image with cover art */}
            <BackgroundImage $bgImage={anime.coverImage || anime.image || ""} />

            {/* Main poster image */}
            <AnimeImageStyled
              src={anime.image || ""}
              alt={
                anime.title.userPreferred ||
                anime.title.english ||
                anime.title.romaji ||
                ""
              }
            />

            <InfoStyled>
              <TitleContainer>
                <StatusIndicator status={anime.status || ""} />
                <Title>
                  {anime.title.english || anime.title.romaji || "Unknown Title"}
                </Title>
              </TitleContainer>

              <Details>
                {anime.type && (
                  <span className="flex items-center whitespace-nowrap">
                    {anime.type}
                  </span>
                )}

                {anime.releaseDate && (
                  <span className="flex items-center whitespace-nowrap">
                    <FaCalendarAlt /> {anime.releaseDate}
                  </span>
                )}

                {anime.currentEpisode !== null &&
                  anime.currentEpisode !== undefined &&
                  anime.totalEpisodes !== null &&
                  anime.totalEpisodes !== undefined &&
                  anime.totalEpisodes !== 0 && (
                    <span className="flex items-center whitespace-nowrap">
                      <TbCards /> {anime.currentEpisode}/{anime.totalEpisodes}
                    </span>
                  )}

                {anime.rating && (
                  <span className="flex items-center whitespace-nowrap">
                    <FaStar /> {anime.rating}
                  </span>
                )}
              </Details>
            </InfoStyled>
          </AnimeCard>
        </Link>
      ))}
    </SidebarStyled>
  );
};

// Add display name for debugging
HomeSideBar.displayName = "HomeSideBar";
