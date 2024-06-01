import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSearch } from '@fortawesome/free-solid-svg-icons';

  
const popInAnimation = keyframes`
0% {
  opacity: 0.4;
  transform: scale(0.98);
}
100% {
  opacity: 1;
  transform: scale(1);
}
`;

const ListContainer = styled.div`
background-color: #141414; /* Dark background color */
color: #e8e8e8; /* Dark text color */
border-radius: 0.3rem;
overflow: hidden;
flex-grow: 1;
display: flex;
flex-direction: column;
max-height: ${({ $maxHeight }) => $maxHeight};
@media (max-width: 1000px) {
  max-height: 18rem;
}
@media (max-width: 500px) {
  max-height: ${({ $maxHeight }) => $maxHeight};
}
`;

const EpisodeGrid = styled.div`
display: grid;
grid-template-columns: repeat(5, 1fr);
gap: 0.29rem;
padding: 0.4rem;
overflow-y: auto;
flex-grow: 1;
color: #e8e8e8; /* Dark text color */

`;

const ListItem = styled.button`
  transition: padding 0.3s ease-in-out, transform 0.3s ease-in-out;
  animation: ${popInAnimation} 0.3s ease forwards;
  background-color: ${({ $isSelected, $isWatched }) =>
    $isSelected
      ? $isWatched
        ? '#8080cf' // Selected and watched
        : '#595991' // Selected but not watched
      : $isWatched
      ? '#595991; filter: brightness(0.8);' // Not selected but watched
      : '#222222'}; // Not selected and not watched
  border: none;
  border-radius: 0.3rem; /* Hardcoded border-radius */
  color: ${({ $isSelected, $isWatched }) =>
    $isSelected
      ? $isWatched
        ? '#e8e8e8' // Selected and watched
        : '#e8e8e8' // Selected but not watched
      : $isWatched
      ? '#8080cf; filter: brightness(0.8);' // Not selected but watched
      : 'grey'}; // Not selected and not watched
  padding: 0.4rem 0;
  text-align: center;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  &:hover,
  &:active,
  &:focus {
    ${({ $isSelected, $isWatched }) =>
      $isSelected
        ? $isWatched
          ? 'filter: brightness(1.1)' // Selected and watched
          : 'filter: brightness(1.1)' // Selected but not watched
        : $isWatched
        ? 'filter: brightness(1.1)' // Not selected but watched
        : 'background-color: #292929; filter: brightness(1.05); color: #FFFFFF'};
  }
`;

const ControlsContainer = styled.div`
display: flex;
align-items: center;
background-color: #141414;
border-bottom: 1px solid #292929;
padding: 0.25rem 0;
`;

const SelectInterval = styled.select`
padding: 0.5rem;
background-color: #141414; /* Dark background color */
color: #e8e8e8; /* Dark text color */
border: none;
border-radius: 0.3rem;
scale : 0.9;
`;

const SearchContainer = styled.div`
display: flex;
align-items: center;
background-color: #141414; /* Dark background color */
border: 1px solid rgba(255, 255, 255, 0.08); 
padding: 0.5rem;
gap: 0.25rem;
margin: 0.2rem 0.5rem;
border-radius: 0.3rem;
transition: background-color 0.15s, color 0.15s;
scale: 0.99;

&:hover,
&:active,
&:focus {
    background-color: #292929;
}
`;

const SearchInput = styled.input`
border: none;
background-color: transparent;
color: #e8e8e8; /* Dark text color */
outline: none;
width: 100%;

&::placeholder {
  color: #888;
}
`;

const Icon = styled.div`
color: #e8e8e8; /* Dark text color */
opacity: 0.5;
font-size: 0.8rem;
transition: opacity 0.2s;

@media (max-width: 768px) {
  display: none; /* Hide on mobile */
}
`;


const EpisodeNumber = styled.span``;



const EpisodeList = ({
  animeId,
  episodes,
  selectedEpisodeId,
  onEpisodeSelect,
  maxListHeight,
}) => {
  const episodeGridRef = useRef(null);
  const episodeRefs = useRef({});
  const [interval, setInterval] = useState([0, 99]);
  const [searchTerm, setSearchTerm] = useState('');
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [selectionInitiatedByUser, setSelectionInitiatedByUser] = useState(false);

  useEffect(() => {
    if (animeId && watchedEpisodes.length > 0) {
      localStorage.setItem(`watched-episodes-${animeId}`, JSON.stringify(watchedEpisodes));
    }
  }, [animeId, watchedEpisodes]);

  useEffect(() => {
    if (animeId) {
      const watched = localStorage.getItem('watched-episodes');
      if (watched) {
        const watchedEpisodesObject = JSON.parse(watched);
        const watchedEpisodesForAnime = watchedEpisodesObject[animeId];
        if (watchedEpisodesForAnime) {
          setWatchedEpisodes(watchedEpisodesForAnime);
        }
      }
    }
  }, [animeId]);

  const markEpisodeAsWatched = useCallback(
    (id) => {
      if (animeId) {
        setWatchedEpisodes((prevWatchedEpisodes) => {
          const updatedWatchedEpisodes = [...prevWatchedEpisodes];
          const selectedEpisodeIndex = updatedWatchedEpisodes.findIndex(
            (episode) => episode.id === id
          );
          if (selectedEpisodeIndex === -1) {
            const selectedEpisode = episodes.find((episode) => episode.id === id);
            if (selectedEpisode) {
              updatedWatchedEpisodes.push(selectedEpisode);
              localStorage.setItem(
                'watched-episodes',
                JSON.stringify({
                  ...JSON.parse(localStorage.getItem('watched-episodes') || '{}'),
                  [animeId]: updatedWatchedEpisodes,
                })
              );
              return updatedWatchedEpisodes;
            }
          }
          return prevWatchedEpisodes;
        });
      }
    },
    [episodes, animeId]
  );

  const handleEpisodeSelect = useCallback(
    (id) => {
      setSelectionInitiatedByUser(true);
      markEpisodeAsWatched(id);
      onEpisodeSelect(id);
    },
    [onEpisodeSelect, markEpisodeAsWatched]
  );

  useEffect(() => {
    if (selectedEpisodeId && !selectionInitiatedByUser) {
      markEpisodeAsWatched(selectedEpisodeId);
    }
  }, [selectedEpisodeId, selectionInitiatedByUser, markEpisodeAsWatched]);

  const intervalOptions = useMemo(() => {
    return episodes.reduce((options, _, index) => {
      if (index % 100 === 0) {
        const start = index;
        const end = Math.min(index + 99, episodes.length - 1);
        options.push({ start, end });
      }
      return options;
    }, []);
  }, [episodes]);

  const handleIntervalChange = useCallback(
    (e) => {
      const [start, end] = e.target.value.split('-').map(Number);
      setInterval([start, end]);
    },
    []
  );

  const filteredEpisodes = useMemo(() => {
    const searchQuery = searchTerm.toLowerCase();
    return episodes.filter(
      (episode) =>
        episode.title?.toLowerCase().includes(searchQuery) ||
        episode.number.toString().includes(searchQuery)
    );
  }, [episodes, searchTerm]);

  const displayedEpisodes = useMemo(() => {
    if (!searchTerm) {
      return episodes.slice(interval[0], interval[1] + 1);
    }
    return filteredEpisodes;
  }, [episodes, filteredEpisodes, interval, searchTerm]);

  useEffect(() => {
    const allTitlesNull = episodes.every((episode) => episode.title === null);
    if (allTitlesNull) {
      episodeGridRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [episodes]);

return (
    <ListContainer $maxHeight={maxListHeight} className=''>
        <ControlsContainer>
            <SelectInterval onChange={handleIntervalChange}>
                {intervalOptions.map(({ start, end }) => (
                    <option key={start} value={`${start}-${end}`}>
                        Episodes {start + 1} - {end + 1}
                    </option>
                ))}
            </SelectInterval>
            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Search episodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Icon>
                    <FontAwesomeIcon icon={faSearch} />
                </Icon>
            </SearchContainer>
        </ControlsContainer>
        <EpisodeGrid ref={episodeGridRef}>
            {displayedEpisodes.map((episode) => (
                <ListItem
                    key={episode.id}
                    ref={(el) => (episodeRefs.current[episode.id] = el)}
                    $isSelected={episode.id === selectedEpisodeId}
                    $isWatched={watchedEpisodes.some((e) => e.id === episode.id)}
                    onClick={() => handleEpisodeSelect(episode.id)}
                >
                    {episode.id === selectedEpisodeId ? (
                        <FontAwesomeIcon icon={faPlay} />
                    ) : (
                        <EpisodeNumber>{episode.number}</EpisodeNumber>
                    )}
                </ListItem>
            ))}
        </EpisodeGrid>
    </ListContainer>
);
};

export default EpisodeList;

