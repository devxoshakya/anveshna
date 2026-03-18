"use client";
import axios from 'axios';
import { year, getCurrentSeason, getNextSeason } from './useTime';

// Utility function to ensure URL ends with a slash
function ensureUrlEndsWithSlash(url: string): string {
    return url.endsWith('/') ? url : `${url}/`;
}

// Adjusting environment variables to ensure they end with a slash
const BASE_URL = ensureUrlEndsWithSlash(
    process.env.NEXT_PUBLIC_BACKEND_URL as string,
);
const CF_BACKEND_URL = ensureUrlEndsWithSlash(
    (process.env.NEXT_PUBLIC_CF_BACKEND_URL || process.env.cf_backend_url || process.env.NEXT_PUBLIC_BACKEND_URL) as string,
);
const STREAM_URL = ensureUrlEndsWithSlash(
    process.env.NEXT_PUBLIC_STREAMING_BACKEND_URL as string,
);

export const MEDIA_PROXY_URL = ensureUrlEndsWithSlash(
    process.env.NEXT_PUBLIC_CF_PROXY_URL as string,
);

const SKIP_TIMES = ensureUrlEndsWithSlash(
    process.env.NEXT_PUBLIC_SKIP_TIMES as string,
);
let PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL; // Default to an empty string if no proxy URL is provided
// Check if the proxy URL is provided and ensure it ends with a slash
if (PROXY_URL) {
    PROXY_URL = ensureUrlEndsWithSlash(process.env.NEXT_PUBLIC_PROXY_URL as string);
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

// Axios instance
const axiosInstance = axios.create({
    baseURL: PROXY_URL || undefined,
    timeout: 10000,
    headers: {
        'X-API-Key': API_KEY, // Assuming your API expects the key in this header
    },
});

// Error handling function
// Function to handle errors and throw appropriately
function handleError(error: any, context: string) {
    let errorMessage = 'An error occurred';

    // Handling CORS errors (Note: This is a simplification. Real CORS errors are hard to catch in JS)
    if (error.message && error.message.includes('Access-Control-Allow-Origin')) {
        errorMessage = 'A CORS error occurred';
    }

    switch (context) {
        case 'data':
            errorMessage = 'Error fetching data';
            break;
        case 'anime episodes':
            errorMessage = 'Error fetching anime episodes';
            break;
        // Extend with other cases as needed
    }

    if (error.response) {
        // Extend with more nuanced handling based on HTTP status codes
        const status = error.response.status;
        if (status >= 500) {
            errorMessage += ': Server error';
        } else if (status >= 400) {
            errorMessage += ': Client error';
        }
        // Include server-provided error message if available
        errorMessage += `: ${error.response.data.message || 'Unknown error'}`;
    } else if (error.message) {
        errorMessage += `: ${error.message}`;
    }

    throw new Error(errorMessage);
}

// Cache key generator
// Function to generate cache key from arguments
function generateCacheKey(...args: string[]) {
    return args.join('-');
}

interface CacheItem {
    value: any; // Replace 'any' with a more specific type if possible
    timestamp: number;
}

const SERVER_ID_TO_STREAM_SERVER: Record<number, string> = {
    1: 'hd-2',
    4: 'hd-1',
};

const LEGACY_SERVER_ALIAS_MAP: Record<string, string> = {
    vidcloud: 'hd-1',
    vidsrc: 'hd-1',
    vidstreaming: 'hd-2',
    megacloud: 'hd-2',
};

function normalizeServerName(serverName?: string) {
    if (!serverName) return 'hd-1';
    const normalized = serverName.toLowerCase();
    return LEGACY_SERVER_ALIAS_MAP[normalized] || normalized;
}

function mapEpisodeSourceServers(payload: any) {
    const data = payload?.data || payload;
    if (!data || typeof data !== 'object') {
        return payload;
    }

    const mapServers = (servers: any[] = []) =>
        servers.map((server) => {
            const mappedServerName = SERVER_ID_TO_STREAM_SERVER[server?.serverId] || server?.serverName;
            return {
                ...server,
                originalServerName: server?.serverName,
                serverName: mappedServerName,
            };
        });

    const mappedData = {
        ...data,
        sub: mapServers(data?.sub || []),
        dub: mapServers(data?.dub || []),
        raw: mapServers(data?.raw || []),
    };

    return payload?.data ? { ...payload, data: mappedData } : mappedData;
}

function resolveStreamingServerFromSources(
    sourcesPayload: any,
    category: string,
    requestedServer: string,
) {
    const normalizedCategory = (category || 'sub').toLowerCase();
    const normalizedRequest = normalizeServerName(requestedServer);

    const sourceData = sourcesPayload?.data || sourcesPayload;
    const categoryServers =
        sourceData?.[normalizedCategory] ||
        sourceData?.sub ||
        sourceData?.dub ||
        [];

    if (!Array.isArray(categoryServers) || categoryServers.length === 0) {
        return normalizedRequest;
    }

    const mappedServers = categoryServers
        .map((server: any) => SERVER_ID_TO_STREAM_SERVER[server?.serverId] || normalizeServerName(server?.serverName))
        .filter(Boolean);

    if (mappedServers.includes(normalizedRequest)) {
        return normalizedRequest;
    }

    return mappedServers[0] || normalizedRequest;
}

// Session storage cache creation
// Function to create a cache in session storage
function createOptimizedSessionStorageCache(

    maxSize: number,
    maxAge: number,
    cacheKey: string,
) {
    if (typeof window === 'undefined') {
        return {
            get: () => undefined,
            set: () => { },
        };
    }

    const cache = new Map<string, CacheItem>(
        JSON.parse(sessionStorage.getItem(cacheKey) || '[]'),
    );
    const keys = new Set<string>(cache.keys());

    function isItemExpired(item: CacheItem) {
        return Date.now() - item.timestamp > maxAge;
    }

    function updateSessionStorage() {
        sessionStorage.setItem(
            cacheKey,
            JSON.stringify(Array.from(cache.entries())),
        );
    }

    return {
        get(key: string) {
            if (cache.has(key)) {
                const item = cache.get(key);
                if (!isItemExpired(item!)) {
                    keys.delete(key);
                    keys.add(key);
                    return item!.value;
                }
                cache.delete(key);
                keys.delete(key);
            }
            return undefined;
        },
        set(key: string, value: any) {
            if (cache.size >= maxSize) {
                const oldestKey = keys.values().next().value;
                cache.delete(oldestKey!);
                keys.delete(oldestKey!);
            }
            keys.add(key);
            cache.set(key, { value, timestamp: Date.now() });
            updateSessionStorage();
        },
    };
}


// Constants for cache configuration
// Cache size and max age constants
const CACHE_SIZE = 20;
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Factory function for cache creation
// Function to create cache with given cache key
function createCache(cacheKey: string) {
    return createOptimizedSessionStorageCache(
        CACHE_SIZE,
        CACHE_MAX_AGE,
        cacheKey,
    );
}

interface FetchOptions {
    type?: string;
    season?: string;
    format?: string;
    sort?: string[];
    genres?: string[];
    id?: string;
    year?: string;
    status?: string;
}

// Individual caches for different types of data
// Creating caches for anime data, anime info, and video sources
const advancedSearchCache = createCache('Advanced Search');
const animeDataCache = createCache('Data');
const animeInfoCache = createCache('Info');
const animeEpisodesCache = createCache('Episodes');
const fetchAnimeEmbeddedEpisodesCache = createCache('Video Embedded Sources');
const videoSourcesCache = createCache('Video Sources');

// Fetch data from proxy with caching
// Function to fetch data from proxy with caching
async function fetchFromProxy(url: string, cache: any, cacheKey: string) {
    try {
        // Attempt to retrieve the cached response using the cacheKey
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            return cachedResponse; // Return the cached response if available
        }

        // Adjust request parameters based on PROXY_URL's availability
        const requestConfig = PROXY_URL
            ? { params: { url } } // If PROXY_URL is defined, send the original URL as a parameter
            : {}; // If PROXY_URL is not defined, make a direct request

        // Proceed with the network request
        const response = await axiosInstance.get(PROXY_URL ? '' : url, requestConfig);

        // After obtaining the response, verify it for errors or empty data
        if (
            response.status !== 200 ||
            (response.data.statusCode && response.data.statusCode >= 400)
        ) {
            const errorMessage = response.data.message || 'Unknown server error';
            throw new Error(
                `Server error: ${response.data.statusCode || response.status
                } ${errorMessage}`,
            );
        }

        // Assuming response data is valid, store it in the cache
        cache.set(cacheKey, response.data);

        return response.data; // Return the newly fetched data
    } catch (error) {
        handleError(error, 'data');
        throw error; // Rethrow the error for the caller to handle
    }
}

// function to get new episode id 
function parseEpisodeId(input: string) {
    const parts = input.split('$');
    if (parts.length < 3 || !parts[0] || !parts[2]) {
        return {
            episodeId: input,
            type: undefined,
        };
    }

    const [seriesId, , number, type] = parts;
    return {
        episodeId: `${seriesId}::ep=${number}`,
        type,
    };
}

function normalizeAnimeInfoResponse(response: any) {
    const payload = response?.data || response;

    const normalizedEpisodes =
        payload?.episodesList ||
        payload?.episodeList ||
        payload?.episodes ||
        [];

    const normalizedNextAiring = payload?.nextAiringEpisode
        ? {
            ...payload.nextAiringEpisode,
            // Keep legacy key used by watch page countdown logic.
            airingTime:
                payload.nextAiringEpisode.airingTime ||
                payload.nextAiringEpisode.airingAt ||
                null,
        }
        : null;

    return {
        ...payload,
        malId: payload?.malId || payload?.idMal,
        image:
            payload?.image ||
            payload?.coverImage?.large ||
            payload?.coverImage?.extraLarge ||
            payload?.coverImage?.medium ||
            null,
        cover:
            payload?.cover ||
            payload?.bannerImage ||
            payload?.coverImage?.extraLarge ||
            payload?.coverImage?.large ||
            null,
        episodes: normalizedEpisodes,
        episodeList: normalizedEpisodes,
        episodesList: normalizedEpisodes,
        nextAiringEpisode: normalizedNextAiring,
    };
}

function normalizeStreamingResponse(payload: any, fallbackServer: string, category: string) {
    const data = payload?.data || payload?.result || payload;

    const sources = Array.isArray(data?.sources) ? data.sources : [];
    const subtitles = Array.isArray(data?.subtitles) ? data.subtitles : [];
    const tracks = Array.isArray(data?.tracks) ? data.tracks : [];
    const mergedTracks = [...tracks, ...subtitles].filter(Boolean);

    const streamLink =
        data?.link?.file ||
        data?.link ||
        data?.source?.file ||
        data?.source?.url ||
        sources?.[0]?.file ||
        sources?.[0]?.url ||
        null;

    const linkType =
        data?.link?.type ||
        data?.source?.type ||
        sources?.[0]?.type ||
        (sources?.[0]?.isM3U8 ? 'hls' : null) ||
        (typeof streamLink === 'string' && streamLink.includes('.m3u8') ? 'hls' : null);

    return {
        success: !!streamLink,
        data: {
            id: data?.id || null,
            type: data?.category || category,
            link: streamLink,
            linkType,
            headers: data?.headers || {},
            sources,
            subtitles,
            tracks: mergedTracks,
            intro: data?.intro || null,
            outro: data?.outro || null,
            server: data?.server || fallbackServer,
        },
    };
}

// Function to fetch anime data
export async function fetchAdvancedSearch(
    searchQuery: string = '',
    page: number = 1,
    perPage: number = 20,
    options: FetchOptions = {},
) {
    const queryParams = new URLSearchParams({
        ...(searchQuery && { query: searchQuery }),
        page: page.toString(),
        perPage: perPage.toString(),
        type: options.type ?? 'ANIME',
        ...(options.season && { season: options.season }),
        ...(options.format && { format: options.format }),
        ...(options.id && { id: options.id }),
        ...(options.year && { year: options.year }),
        ...(options.status && { status: options.status }),
        ...(options.sort && { sort: JSON.stringify(options.sort) }),
    });

    if (options.genres && options.genres.length > 0) {
        // Correctly encode genres as a JSON array
        queryParams.set('genres', JSON.stringify(options.genres));
    }
    const url = `${BASE_URL}meta/anilist/advanced-search?${queryParams.toString()}`;
    const cacheKey = generateCacheKey('advancedSearch', queryParams.toString());

    return fetchFromProxy(url, advancedSearchCache, cacheKey);
}

// Fetch Anime DATA Function
export async function fetchAnimeData(
    animeId: string,
    provider: string = 'gogoanime',
) {
    const params = new URLSearchParams({ provider });
    const url = `${BASE_URL}meta/anilist/data/${animeId}?${params.toString()}`;
    const cacheKey = generateCacheKey('animeData', animeId, provider);

    return fetchFromProxy(url, animeDataCache, cacheKey);
}

// Fetch Anime INFO Function
export async function fetchAnimeInfo(
    animeId: string,
    provider: string = 'zoro',
) {
    const url = `${CF_BACKEND_URL}anime/info/${animeId}`;
    const cacheKey = generateCacheKey('animeInfo', animeId, provider, 'cf');

    const response = await fetchFromProxy(url, animeInfoCache, cacheKey);
    return normalizeAnimeInfoResponse(response);
}

// Function to fetch list of anime based on type (TopRated, Trending, Popular)
async function fetchList(
    type: string,
    page: number = 1,
    perPage: number = 16,
    options: FetchOptions = {},
) {
    let cacheKey: string;
    let url: string;
    const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
    });

    if (
        ['TopRated', 'Trending', 'Popular', 'TopAiring', 'Upcoming'].includes(type)
    ) {
        cacheKey = generateCacheKey(
            `${type}Anime`,
            page.toString(),
            perPage.toString(),
        );
        url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`;

        if (type === 'TopRated') {
            options = {
                type: 'ANIME',
                sort: ['["SCORE_DESC"]'],
            };
            url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`;
        } else if (type === 'Popular') {
            options = {
                type: 'ANIME',
                sort: ['["POPULARITY_DESC"]'],
            };
            url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`;
        } else if (type === 'Upcoming') {
            const season = getNextSeason(); // This will set the season based on the current month
            options = {
                type: 'ANIME',
                season: season,
                year: year.toString(),
                status: 'NOT_YET_RELEASED',
                sort: ['["POPULARITY_DESC"]'],
            };
            url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`;
        } else if (type === 'TopAiring') {
            const season = getCurrentSeason(); // This will set the season based on the current month
            options = {
                type: 'ANIME',
                season: season,
                year: year.toString(),
                status: 'RELEASING',
                sort: ['["POPULARITY_DESC"]'],
            };
            url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`;
        }
    } else {
        cacheKey = generateCacheKey(
            `${type}Anime`,
            page.toString(),
            perPage.toString(),
        );
        url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`;
        // params already defined above
    }

    const specificCache = createCache(`${type}`);
    return fetchFromProxy(`${url}?${params.toString()}`, specificCache, cacheKey);
}

// Functions to fetch top, trending, and popular anime
export const fetchTopAnime = (page: number, perPage: number) =>
    fetchList('TopRated', page, perPage);
export const fetchTrendingAnime = (page: number, perPage: number) =>
    fetchList('Trending', page, perPage);
export const fetchPopularAnime = (page: number, perPage: number) =>
    fetchList('Popular', page, perPage);
export const fetchTopAiringAnime = (page: number, perPage: number) =>
    fetchList('TopAiring', page, perPage);
export const fetchUpcomingSeasons = (page: number, perPage: number) =>
    fetchList('Upcoming', page, perPage);

// Fetch Anime Episodes Function
export async function fetchAnimeEpisodes(
    animeId: string,
    provider: string = 'gogoanime',
    dub: boolean = false,
) {
    const url = `${CF_BACKEND_URL}anime/info/${animeId}`;
    const cacheKey = generateCacheKey(
        'animeEpisodes',
        animeId,
        provider,
        dub ? 'dub' : 'sub',
        'cf',
    );

    const response = await fetchFromProxy(url, animeEpisodesCache, cacheKey);
    const normalized = normalizeAnimeInfoResponse(response);
    return normalized?.episodes || normalized?.episodeList || normalized?.episodesList || [];
}

// Fetch Embedded Anime Episodes Servers
export async function fetchAnimeEmbeddedEpisodes(episodeId: string, episodeNumberId?: string) {
    const params = new URLSearchParams();

    let normalizedEpisodeId = episodeId;
    if (episodeId.includes('?ep=')) {
        const [baseEpisodeId, embeddedEpId] = episodeId.split('?ep=');
        normalizedEpisodeId = baseEpisodeId;
        if (!episodeNumberId && embeddedEpId) {
            params.set('ep', embeddedEpId);
        }
    }

    if (episodeNumberId) {
        params.set('ep', episodeNumberId);
    }

    const suffix = params.toString() ? `?${params.toString()}` : '';
    const url = `${CF_BACKEND_URL}anime/servers/${encodeURIComponent(normalizedEpisodeId)}${suffix}`;
    const cacheKey = generateCacheKey('animeEmbeddedServers', normalizedEpisodeId, episodeNumberId || '');

    const response = await fetchFromProxy(url, fetchAnimeEmbeddedEpisodesCache, cacheKey);
    return mapEpisodeSourceServers(response);
}

// Function to fetch anime streaming links
export async function fetchAnimeStreamingLinks(
    episodeId: string,
    serverName: string = 'hd-1',
    type: string
) {
    const parsedEpisodeId = parseEpisodeId(episodeId).episodeId;
    const candidateEpisodeIds = Array.from(new Set([episodeId, parsedEpisodeId]));
    const preferredServer = normalizeServerName(serverName);
    const category = (type || 'sub').toLowerCase();

    try {
        for (const candidateEpisodeId of candidateEpisodeIds) {
            const embeddedServers = await fetchAnimeEmbeddedEpisodes(candidateEpisodeId);
            const resolvedServer = resolveStreamingServerFromSources(
                embeddedServers,
                category,
                preferredServer,
            );

            const url = `${CF_BACKEND_URL}anime/sources?episodeId=${encodeURIComponent(candidateEpisodeId)}&server=${encodeURIComponent(resolvedServer)}&category=${encodeURIComponent(category)}`;
            const response = await axios.get(url, { headers: { Accept: '*/*' } });
            const normalized = normalizeStreamingResponse(response.data, resolvedServer, category);

            if (normalized.success) {
                return normalized;
            }
        }

        return { success: false, data: null };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: axios.isAxiosError(error) ? error.message : "Unknown error"
        };
    }
}

// Function to fetch skip times for an anime episode
interface FetchSkipTimesParams {
    malId: string;
    episodeNumber: string;
    episodeLength?: string;
}

// Function to fetch skip times for an anime episode
export async function fetchSkipTimes({
    malId,
    episodeNumber,
    episodeLength = '0',
}: FetchSkipTimesParams) {
    // Constructing the URL with query parameters
    const types = ['ed', 'mixed-ed', 'mixed-op', 'op', 'recap'];
    const url = new URL(`${SKIP_TIMES}v2/skip-times/${malId}/${episodeNumber}`);
    url.searchParams.append('episodeLength', episodeLength.toString());
    types.forEach((type) => url.searchParams.append('types[]', type));

    const cacheKey = generateCacheKey(
        'skipTimes',
        malId,
        episodeNumber,
        episodeLength || '',
    );

    // Use the fetchFromProxy function to make the request and handle caching
    return fetchFromProxy(url.toString(), createCache('SkipTimes'), cacheKey);
}

// Fetch Recent Anime Episodes Function
export async function fetchRecentEpisodes(
    page: number = 1,
    perPage: number = 18,
    provider: string = 'gogoanime',
) {
    // Construct the URL with query parameters for fetching recent episodes
    const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        provider: provider, // Default to 'gogoanime' if no provider is specified
    });

    // Using the BASE_URL defined at the top of your file
    const url = `${BASE_URL}meta/anilist/recent-episodes?${params.toString()}`;
    const cacheKey = generateCacheKey(
        'recentEpisodes',
        page.toString(),
        perPage.toString(),
        provider,
    );

    // Utilize the existing fetchFromProxy function to handle the request and caching logic
    return fetchFromProxy(url, createCache('RecentEpisodes'), cacheKey);
}