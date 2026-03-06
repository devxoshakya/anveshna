"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { CardItem } from "@/components/cards/CardItem";
import { CardGrid } from "@/components/cards/CardGrid";
import { Seasons } from "@/components/watch/Seasons";
import type { AnimeIdentificationResult } from "@/hooks/useAi";
import { cn } from "@/lib/utils";
import { FaStar, FaCalendarAlt, FaTv } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { useIsMobile } from "@/hooks/use-mobile";

// Styled components for trailer
const ShowTrailerButton = styled.button`
    margin-right: 1rem;
    padding: 0.5rem;
    width: 25%;
    background-color: var(--muted);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition:
        background-color 0.3s ease,
        transform 0.2s ease-in-out;
    color: var(--global-text);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    cursor: pointer;

    &:hover,
    &:active,
    &:focus {
        background-color: var(--primary-accent);
        z-index: 2;
    }

    @media (max-width: 500px) {
        font-size: 0.8rem;
        width: 40%;
    }
`;

const IframeTrailer = styled.iframe`
    aspect-ratio: 16/9;
    margin-bottom: 2rem;
    position: relative;
    border: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    @media (max-width: 1000px) {
        width: 100%;
        height: 100%;
    }
`;

const TrailerOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease-in-out;
    animation: slideUp 0.3s ease-in-out;
    aspect-ratio: 16 / 9;
`;

const TrailerOverlayContent = styled.div`
    width: 60%;
    aspect-ratio: 16 / 9;
    background: white;
    border-radius: var(--global-border-radius);
    overflow: hidden;
    background-color: var(--global-div);

    @media (max-width: 500px) {
        width: 95%;
    }
`;

const SectionTitle = styled.p`
    color: var(--global-text);
    margin-top: 1rem;
    margin-bottom: 1, 5rem;
    font-size: 1.25rem;
    font-weight: bold;
`;

interface SearchResultCardProps {
    result: AnimeIdentificationResult;
}

export const SearchResultCard = ({ result }: SearchResultCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const isMobile = useIsMobile();

    if (!result.success || !result.result) {
        return null;
    }

    const { result: animeInfo, media } = result;

    const toggleTrailer = () => {
        setShowTrailer(!showTrailer);
    };

    // Handle escape key to close trailer
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && showTrailer) {
                setShowTrailer(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showTrailer]);

    // Transform media data to match CardItem expected format
    // Handle case where media might not exist or have different structure
    const cardItemData = {
        id: media?.id || result.id || Math.random(),
        title: {
            romaji: media?.title?.romaji || animeInfo.anime,
            english: media?.title?.english || animeInfo.anime,
            native: media?.title?.native || null,
            userPreferred: media?.title?.userPreferred || animeInfo.anime,
        },
        image:
            media?.image ||
            media?.coverImage?.large ||
            media?.coverImage?.medium ||
            media?.coverImage?.extraLarge,
        cover: media?.cover || media?.bannerImage || media?.image,
        color: media?.color || "#8B5CF6",
        status: media?.status || "FINISHED",
        releaseDate:
            media?.releaseDate ||
            media?.seasonYear?.toString() ||
            media?.startDate?.year?.toString(),
        totalEpisodes:
            animeInfo.episodes || media?.episodes || media?.totalEpisodes,
        episodes: animeInfo.episodes || media?.episodes,
        rating: media?.rating || media?.averageScore,
        type: media?.type || "TV",
    };

    // Confidence color mapping
    const confidenceColor =
        {
            High: "text-green-500",
            Medium: "text-yellow-500",
            Low: "text-orange-500",
        }[animeInfo.confidence] || "text-gray-500";

    return (
        <div className="w-full space-y-28">
            {/* Main card section with cover image and CardItem overlay */}
            <div className="relative w-full">
                {/* Cover Image and Trailer Button Container */}
                <div className="space-y-2">
                    <div className="h-36 md:h-64 w-full rounded-xl overflow-hidden shadow-lg">
                        {!imageError && cardItemData.image ? (
                            <img
                                src={cardItemData.cover}
                                alt={animeInfo.anime}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <FaTv className="text-4xl text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Trailer Button */}
                    {media?.trailer && media.trailer.id && (
                        <ShowTrailerButton onClick={toggleTrailer}>
                            <strong>WATCH TRAILER</strong>
                        </ShowTrailerButton>
                    )}
                </div>

                {/* CardItem overlaid on right side with bottom spacing */}
                <div className="absolute md:w-40 right-8 -bottom-24">
                    <CardItem anime={cardItemData} />
                </div>
            </div>

            {/* Trailer Overlay */}
            {showTrailer && media?.trailer && (
                <TrailerOverlay onClick={toggleTrailer}>
                    <TrailerOverlayContent onClick={(e) => e.stopPropagation()}>
                        <IframeTrailer
                            src={`https://www.youtube.com/embed/${media.trailer.id}`}
                            allowFullScreen
                        />
                    </TrailerOverlayContent>
                </TrailerOverlay>
            )}

            {/* Additional Information Section */}
            <div className="space-y-1 bg-muted/30 rounded-xl p-4 mb-0">
                {/* Overview */}
                {animeInfo.overview && (
                    <div>
                        <h3 className="text-sm md:text-lg font-semibold md:font-bold mb-2 flex items-center gap-2">
                            <BiSolidCategoryAlt className="text-primary" />
                            Overview
                        </h3>
                        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed font-medium">
                            {animeInfo.overview}
                        </p>
                    </div>
                )}

                {/* Genres */}
                {animeInfo.genres && animeInfo.genres.length > 0 && (
                    <div>
                        <h3 className="text-sm md:text-lg font-semibold md:font-bold mb-2 flex items-center gap-2">
                            <BiSolidCategoryAlt className="text-primary" />
                            Genres
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {animeInfo.genres.map((genre, index) => (
                                <span
                                    key={index}
                                    className="px-2.5 py-1 bg-primary/10 text-primary text-xs md:text-base font-medium md:font-semibold rounded-full"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Review */}
                {animeInfo.review && (
                    <div>
                        <h3 className="text-sm md:text-lg font-semibold md:font-bold mb-2 flex items-center gap-2">
                            <FaStar className="text-primary" />
                            Review
                        </h3>
                        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed font-medium">
                            {animeInfo.review}
                        </p>
                    </div>
                )}
            </div>

            {/* Related/Seasons Section */}
            {media?.relations &&
                media.relations.some(
                    (relation: any) =>
                        relation.relationType?.toUpperCase() === "PREQUEL" ||
                        relation.relationType?.toUpperCase() === "SEQUEL",
                ) && (
                    <div className="space-y-1 mb-0">
                        <SectionTitle>SEASONS</SectionTitle>
                        <Seasons
                            relations={media.relations.filter(
                                (relation: any) =>
                                    relation.relationType?.toUpperCase() ===
                                        "PREQUEL" ||
                                    relation.relationType?.toUpperCase() ===
                                        "SEQUEL",
                            )}
                        />
                    </div>
                )}

            {/* Recommendations Section */}
            {media?.recommendations && media.recommendations.length > 0 && (
                <div className="space-y-1">
                    <SectionTitle>RECOMMENDED ANIME</SectionTitle>
                    <CardGrid
                        animeData={media.recommendations
                            .sort(
                                (a: any, b: any) =>
                                    (b.rating || 0) - (a.rating || 0),
                            )
                            .slice(0, isMobile ? 9 : 12)
                            .map((rec: any) => ({
                                id: rec.id,
                                title: {
                                    romaji: rec.title?.romaji,
                                    english: rec.title?.english,
                                    native: rec.title?.native,
                                    userPreferred:
                                        rec.title?.userPreferred ||
                                        rec.title?.romaji,
                                },
                                image: rec.image || rec.cover,
                                cover: rec.cover || rec.image,
                                color: rec.color,
                                status: rec.status,
                                releaseDate:
                                    rec.releaseDate ||
                                    rec?.releaseDate ||
                                    rec?.seasonYear?.toString() ||
                                    rec?.startDate?.year?.toString(),
                                totalEpisodes: rec.episodes,
                                rating: rec.rating,
                                type: rec.type,
                            }))}
                        hasNextPage={false}
                        onLoadMore={() => {}}
                    />
                </div>
            )}
        </div>
    );
};
