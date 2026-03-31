import type { BibleBook, BibleBookSelection } from '@/types/bible';
import { padNumber } from '@/lib/utils';

export function getAudioUrl(bookId: number, chapter: number): string {
  const bookNum = padNumber(bookId + 1);
  const chapterNum = padNumber(chapter);

  return `/api/audio/${bookNum}/${chapterNum}.mp3`;
}

export function getAudioUrlForSelection(
  selection: BibleBookSelection,
): string | null {
  if (!selection.book || !selection.chapter) {
    return null;
  }

  return getAudioUrl(selection.book.id, selection.chapter);
}

export function getNextBibleSelection(
  selection: BibleBookSelection,
  books: BibleBook[],
): BibleBookSelection | null {
  if (!selection.book || !selection.chapter || books.length === 0) {
    return null;
  }

  if (selection.chapter < selection.book.chapters) {
    return {
      book: selection.book,
      chapter: selection.chapter + 1,
    };
  }

  const nextBook =
    books.find((book) => book.id === selection.book!.id + 1) ?? books[0];

  return {
    book: nextBook ?? null,
    chapter: nextBook ? 1 : null,
  };
}
