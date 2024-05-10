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
    // console.log('Recent episodes:', recentEpisodes);
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

