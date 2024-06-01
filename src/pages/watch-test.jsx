import React from 'react'
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {fetchAnimeDetails} from '../hooks/useAPI';



const Watcher = () => {

  const { animeId } = useParams();

  console.log('Anime ID:', animeId);

  const navigate = useNavigate();

  const fetchAnimeData = async (animeId) => {
    // Fetch data from your API or service
    const response = await fetch(`https://anveshna-backend.vercel.app/api/v2/info/${animeId}`);
    const data = await response.json();
    return data;
  };

  const handleNavigate = async (animeId) => {
    const animeData = await fetchAnimeData(animeId);
    const animeTitle = animeData.id_provider.idGogo;
    const episodeNumber = 1; // Default episode number

    navigate(`/watch-test/${animeId}/${animeTitle}/${episodeNumber}`);
  };

  // Example usage (you might trigger this from a button click or similar event)
  // Replace with actual animeId from your context
  handleNavigate(animeId);


  return (
    <div className='mt-16'>

    </div>
  )
}

export default Watcher
