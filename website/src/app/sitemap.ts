import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    ...getAllDocs().map((d) => ({
      url: `${SITE.url}/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
