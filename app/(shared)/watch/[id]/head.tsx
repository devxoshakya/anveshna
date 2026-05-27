const siteUrl = "https://anveshna.devxoshakya.xyz";

function ensureUrlEndsWithSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export default async function Head({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = ensureUrlEndsWithSlash(
    process.env.NEXT_PUBLIC_BACKEND_URL || "",
  );

  let title = `Watch Anime ${id} | Anveshna`;
  let description =
    "Watch anime on Anveshna with episode playback, related titles, and AI-powered discovery.";

  try {
    const response = await fetch(
      `${baseUrl}meta/anilist/data/${id}?provider=gogoanime`,
      { next: { revalidate: 3600 } },
    );

    if (response.ok) {
      const animeData = await response.json();
      const animeTitle =
        animeData?.title?.english ||
        animeData?.title?.romaji ||
        animeData?.title?.userPreferred ||
        id;
      const rawDescription =
        animeData?.description ||
        `Watch ${animeTitle} on Anveshna with related anime discovery and episode playback.`;

      title = `${animeTitle} Watch Page | Anveshna`;
      description = truncate(rawDescription.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), 160);
    }
  } catch {
    // Fall back to generic metadata when the backend is unavailable.
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/watch/${id}`} />
    </>
  );
}