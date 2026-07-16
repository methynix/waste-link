import type { MetadataRoute } from "next";

const SITE_URL = "https://ecothynx.methynix.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private, per-user areas out of search results.
      disallow: ["/dashboard", "/verify", "/reset-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
