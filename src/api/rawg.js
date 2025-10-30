/* RAWG API helper
 * Provides: searchGames, getGameDetails, getScreenshots
 * Uses process.env.REACT_APP_RAWG_API_KEY for the API key.
 */

const BASE_URL = 'https://api.rawg.io/api';

const ensureApiKey = () => {
	const key = process.env.REACT_APP_RAWG_API_KEY;
	if (!key) throw new Error('Missing RAWG API key. Set REACT_APP_RAWG_API_KEY in .env');
	return key;
};

const buildUrl = (path, params = {}) => {
	const key = ensureApiKey();
	const url = new URL(`${BASE_URL}${path}`);
	// attach provided params
	Object.keys(params).forEach((k) => {
		const v = params[k];
		if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, v);
	});
	url.searchParams.append('key', key);
	return url.toString();
};

const normalizeGame = (g) => ({
	id: g.id,
	name: g.name || g.title || null,
	rating: typeof g.rating !== 'undefined' ? g.rating : null,
	released: g.released || null,
	background_image: g.background_image || null,
});

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_CACHE_SIZE = 100; // Maximum number of items in each cache

class TimedCache {
  constructor(maxSize = MAX_CACHE_SIZE) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  set(key, value) {
    // Remove oldest entry if we're at max size
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear() {
    this.cache.clear();
  }
}

// Initialize caches
const detailsCache = new TimedCache();
const screenshotsCache = new TimedCache();
const searchCache = new TimedCache(50); // Keep fewer search results

/**
 * Search games with optional filters.
 * @param {Object} options
 * @param {string} options.query
 * @param {string|Array<string|number>} options.platforms - either comma-separated ids or array of ids
 * @param {string} options.ordering - e.g. '-rating' or 'released'
 * @param {number} options.page
 * @param {number} options.page_size
 */
export async function searchGames({ query = '', platforms, ordering, page = 1, page_size = 20 } = {}) {
	try {
		const params = {
			search: query || undefined,
			ordering: ordering || undefined,
			page: page || undefined,
			page_size: page_size || undefined,
		};

		if (platforms) {
			if (Array.isArray(platforms)) params.platforms = platforms.join(',');
			else params.platforms = platforms;
		}

		// Create cache key from params
		const cacheKey = JSON.stringify({ query, platforms, ordering, page, page_size });
		
		// Check cache first
		const cachedResult = searchCache.get(cacheKey);
		if (cachedResult) {
			return cachedResult;
		}

		const url = buildUrl('/games', params);
		const res = await fetch(url);
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`RAWG search failed: ${res.status} ${res.statusText} - ${text}`);
		}
		const data = await res.json();

		const results = Array.isArray(data.results) ? data.results.map(normalizeGame) : [];
		const response = {
			count: data.count || results.length,
			next: data.next || null,
			previous: data.previous || null,
			results,
		};

		// Cache the response
		searchCache.set(cacheKey, response);

		return response;
	} catch (err) {
		// rethrow so the caller can handle
		throw err;
	}
}

/**
 * Get game details (cached).
 * Returns normalized object containing at least id, name, rating, released, background_image
 */
export async function getGameDetails(gameId) {
	if (!gameId) throw new Error('gameId is required');
	if (detailsCache.has(gameId)) return detailsCache.get(gameId);

	try {
		const url = buildUrl(`/games/${encodeURIComponent(gameId)}`);
		const res = await fetch(url);
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`RAWG getGameDetails failed: ${res.status} ${res.statusText} - ${text}`);
		}
		const data = await res.json();

		const normalized = {
			id: data.id,
			name: data.name || null,
			rating: typeof data.rating !== 'undefined' ? data.rating : null,
			released: data.released || null,
			background_image: data.background_image || null,
			description: data.description || data.description_raw || null,
			genres: Array.isArray(data.genres) ? data.genres.map((g) => g.name) : [],
			website: data.website || null,
			developers: Array.isArray(data.developers) ? data.developers.map((d) => d.name) : [],
			publishers: Array.isArray(data.publishers) ? data.publishers.map((p) => p.name) : [],
		};

		detailsCache.set(gameId, normalized);
		return normalized;
	} catch (err) {
		throw err;
	}
}

/**
 * Get screenshots for a game (cached). Returns array of image URLs.
 */
export async function getScreenshots(gameId) {
	if (!gameId) throw new Error('gameId is required');
	if (screenshotsCache.has(gameId)) return screenshotsCache.get(gameId);

	try {
		const url = buildUrl(`/games/${encodeURIComponent(gameId)}/screenshots`);
		const res = await fetch(url);
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`RAWG getScreenshots failed: ${res.status} ${res.statusText} - ${text}`);
		}
		const data = await res.json();
		const results = Array.isArray(data.results)
			? data.results.map((s) => ({ id: s.id, image: s.image }))
			: [];

		const images = results.map((r) => r.image).filter(Boolean);
		screenshotsCache.set(gameId, images);
		return images;
	} catch (err) {
		throw err;
	}
}

export function clearRawgCache() {
	detailsCache.clear();
	screenshotsCache.clear();
	searchCache.clear();
}

const rawg = {
	searchGames,
	getGameDetails,
	getScreenshots,
	clearRawgCache,
};

export default rawg;

