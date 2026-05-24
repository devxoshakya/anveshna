"use client";

import { useEffect, useMemo, useState } from "react";

const PAHE_API_URL = ensureUrlEndsWithSlash(
  process.env.NEXT_PUBLIC_PAHE_API_URL || "",
);

function ensureUrlEndsWithSlash(url: string): string {
  if (!url) return "";
  return url.endsWith("/") ? url : `${url}/`;
}

export type PaheEpisode = {
  id: number;
  episode: number;
  session: string;
  link?: string;
  duration?: string;
  audio?: string;
  snapshot?: string;
  title?: string;
};

export type PaheEpisodeListResponse = {
  anilistId: number;
  paheId: number;
  session: string;
  type: string;
  title: string;
  episodes: PaheEpisode[];
};

export type PaheSource = {
  url?: string;
  isM3U8?: boolean;
  filename?: string;
  embed?: string;
  resolution?: string;
  isDub?: boolean;
  fanSub?: string;
};

export type PaheSourceResponse = {
  animeSession: string;
  episodeSession: string;
  play?: {
    session?: string;
    provider?: string;
    episode?: string;
    anime_title?: string;
    sources?: PaheSource[];
    downloads?: unknown[];
  };
};

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function encodePaheSessions(animeSession: string, episodeSession: string) {
  const payload = `${animeSession}::${episodeSession}`;

  if (typeof btoa === "function") {
    return btoa(payload);
  }

  return Buffer.from(payload, "utf-8").toString("base64");
}

function normalizePaheSourceResponse(payload: any): PaheSourceResponse | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  return payload as PaheSourceResponse;
}

function getSourceResolution(source?: PaheSource | null) {
  return Number.parseInt(source?.resolution || "0", 10) || 0;
}

type JikanEpisode = {
  mal_id: number;
  url?: string;
  title?: string;
  title_japanese?: string;
  title_romanji?: string;
  aired?: string;
  score?: number;
  filler?: boolean;
  recap?: boolean;
  forum_url?: string;
};

type JikanEpisodeResponse = {
  pagination?: {
    last_visible_page?: number;
    has_next_page?: boolean;
  };
  data?: JikanEpisode[];
};

function normalizeJikanEpisodes(payload: JikanEpisodeResponse, malId: string | number) {
  const episodes = Array.isArray(payload?.data) ? payload.data : [];

  return {
    anilistId: 0,
    paheId: Number.parseInt(String(malId), 10) || 0,
    session: String(malId),
    type: "anime",
    title: "",
    episodes: episodes.map((episode) => ({
      id: episode.mal_id,
      episode: episode.mal_id,
      session: String(episode.mal_id),
      link: episode.url,
      title: episode.title || episode.title_romanji || `Episode ${episode.mal_id}`,
    })),
  } satisfies PaheEpisodeListResponse;
}

async function fetchJikanEpisodePage(malId: string | number, page: number) {
  const response = await fetch(
    `https://api.jikan.moe/v4/anime/${encodeURIComponent(String(malId))}/episodes?page=${page}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load Jikan episodes (${response.status}).`);
  }

  return response.json() as Promise<JikanEpisodeResponse>;
}

async function fetchAllJikanEpisodes(malId: string | number) {
  const firstPage = await fetchJikanEpisodePage(malId, 1);
  const lastVisiblePage = firstPage.pagination?.last_visible_page || 1;

  if (lastVisiblePage <= 1) {
    return firstPage;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: lastVisiblePage - 1 }, (_, index) =>
      fetchJikanEpisodePage(malId, index + 2),
    ),
  );

  return {
    ...firstPage,
    data: [
      ...(firstPage.data || []),
      ...remainingPages.flatMap((page) => page.data || []),
    ],
  } satisfies JikanEpisodeResponse;
}

export function pickPaheSource(
  response: PaheSourceResponse | null,
  preferredLanguage: string = "sub",
) {
  const sources = Array.isArray(response?.play?.sources)
    ? response?.play?.sources
    : [];

  const preferredSources = sources.filter((source) => {
    if (preferredLanguage.toLowerCase() === "dub") {
      return !!source?.isDub;
    }

    return !source?.isDub;
  });

  const candidates = preferredSources.length > 0 ? preferredSources : sources;

  return candidates
    .slice()
    .sort((left, right) => getSourceResolution(right) - getSourceResolution(left))[0] || null;
}

export async function fetchPaheEpisodes(
  malId: string | number,
): Promise<PaheEpisodeListResponse> {
  const response = await fetchAllJikanEpisodes(malId);
  return normalizeJikanEpisodes(response, malId);
}

export async function fetchPaheSources(
  animeSession: string,
  episodeSession: string,
): Promise<PaheSourceResponse> {
  if (!PAHE_API_URL) {
    throw new Error("PAHE API URL is not configured.");
  }

  const encodedSessions = encodePaheSessions(animeSession, episodeSession);
  const response = await fetch(`${PAHE_API_URL}api/sources/${encodedSessions}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load PAHE sources (${response.status}).`);
  }

  return response.json();
}

export function usePaheEpisodes(anilistId?: string | number) {
  const [state, setState] = useState<FetchState<PaheEpisodeListResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!anilistId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let active = true;

    setState({ data: null, loading: true, error: null });

    fetchPaheEpisodes(anilistId)
      .then((data) => {
        if (!active) return;
        setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load PAHE episodes.",
        });
      });

    return () => {
      active = false;
    };
  }, [anilistId]);

  return state;
}

export function usePaheSources(
  animeSession?: string,
  episodeSession?: string,
  preferredLanguage: string = "sub",
) {
  const [state, setState] = useState<FetchState<PaheSourceResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const shouldLoad = Boolean(animeSession && episodeSession);

  useEffect(() => {
    if (!shouldLoad || !animeSession || !episodeSession) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let active = true;

    setState({ data: null, loading: true, error: null });

    fetchPaheSources(animeSession, episodeSession)
      .then((data) => {
        if (!active) return;
        setState({ data: normalizePaheSourceResponse(data), loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load PAHE sources.",
        });
      });

    return () => {
      active = false;
    };
  }, [animeSession, episodeSession, shouldLoad]);

  return {
    ...state,
    selectedSource: useMemo(
      () => pickPaheSource(state.data, preferredLanguage),
      [preferredLanguage, state.data],
    ),
  };
}