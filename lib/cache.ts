import { unstable_cache } from 'next/cache';

// Cache tag sabitleri
export const CACHE_TAGS = {
  POSTS: 'posts',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  POST_DETAIL: 'post-detail',
} as const;

// Cache süreleri (saniye)
export const CACHE_TIMES = {
  SHORT: 60,        // 1 dakika
  MEDIUM: 300,      // 5 dakika
  LONG: 3600,       // 1 saat
  VERY_LONG: 86400, // 24 saat
} as const;

// Cache wrapper fonksiyonu
export function createCachedFunction<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  keyParts: string[],
  options: {
    revalidate?: number;
    tags?: string[];
  } = {}
): T {
  return unstable_cache(
    fn,
    keyParts,
    {
      revalidate: options.revalidate ?? CACHE_TIMES.MEDIUM,
      tags: options.tags ?? [],
    }
  ) as unknown as T;
}

