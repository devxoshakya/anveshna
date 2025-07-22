import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faThList,
  faTh,
  faSearch,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  animeId: string | undefined;
  episodes: any[];
  selectedEpisodeId: string;
  onEpisodeSelect: (id: string) => void;
  maxListHeight: string;
}

export const EpisodeList: React.FC<Props> = ({
  animeId,
  episodes,
  selectedEpisodeId,
  onEpisodeSelect,
  maxListHeight,
}) => {
  // State for interval, layout, user layout preference, search term, and watched episodes
  const episodeGridRef = useRef<HTMLDivElement>(null);
  const episodeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [interval, setInterval] = useState<[number, number]>([0, 99]);
  const [isRowLayout, setIsRowLayout] = useState(true);
  const [userLayoutPreference, setUserLayoutPreference] = useState<
    boolean | null
  >(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [watchedEpisodes, setWatchedEpisodes] = useState<any[]>([]);
  const defaultLayoutMode = episodes.every((episode) => episode.title)
    ? 'list'
    : 'grid';
  const [displayMode, setDisplayMode] = useState<'list' | 'grid' | 'imageList'>(
    () => {
      const savedMode = animeId
        ? localStorage.getItem(`listLayout-[${animeId}]`)
        : null;
      return (savedMode as 'list' | 'grid' | 'imageList') || defaultLayoutMode;
    },
  );

  const [selectionInitiatedByUser, setSelectionInitiatedByUser] =
    useState(false);

  // Update local storage when watched episodes change
  useEffect(() => {
    if (animeId && watchedEpisodes.length > 0) {
      localStorage.setItem(
        `watched-episodes-${animeId}`,
        JSON.stringify(watchedEpisodes),
      );
    }
  }, [animeId, watchedEpisodes]);

  // Load watched episodes from local storage when animeId changes
  useEffect(() => {
    if (animeId) {
      localStorage.setItem(`listLayout-[${animeId}]`, displayMode);
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

  // Function to mark an episode as watched
  const markEpisodeAsWatched = useCallback(
    (id: string) => {
      if (animeId) {
        setWatchedEpisodes((prevWatchedEpisodes) => {
          const updatedWatchedEpisodes = [...prevWatchedEpisodes];
          const selectedEpisodeIndex = updatedWatchedEpisodes.findIndex(
            (episode) => episode.id === id,
          );
          if (selectedEpisodeIndex === -1) {
            const selectedEpisode = episodes.find(
              (episode) => episode.id === id,
            );
            if (selectedEpisode) {
              updatedWatchedEpisodes.push(selectedEpisode);
              // Update the watched episodes object in local storage
              localStorage.setItem(
                'watched-episodes',
                JSON.stringify({
                  ...JSON.parse(
                    localStorage.getItem('watched-episodes') || '{}',
                  ),
                  [animeId]: updatedWatchedEpisodes,
                }),
              );
              return updatedWatchedEpisodes;
            }
          }
          return prevWatchedEpisodes;
        });
      }
    },
    [episodes, animeId],
  );

  const handleEpisodeSelect = useCallback(
    (id: string) => {
      setSelectionInitiatedByUser(true);
      markEpisodeAsWatched(id); // Mark the episode as watched
      onEpisodeSelect(id);
    },
    [onEpisodeSelect, markEpisodeAsWatched],
  );

  // Update watched episodes when a new episode is selected or visited
  useEffect(() => {
    if (selectedEpisodeId && !selectionInitiatedByUser) {
      markEpisodeAsWatched(selectedEpisodeId);
    }
  }, [selectedEpisodeId, selectionInitiatedByUser, markEpisodeAsWatched]);

  // Generate interval options
  const intervalOptions = useMemo(() => {
    return episodes.reduce<{ start: number; end: number }[]>(
      (options, _, index) => {
        if (index % 100 === 0) {
          const start = index;
          const end = Math.min(index + 99, episodes.length - 1);
          options.push({ start, end });
        }
        return options;
      },
      [],
    );
  }, [episodes]);

  // Handle interval change
  const handleIntervalChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [start, end] = e.target.value.split('-').map(Number);
      setInterval([start, end]);
    },
    [],
  );

  // Toggle layout preference
  const toggleLayoutPreference = useCallback(() => {
    setDisplayMode((prevMode) => {
      const nextMode =
        prevMode === 'list'
          ? 'grid'
          : prevMode === 'grid'
            ? 'imageList'
            : 'list';
      if (animeId) {
        localStorage.setItem(`listLayout-[${animeId}]`, nextMode);
      }
      return nextMode;
    });
  }, [animeId]);

  // Filter episodes based on search input
  const filteredEpisodes = useMemo(() => {
    const searchQuery = searchTerm.toLowerCase();
    return episodes.filter(
      (episode) =>
        episode.title?.toLowerCase().includes(searchQuery) ||
        episode.number.toString().includes(searchQuery),
    );
  }, [episodes, searchTerm]);

  // Apply the interval to the filtered episodes
  const displayedEpisodes = useMemo(() => {
    if (!searchTerm) {
      // If there's no search term, apply interval to all episodes
      return episodes.slice(interval[0], interval[1] + 1);
    }
    // If there is a search term, display filtered episodes without applying interval
    return filteredEpisodes;
  }, [episodes, filteredEpisodes, interval, searchTerm]);

  // Determine layout based on episodes and user preference
  useEffect(() => {
    const allTitlesNull = episodes.every((episode) => episode.title === null);
    const defaultLayout = episodes.length <= 26 && !allTitlesNull;

    setIsRowLayout(
      userLayoutPreference !== null ? userLayoutPreference : defaultLayout,
    );

    // Find the selected episode
    if (!selectionInitiatedByUser) {
      const selectedEpisode = episodes.find(
        (episode) => episode.id === selectedEpisodeId,
      );
      if (selectedEpisode) {
        // Find the interval containing the selected episode
        for (let i = 0; i < intervalOptions.length; i++) {
          const { start, end } = intervalOptions[i];
          if (
            selectedEpisode.number >= start + 1 &&
            selectedEpisode.number <= end + 1
          ) {
            setInterval([start, end]);
            break;
          }
        }
      }
    }
  }, [
    episodes,
    userLayoutPreference,
    selectedEpisodeId,
    intervalOptions,
    selectionInitiatedByUser,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        selectedEpisodeId &&
        episodeRefs.current[selectedEpisodeId] &&
        episodeGridRef.current &&
        !selectionInitiatedByUser
      ) {
        const episodeElement = episodeRefs.current[selectedEpisodeId];
        const container = episodeGridRef.current;

        // Ensure episodeElement is not null before proceeding
        if (episodeElement && container) {
          // Calculate episode's top position relative to the container
          const episodeTop =
            episodeElement.getBoundingClientRect().top -
            container.getBoundingClientRect().top;

          // Calculate the desired scroll position to center the episode in the container
          const episodeHeight = episodeElement.offsetHeight;
          const containerHeight = container.offsetHeight;
          const desiredScrollPosition =
            episodeTop + episodeHeight / 2 - containerHeight / 2;

          container.scrollTo({
            top: desiredScrollPosition,
            behavior: 'smooth',
          });

          setSelectionInitiatedByUser(false);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedEpisodeId, episodes, displayMode, selectionInitiatedByUser]);

  // Dynamic max height calculation
  const dynamicMaxHeight = () => {
    if (window.innerWidth <= 500) return maxListHeight;
    if (window.innerWidth <= 1000) return '18rem';
    return maxListHeight;
  };

  // Render the EpisodeList component
  return (
    <div 
      className="bg-secondary text-foreground rounded-lg overflow-hidden flex-grow flex flex-col max-lg:max-h-72 max-sm:h-auto"
      style={{ maxHeight: dynamicMaxHeight() }}
    >
      {/* Controls Container */}
      <div className="flex items-center bg-secondary border-b-2 border-border py-1">
        <select
          className="p-2 bg-secondary text-foreground border-none rounded-lg"
          onChange={handleIntervalChange}
          value={`${interval[0]}-${interval[1]}`}
        >
          {intervalOptions.map(({ start, end }, index) => (
            <option key={index} value={`${start}-${end}`}>
              Episodes {start + 1} - {end + 1}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-secondary border-2 border-border p-2 gap-1 mx-2 rounded-lg transition-colors hover:bg-muted focus-within:bg-muted">
          <div className="text-foreground opacity-50 text-xs transition-opacity max-md:hidden">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <input
            type="text"
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none bg-transparent text-foreground outline-none w-full placeholder:text-muted-foreground"
          />
        </div>

        <button
          onClick={toggleLayoutPreference}
          className="bg-secondary border-2 border-border p-2 mr-2 cursor-pointer text-foreground rounded-lg transition-colors hover:bg-muted focus:bg-muted active:bg-muted"
        >
          {displayMode === 'list' && <FontAwesomeIcon icon={faThList} />}
          {displayMode === 'grid' && <FontAwesomeIcon icon={faTh} />}
          {displayMode === 'imageList' && <FontAwesomeIcon icon={faImage} />}
        </button>
      </div>

      {/* Episode Grid */}
      <div
        key={`episode-grid-${displayMode}`}
        className={`grid gap-1 p-2 overflow-y-auto flex-grow ${
          displayMode === 'list' || displayMode === 'imageList'
            ? 'grid-cols-1'
            : 'grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]'
        }`}
        ref={episodeGridRef}
      >
        {displayedEpisodes.map((episode) => {
          const isSelected = episode.id === selectedEpisodeId;
          const isWatched = watchedEpisodes.some((e) => e.id === episode.id);
          const isRowLayout = displayMode === 'list' || displayMode === 'imageList';

          // Dynamic button classes based on state
          const getButtonClasses = () => {
            const baseClasses = "transition-all duration-300 border-none rounded-lg cursor-pointer animate-[popIn_0.3s_ease-in-out] hover:pl-4";
            
            if (isSelected) {
              return `${baseClasses} ${
                isWatched 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground'
              } hover:brightness-110`;
            } else if (isWatched) {
              return `${baseClasses} bg-accent text-accent-foreground brightness-80 hover:brightness-110`;
            } else {
              return `${baseClasses} bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:brightness-105`;
            }
          };

          const paddingClasses = isRowLayout ? 'p-2' : 'p-1';
          const textAlignClasses = isRowLayout ? 'text-left' : 'text-center';
          const flexClasses = isRowLayout ? 'justify-between' : 'justify-center';

          return (
            <button
              key={episode.id}
              className={`${getButtonClasses()} ${paddingClasses} ${textAlignClasses} ${flexClasses} items-center flex`}
              onClick={() => handleEpisodeSelect(episode.id)}
              aria-selected={isSelected}
              ref={(el) => {
                episodeRefs.current[episode.id] = el;
              }}
            >
              {displayMode === 'imageList' ? (
                <>
                  <div>
                    <span>{episode.number}. </span>
                    <span className="p-2">{episode.title}</span>
                  </div>
                  <img
                    src={episode.image}
                    alt={`Episode ${episode.number} - ${episode.title}`}
                    className="max-w-64 max-h-36 h-auto mt-2 rounded-lg max-sm:max-w-32 max-sm:max-h-20"
                  />
                </>
              ) : displayMode === 'grid' ? (
                <div className="flex flex-col justify-center items-center h-full">
                  {isSelected ? (
                    <FontAwesomeIcon icon={faPlay} />
                  ) : (
                    <span>{episode.number}</span>
                  )}
                </div>
              ) : (
                // List layout
                <>
                  <span>{episode.number}. </span>
                  <span className="p-2">{episode.title}</span>
                  {isSelected && <FontAwesomeIcon icon={faPlay} />}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};