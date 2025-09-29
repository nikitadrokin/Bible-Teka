import { describe, expect, it } from 'vitest';
import type { BibleBookSelection } from '@/types/bible';
import { getYouVersionChapterUrl } from './youversion';

const mockSelection = (bookId: number, chapter: number): BibleBookSelection => ({
  book: { id: bookId, name: 'Mock', chapters: 99 },
  chapter,
});

describe('getYouVersionChapterUrl', () => {
  it('returns a formatted YouVersion URL for known books', () => {
    expect(getYouVersionChapterUrl(mockSelection(39, 3), 'en')).toBe(
      'https://www.bible.com/bible/111/MAT.3.NIV',
    );
  });

  it('falls back to English when locale configuration is missing', () => {
    // @ts-expect-error Testing fallback for an unsupported locale
    expect(getYouVersionChapterUrl(mockSelection(0, 1), 'es')).toBe(
      'https://www.bible.com/bible/111/GEN.1.NIV',
    );
  });

  it('returns null when selection is incomplete', () => {
    expect(getYouVersionChapterUrl({ book: null, chapter: null }, 'en')).toBeNull();
  });

  it('returns null when an unknown book id is provided', () => {
    expect(
      getYouVersionChapterUrl(
        { book: { id: 100, name: 'Unknown', chapters: 1 }, chapter: 1 },
        'en',
      ),
    ).toBeNull();
  });
});
