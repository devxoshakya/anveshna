import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { TbCards } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { HomeSideBar } from "../home/HomeCardList";

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: 0.2s ease-in-out;
  .Section-Title {
    margin: 0;
    padding: 0 0 0.5rem 0;
    color: var(--global-text);
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const SidebarContainer = styled.div`
  padding: 0.75rem;
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
`;

const Card = styled.div`
  display: flex;
  background-color: var(--global-div);
  border-radius: var(--global-border-radius);
  align-items: center;
  overflow: hidden;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.5s ease-in-out;
  animation-fill-mode: backwards;
  transition:
    background-color 0s ease-in-out,
    margin-left 0.2s ease-in-out 0.1s;
  &:hover,
  &:active,
  &:focus {
    background-color: var(--global-div-tr);
    margin-left: 0.35rem;
    @media (max-width: 500px) {
      margin-left: unset;
    }
`;

const AnimeImage = styled.img`
  width: 4.25rem;
  height: 6rem;
  object-fit: cover;
  border-radius: var(--global-border-radius);
`;

const Info = styled.div``;

const TitleWithDot = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-top: 0.35rem;
  gap: 0.4rem;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  transition: background 0.2s ease;
`;

const Title = styled.p`
  top: 0;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
  margin: 0;
`;

const Details = styled.p`
  font-size: 0.75rem;
  margin: 0;
  color: rgba(102, 102, 102, 0.75);
  svg {
    margin-left: 0.4rem;
  }
`;

export const AnimeDataList: React.FC<{ animeData: any }> = ({ animeData }) => {
  const filteredRecommendations = animeData.recommendations.filter((rec: any) =>
    ["OVA", "SPECIAL", "TV", "MOVIE", "ONA", "NOVEL"].includes(rec.type || "")
  );

  const filteredRelations = animeData.relations.filter((rel: any) =>
    ["OVA", "SPECIAL", "TV", "MOVIE", "ONA", "NOVEL", "MANGA"].includes(
      rel.type || ""
    )
  );

  return (
    <Sidebar>
      <HomeSideBar title="RELATED ANIME" animeData={filteredRelations} />
      <div className="w-full h-8 md:h-10 border-1 rounded-md bg-list-background"></div>
      <HomeSideBar
        title={`RECOMMENDED ANIME`}
        animeData={filteredRecommendations.slice(0, 5)}
      />
    </Sidebar>
  );
};
