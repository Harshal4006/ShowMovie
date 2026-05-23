const cache = new Map();
const DEFAULT_TTL = 30000;
const MAX_ENTRIES = 100;

const evictIfNeeded = () => {
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
};

const isExpired = (entry) => Date.now() > entry.expiry;

export const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (isExpired(entry)) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

export const setCache = (key, data, ttl = DEFAULT_TTL) => {
  evictIfNeeded();
  cache.set(key, { data, expiry: Date.now() + ttl });
};

export const clearCache = (pattern) => {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
};
