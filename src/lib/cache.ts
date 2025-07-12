/**
 * Cache strategies for different types of database operations
 * TTL values are in seconds
 */
export const cacheStrategies = {
  // Quick data that changes frequently
  short: { ttl: 60 }, // 1 minute

  // Standard caching for most read operations
  medium: { ttl: 300 }, // 5 minutes

  // Long-term caching for rarely changing data
  long: { ttl: 1800 }, // 30 minutes

  // Very long caching for static-like data
  static: { ttl: 3600 }, // 1 hour

  // Specific use cases
  opening: { ttl: 600 }, // 10 minutes - chess openings don't change often
  count: { ttl: 120 }, // 2 minutes - counts can change more frequently
  sync: { ttl: 30 }, // 30 seconds - sync operations need fresh data
} as const;

/**
 * Cache tags for grouping related cache entries
 */
export const cacheTags = {
  openings: "openings",
  users: "users",
  games: "games",
} as const;

/**
 * Helper function to get cache strategy by name
 */
export const getCacheStrategy = (strategy: keyof typeof cacheStrategies) => {
  return cacheStrategies[strategy];
};

/**
 * Helper function to create cache strategy with custom TTL
 */
export const createCacheStrategy = (ttl: number, tags?: string[]) => {
  const strategy: { ttl: number; tags?: string[] } = { ttl };
  if (tags) {
    strategy.tags = tags;
  }
  return strategy;
};

/**
 * Predefined cache strategies with tags for specific models
 */
export const modelCacheStrategies = {
  opening: {
    list: createCacheStrategy(600, [cacheTags.openings]), // 10 minutes for opening lists
    detail: createCacheStrategy(1800, [cacheTags.openings]), // 30 minutes for opening details
    count: createCacheStrategy(300, [cacheTags.openings]), // 5 minutes for counts
  },
  user: {
    profile: createCacheStrategy(300, [cacheTags.users]), // 5 minutes for user profiles
    list: createCacheStrategy(120, [cacheTags.users]), // 2 minutes for user lists
  },
  game: {
    recent: createCacheStrategy(60, [cacheTags.games]), // 1 minute for recent games
    history: createCacheStrategy(600, [cacheTags.games]), // 10 minutes for game history
  },
} as const;
