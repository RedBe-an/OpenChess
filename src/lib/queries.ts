/**
 * Example API functions demonstrating various Prisma Accelerate caching strategies
 */

import prisma from "@/lib/prisma";
import { modelCacheStrategies, createCacheStrategy } from "@/lib/cache";

/**
 * Get all openings with long-term caching
 */
export async function getAllOpenings() {
  return await prisma.opening.findMany({
    select: {
      eco: true,
      name: true,
      urlName: true,
      pgn: true,
    },
    orderBy: {
      eco: "asc",
    },
    cacheStrategy: modelCacheStrategies.opening.list,
  });
}

/**
 * Search openings by name with medium-term caching
 */
export async function searchOpenings(searchTerm: string) {
  return await prisma.opening.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    select: {
      eco: true,
      name: true,
      urlName: true,
    },
    take: 10,
    cacheStrategy: createCacheStrategy(180), // 3 minutes for search results
  });
}

/**
 * Get opening statistics with short-term caching
 */
export async function getOpeningStats() {
  const [totalCount, withMdxCount] = await Promise.all([
    prisma.opening.count({
      cacheStrategy: modelCacheStrategies.opening.count,
    }),
    prisma.opening.count({
      where: {
        mdx: {
          not: null,
        },
      },
      cacheStrategy: modelCacheStrategies.opening.count,
    }),
  ]);

  return {
    total: totalCount,
    withContent: withMdxCount,
    withoutContent: totalCount - withMdxCount,
  };
}

/**
 * Get popular openings (example of conditional caching)
 */
export async function getPopularOpenings(useCache: boolean = true) {
  const query = {
    take: 10,
    select: {
      eco: true,
      name: true,
      urlName: true,
    },
    orderBy: {
      name: "asc" as const,
    },
  };

  // Conditionally apply caching
  if (useCache) {
    return await prisma.opening.findMany({
      ...query,
      cacheStrategy: createCacheStrategy(900), // 15 minutes for popular content
    });
  } else {
    return await prisma.opening.findMany(query);
  }
}

/**
 * Example of cache invalidation pattern (would be used after updates)
 */
export async function updateOpeningContent(
  openingPgn: string,
  mdxPath: string,
) {
  // Update the record using pgn as the unique identifier
  const updated = await prisma.opening.update({
    where: { pgn: openingPgn },
    data: { mdx: mdxPath },
  });

  // Note: In a real application, you would also invalidate related cache entries
  // This is typically done through cache tags or by calling a cache invalidation API

  return updated;
}
