import { describe, expect, it } from 'vitest';
import type { BibleBook, BibleBookSelection } from '@/types/bible';
import {
  getAudioUrl,
  getAudioUrlForSelection,
  getNextBibleSelection,
} from './audio';

const books: BibleBook[] = [
  { id: 0, name: 'Genesis', chapters: 50 },
  { id: 1, name: 'Exodus', chapters: 40 },
  { id: 2, name: 'Leviticus', chapters: 27 },
];

const selection = (
  book: BibleBook | null,
  chapter: number | null,
): BibleBookSelection => ({
  book,
  chapter,
});

describe('audio helpers', () => {
  it('builds a chapter audio URL', () => {
    expect(getAudioUrl(0, 1)).toBe('/api/audio/01/01.mp3');
    expect(getAudioUrl(39, 12)).toBe('/api/audio/40/12.mp3');
  });

  it('returns null for incomplete selections', () => {
    expect(getAudioUrlForSelection(selection(null, null))).toBeNull();
  });

  it('returns the next chapter in the same book when available', () => {
    expect(
      getNextBibleSelection(selection(books[0], 12), books),
    ).toEqual(selection(books[0], 13));
  });

  it('advances to the next book when the current book ends', () => {
    expect(
      getNextBibleSelection(selection(books[0], 50), books),
    ).toEqual(selection(books[1], 1));
  });

  it('wraps back to the first book after the last book', () => {
    expect(
      getNextBibleSelection(selection(books[2], 27), books),
    ).toEqual(selection(books[0], 1));
  });
});
