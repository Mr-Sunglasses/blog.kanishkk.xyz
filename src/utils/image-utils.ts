import path from "node:path";

// Lazy importers for every asset under `src/`, used to resolve local images
// referenced by relative paths (e.g. a post's `./assets/images/cover.png`).
// The glob is relative to this file, so `../**` matches everything under `src/`.
// TODO temporary workaround for images dynamic import
// https://github.com/withastro/astro/issues/3373
const imageImports = import.meta.glob<ImageMetadata>("../**", {
	import: "default",
});

/**
 * Whether `src` refers to a local image bundled under `src/` (as opposed to a
 * remote URL, a `/public` path, or an inline data URI).
 */
export function isLocalImage(src: string): boolean {
	return !(
		src.startsWith("/") ||
		src.startsWith("http://") ||
		src.startsWith("https://") ||
		src.startsWith("data:")
	);
}

/**
 * Resolve a local image path to its `ImageMetadata` so it can be passed to
 * Astro's `<Image>` component or `getImage()`. Returns `undefined` (and logs)
 * when the file can't be found.
 *
 * @param src      The image path as written (e.g. `./assets/images/cover.png`).
 * @param basePath The directory `src` is relative to, rooted at `src/`
 *                 (e.g. `content/posts/my-post/`).
 */
export async function getLocalImage(
	src: string,
	basePath = "/",
): Promise<ImageMetadata | undefined> {
	const normalizedPath = path
		.normalize(path.join("../", basePath, src))
		.replace(/\\/g, "/");
	const file = imageImports[normalizedPath];
	if (!file) {
		console.error(
			`\n[ERROR] Image file not found: ${normalizedPath.replace("../", "src/")}`,
		);
		return undefined;
	}
	return await file();
}
