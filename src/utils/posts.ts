import { getCollection } from 'astro:content';
import readingTime from 'reading-time';
import type { CollectionEntry } from 'astro:content';

/**
 * Format a Date object into a string (e.g. "January 1, 2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get the estimated reading time of a post body
 */
export function getReadingTime(body: string): string {
  return readingTime(body || '').text;
}

/**
 * Get all published posts (excluding drafts), sorted by date (newest first)
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts');
  
  return allPosts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
