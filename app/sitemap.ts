import type { MetadataRoute } from "next";

const siteUrl = "https://anveshna.devxoshakya.xyz";

const routes = [
  { url: "/", priority: 1, changeFrequency: "weekly" as const },
  { url: "/home", priority: 0.95, changeFrequency: "weekly" as const },
  { url: "/search", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/chat", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/history", priority: 0.5, changeFrequency: "daily" as const },
  { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/trending", priority: 0.8, changeFrequency: "daily" as const },
  { url: "/watch", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/dmca-policy", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.url}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}