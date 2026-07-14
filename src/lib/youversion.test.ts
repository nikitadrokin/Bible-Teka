import { describe, expect, it } from 'vitest';
import type { BibleBookSelection } from '@/types/bible';
import { getUsfmChapter, getYouVersionChapterUrl } from './youversion';

const mockSelection = (
  bookId: number,
  chapter: number,
): BibleBookSelection => ({
  book: { id: bookId, name: 'Mock', chapters: 99 },
  chapter,
});

describe('getYouVersionChapterUrl', () => {
  it('returns a formatted YouVersion URL for known books', () => {
    expect(getYouVersionChapterUrl(mockSelection(39, 3))).toBe(
      'https://www.bible.com/bible/400/MAT.3.SYNO',
    );
  });

  it('uses the provided version for the URL', () => {
    expect(
      getYouVersionChapterUrl(mockSelection(0, 1), {
        id: 167,
        abbreviation: 'СИНОД',
      }),
    ).toBe('https://www.bible.com/bible/167/GEN.1.СИНОД');
  });

  it('returns null when selection is incomplete', () => {
    expect(
      getYouVersionChapterUrl({ book: null, chapter: null }),
    ).toBeNull();
  });

  it('returns null when an unknown book id is provided', () => {
    expect(
      getYouVersionChapterUrl(
        { book: { id: 100, name: 'Unknown', chapters: 1 }, chapter: 1 },
      ),
    ).toBeNull();
  });
});

describe('getUsfmChapter', () => {
  it('returns a USFM chapter reference for known books', () => {
    expect(getUsfmChapter(mockSelection(39, 3))).toBe('MAT.3');
    expect(getUsfmChapter(mockSelection(0, 1))).toBe('GEN.1');
  });

  it('returns null when selection is incomplete', () => {
    expect(getUsfmChapter({ book: null, chapter: null })).toBeNull();
  });
});
