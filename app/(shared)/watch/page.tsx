import Link from "next/link";

const featuredLinks = [
  { href: "/home", label: "Explore Home" },
  { href: "/trending", label: "Trending Anime" },
  { href: "/search", label: "Search Anime" },
  { href: "/chat", label: "HLS Anime Chat" },
];

export default function WatchHubPage() {
  return (
    <main className="min-h-screen px-4 py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Watch Hub
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Watch anime on Anveshna.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Use this hub to discover anime, jump into episode pages, continue
            playback, and move between trending titles, search, chat, and AI
            recommendation of anime.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featuredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-border/60 bg-background/70 px-5 py-4 text-lg font-medium transition hover:border-primary/60 hover:bg-background"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="rounded-2xl bg-muted/40 p-5 text-sm leading-6 text-muted-foreground">
          Popular intent terms covered here: anime anveshna streaming dev
          shakya akshita srivastava github anveshna, hls anime chat, and AI
          recommendation of anime.
        </div>
      </div>
    </main>
  );
}
