import type { Metadata } from "next";
import TrendingAnimePage from "@/components/trending/TrendingAnimePage";

export const metadata: Metadata = {
  title: "Trending Anime",
  description:
    "Browse currently trending anime titles by season and year on Anveshna.",
  alternates: {
    canonical: "/trending",
  },
  openGraph: {
    title: "Trending Anime",
    description:
      "Browse currently trending anime titles by season and year on Anveshna.",
    url: "/trending",
    type: "website",
  },
};

export default function TrendingPage() {
  return <TrendingAnimePage />;
}
