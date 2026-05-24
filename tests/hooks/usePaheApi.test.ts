import { test, expect } from 'bun:test';
import { encodePaheSessions, fetchPaheEpisodes, pickPaheSource } from '@/hooks/usePaheApi';

test('encodePaheSessions base64 encodes both sessions', () => {
  expect(encodePaheSessions('anime-session', 'episode-session')).toBe(
    'YW5pbWUtc2Vzc2lvbjo6ZXBpc29kZS1zZXNzaW9u',
  );
});

test('pickPaheSource prefers the requested language and highest resolution', () => {
  const selected = pickPaheSource(
    {
      animeSession: 'anime-session',
      episodeSession: 'episode-session',
      play: {
        sources: [
          { url: 'https://example.com/sub-360.m3u8', resolution: '360', isDub: false },
          { url: 'https://example.com/sub-1080.m3u8', resolution: '1080', isDub: false },
          { url: 'https://example.com/dub-720.m3u8', resolution: '720', isDub: true },
        ],
      },
    },
    'sub',
  );

  expect(selected?.url).toBe('https://example.com/sub-1080.m3u8');
});

test('fetchPaheEpisodes maps Jikan episodes into the existing episode shape', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => ({
    ok: true,
    json: async () => ({
      pagination: {
        last_visible_page: 1,
        has_next_page: false,
      },
      data: [
        {
          mal_id: 1,
          title: 'You Aren\'t E-Rank, Are You?',
          url: 'https://example.com/episode/1',
        },
      ],
    }),
  })) as typeof fetch;

  try {
    const response = await fetchPaheEpisodes(58567);

    expect(response.session).toBe('58567');
    expect(response.episodes).toHaveLength(1);
    expect(response.episodes[0].episode).toBe(1);
    expect(response.episodes[0].title).toBe('You Aren\'t E-Rank, Are You?');
  } finally {
    globalThis.fetch = originalFetch;
  }
});