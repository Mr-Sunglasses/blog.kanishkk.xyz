import type { APIRoute } from "astro";

const robotsTxt = `
User-agent: *
Disallow: /_astro/
# Allow built image assets so social cards (OG/Twitter) can fetch cover images.
# A more specific Allow rule overrides the broader Disallow above.
Allow: /_astro/*.jpg
Allow: /_astro/*.jpeg
Allow: /_astro/*.png
Allow: /_astro/*.gif
Allow: /_astro/*.webp
Allow: /_astro/*.avif

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
