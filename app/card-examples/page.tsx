"use client";

import React from 'react';
import { AnimeCard } from '@/components/cards/AnimeCard';
import { AnimePinkCard } from '@/components/cards/AnimePinkCard';

export default function AnimeCardExample() {
  const apothecaryDiariesData = {
    id: "20755",
    title: "The Apothecary Diaries Season 2",
    subtitle: "Kusuriya no Hitorigoto 2nd Season",
    description: "The second season of Kusuriya no Hitorigoto. Maomao and Jinshi face palace intrigue as a pregnant concubine's safety and a looming conspiracy collide.",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx155759-6GkrJStkgfhE.jpg",
    year: "2025",
    episodes: "24",
    score: "87",
    genres: ["Drama", "Mystery"],
    status: "Not yet aired",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Anime Cards Example</h1>
      
      <div className="space-y-12">
        {/* Pink Card Style (Exactly as in Screenshot) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pink Card Style (Matching Screenshot)</h2>
          <AnimePinkCard {...apothecaryDiariesData} />
        </div>
        
        {/* Regular Card Style */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Standard Card Style</h2>
          <div className="space-y-6">
            {/* The Apothecary Diaries Card */}
            <AnimeCard {...apothecaryDiariesData} />
            
            {/* Additional sample cards */}
            <AnimeCard 
              id="21756"
              title="Frieren: Beyond Journey's End"
              subtitle="Sousou no Frieren"
              image="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-I5nBfwdW2Qs9.jpg"
              year="2023"
              episodes="28"
              score="92"
              genres={["Adventure", "Drama", "Fantasy"]}
              status="Completed"
            />
            
            <AnimeCard 
              id="21757"
              title="Solo Leveling"
              subtitle="Na Honjaman Lebel-eob"
              image="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-m1gX3kwrpRm6.jpg"
              year="2024"
              episodes="12"
              score="83"
              genres={["Action", "Adventure", "Fantasy"]}
              status="Ongoing"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
