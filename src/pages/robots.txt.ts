import type { APIRoute } from "astro";

// NOTE: We intentionally do NOT Disallow /_astro/. That directory holds hashed
// build assets including post cover images used for OG/Twitter cards. Blocking
// it provides no SEO benefit (these aren't pages) and breaks social previews,
// because crawlers like Twitterbot use a primitive robots parser that ignores
// wildcard `Allow` overrides and would refuse to fetch the card image.
const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
