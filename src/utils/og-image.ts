import path from "node:path";

// Eagerly-globbed map of every local image under /src, used to turn a post's
// relative cover path (e.g. "./assets/images/freedom.jpg") into the hashed
// asset URL that Astro emits at build time.
const imageImports = import.meta.glob<{ default: ImageMetadata }>(
	"/src/**/*.{jpeg,jpg,png,gif,webp,avif,JPEG,JPG,PNG,GIF,WEBP,AVIF}",
);

/**
 * Resolve a cover image reference into an absolute URL suitable for an
 * OpenGraph/Twitter `image` meta tag.
 *
 * - External (`http(s)://`) and `data:` URLs are returned as-is.
 * - Public paths (starting with `/`) are resolved against the site origin.
 * - Local imported assets (relative paths) are looked up in the image glob and
 *   resolved to their built, hashed URL against the site origin.
 *
 * Returns `undefined` when there's no image or it can't be resolved, so callers
 * can fall back to the site-wide default OG image.
 */
export async function resolveOgImageUrl(
	src: string | undefined,
	basePath: string,
	site: URL | undefined,
): Promise<string | undefined> {
	if (!src) return undefined;

	if (/^https?:\/\//.test(src) || src.startsWith("data:")) {
		return src;
	}

	if (src.startsWith("/")) {
		return site ? new URL(src, site).href : src;
	}

	const normalizedPath = path
		.normalize(path.join("/src", basePath, src))
		.replace(/\\/g, "/");

	const mod = imageImports[normalizedPath];
	if (!mod) {
		console.error(
			`\n[OG] Cover image not found: ${normalizedPath.replace("/src", "src")}`,
		);
		return undefined;
	}

	const metadata = (await mod()).default;
	return site ? new URL(metadata.src, site).href : metadata.src;
}
