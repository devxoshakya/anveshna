import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const CACHE_SIZE = 20;
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Cache creation function
function createCache(cacheKey) {
  const cache = new Map();
  return {
    get(key) {
      const item = cache.get(key);
      if (item && Date.now() - item.timestamp < CACHE_MAX_AGE) {
        return item.value;
      }
      return undefined;
    },
    set(key, value) {
      if (cache.size >= CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      cache.set(key, { value, timestamp: Date.now() });
    },
  };
}

// Create cache instance for recent episodes
const recentEpisodesCache = createCache('recentEpisodes');

export async function fetchRecentEpisodesV1(type) {
  const cacheKey = `recentEpisodes_${type}`;
  const cachedData = recentEpisodesCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v1/recentepisode/${type}`);
    const recentEpisodes = response.data.results;
    recentEpisodesCache.set(cacheKey, recentEpisodes);
    return recentEpisodes;
  } catch (error) {
    console.error('Error fetching recent episodes:', error);
    throw error;
  }
}

const type = 'all'; // You can change this to a specific type if needed

fetchRecentEpisodesV1(type)
  .then(recentEpisodes => {
    console.log('Recent episodes:', recentEpisodes);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// console.log('API_URL:', API_URL);



// Create cache instance for trending anime
const trendingAnimeCache = createCache('trendingAnime');

export async function fetchTrendingAnime() {
  const cacheKey = 'trendingAnime';
  const cachedData = trendingAnimeCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v2/trending`);
    const trendingAnime = response.data.results;
    trendingAnimeCache.set(cacheKey, trendingAnime);
    return trendingAnime;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    throw error;
  }
}

// Example usage:
fetchTrendingAnime()
  .then(trendingAnime => {
    // console.log('Trending anime:', trendingAnime);
  })
  .catch(error => {
    console.error('Error:', error);
  });


// Create cache instance for popular anime
const popularAnimeCache = createCache('popularAnime');

export async function fetchPopularAnime() {
  const cacheKey = 'popularAnime';
  const cachedData = popularAnimeCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v2/popular`);
    const popularAnime = response.data.results;
    popularAnimeCache.set(cacheKey, popularAnime);
    return popularAnime;
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    throw error;
  }
}

const topAirAnimeCache = createCache('topAirAnime'); 

export async function fetchTopAirAnime() {
  const cacheKey = 'topAirAnime';
  const cachedData = topAirAnimeCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v1/topair?p=1`);
    const topAirAnime = response.data.results;
    topAirAnimeCache.set(cacheKey, topAirAnime);
    return topAirAnime;
  } catch (error) {
    console.error('Error fetching top airing anime:', error);
    throw error;
  }
}

// Example usage:
fetchPopularAnime()
  .then(trendingAnime => {
    console.log('Trending anime:', trendingAnime);
  })
  .catch(error => {
    console.error('Error:', error);
  });


// create function to fetch anime details by id 
const animeDetailsCache = createCache('animeDetails');

export async function fetchAnimeDetails(id) {
  const cacheKey = `animeDetails_${id}`;
  const cachedData = animeDetailsCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v2/info/${id}`);
    const animeDetails = response.data;
    animeDetailsCache.set(cacheKey, animeDetails);
    return animeDetails;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}

// create a function to fetch searched anime by a POST request the argument is the search query
const searchedAnimeCache = createCache('searchedAnime');

export async function fetchSearchedAnime(query) {
  const cacheKey = `searchedAnime_${query}`;
  const cachedData = searchedAnimeCache.get(cacheKey);
  if (cachedData) {
    return cachedData.filter(anime => anime.format !== 'MANGA' && anime.status !== 'NOT_YET_RELEASED');
  }
  
  const requestBody = {
    search : query
  }


  try {
    const response = await axios.post(`${API_URL}/v2/search`, requestBody);
    const searchedAnime = response.data.results.filter(anime => anime.format !== 'MANGA' && anime.status !== 'NOT_YET_RELEASED');
    searchedAnimeCache.set(cacheKey, searchedAnime);
    return searchedAnime;
  } catch (error) {
    console.error('Error fetching searched anime:', error);
    throw error;
  }
}

// Example usage:
fetchSearchedAnime('')
  .then(searchedAnime => {
    console.log('Searched anime:', searchedAnime);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// create a function to fetch anime episodes by id
const animeEpisodesCache = createCache('animeEpisodes');

export async function fetchAnimeEpisodes(id) {
  const cacheKey = `animeEpisodes_${id}`;
  const cachedData = animeEpisodesCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v1/episode/${id}`);
    const animeEpisodes = response.data;
    animeEpisodesCache.set(cacheKey, animeEpisodes);
    return animeEpisodes;
  } catch (error) {
    console.error('Error fetching anime episodes:', error);
    throw error;
  }
}

// create a function to fetch episode stream link by episode id
const episodeStreamCache = createCache('episodeStream');

export async function fetchEpisodeStream(id) {
  const cacheKey = `episodeStream_${id}`;
  const cachedData = episodeStreamCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v1/stream/${id}`);
    const episodeStream = response.data;
    episodeStreamCache.set(cacheKey, episodeStream);
    return episodeStream;
  } catch (error) {
    console.error('Error fetching episode stream:', error);
    throw error;
  }
}

// Example usage:
fetchEpisodeStream('cowboy-bebop-episode-1')
  .then(episodeStream => {
    console.log('Episode stream:', episodeStream);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  const trendingAnimeCache2 = createCache('trendingAnime2');

export async function fetchTrendingAnime2() {
  const cacheKey = 'trendingAnime2';
  const cachedData = trendingAnimeCache2.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_URL}/v2/trending?p=2`);
    const trendingAnime2 = response.data.results;
    trendingAnimeCache2.set(cacheKey, trendingAnime2);
    return trendingAnime2;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    throw error;
  }
}

const popularAnimeCache2 = createCache('popularAnime2');

  export async function fetchPopularAnime2() {
    const cacheKey = 'popularAnime2';
    const cachedData = popularAnimeCache2.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(`${API_URL}/v2/popular?p=2`);
      const popularAnime2 = response.data.results;
      popularAnimeCache2.set(cacheKey, popularAnime2);
      return popularAnime2;
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      throw error;
    }
  }

  export async function fetchAndCompareAnime(topAiringAnimeId) {
    console.time('fetchAndCompareAnime');
    try {
      // Search Anime using fetchSearchedAnime
      const searchResults = await fetchSearchedAnime(topAiringAnimeId);
      const top3Results = searchResults.slice(0, 3);
  
      // Fetch Anime Info using fetchAnimeDetails for top 3 search results
      for (const result of top3Results) {
        const fetchedInfo = await fetchAnimeDetails(result.id);
        console.log('thisis',fetchedInfo);
  
        // Compare gogoId with original ID
        if (fetchedInfo.id_provider.idGogo === topAiringAnimeId) {
          console.timeEnd('fetchAndCompareAnime');
          return result.id;
        }
      }
      console.timeEnd('fetchAndCompareAnime');
      return null; // No match found
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  
  // Example usage
  const topAiringAnimeId = 'kaijuu-8-gou';
  
  fetchAndCompareAnime(topAiringAnimeId)
    .then(matchedId => {
      if (matchedId) {
        console.log('Matched ID:', matchedId);
      } else {
        console.log('No match found');
      }
    })
    .catch(error => console.error('An error occurred:', error));



// Function to fetch skip times for an anime episode
async function fetchSkipTimes({ malId, episodeNumber, episodeLength = '0' }) {
  const API_BASE_URL = 'https://api.aniskip.com/'; // Your API base URL
  const types = ['ed', 'mixed-ed', 'mixed-op', 'op', 'recap'];
  const url = new URL(`${API_BASE_URL}v2/skip-times/${malId}/${episodeNumber}`);
  
  url.searchParams.append('episodeLength', episodeLength.toString());
  types.forEach(type => url.searchParams.append('types[]', type));

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Error fetching skip times: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Sample function call
const malId = '38524';
const episodeNumber = '1';
const episodeLength = '';

fetchSkipTimes({ malId, episodeNumber, episodeLength }).then(data => {
  console.log('Skip times:', data);
});


// Function to fetch embedded anime episodes servers
async function fetchAnimeEmbeddedEpisodes(episodeId) {
  const url = `${API_URL}/v2/stream/${episodeId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching embedded episodes servers: ${response.statusText}`);
    }

    const data = await response.json();
    // Extract iframe links
    const iframeLinks = data.iframe.map(server => server.iframe);
    return iframeLinks;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Sample function call
const episodeId = 'chainsaw-man-episode-1';
fetchAnimeEmbeddedEpisodes(episodeId).then(data => {
  console.log('Embedded episodes servers iframe links:', data);
});


// Function to fetch anime streaming links
async function fetchAnimeStreamingLinks(episodeId) {
  const url = `${API_URL}/v2/stream/${episodeId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching anime streaming links: ${response.statusText}`);
    }

    const data = await response.json();
    // Extract HLS stream links
    const streamLinks = {
      main: data.stream.multi.main.url,
      backup: data.stream.multi.backup.url
    };
    return streamLinks;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Sample function call
fetchAnimeStreamingLinks(episodeId).then(data => {
  console.log('Anime streaming links (HLS):', data);
});
