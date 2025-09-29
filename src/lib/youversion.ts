import type { BibleBookSelection } from '@/types/bible';
import type { Locale } from '@/store/locale-store';

const YOUVERSION_BOOK_CODES = [
  'GEN',
  'EXO',
  'LEV',
  'NUM',
  'DEU',
  'JOS',
  'JDG',
  'RUT',
  '1SA',
  '2SA',
  '1KI',
  '2KI',
  '1CH',
  '2CH',
  'EZR',
  'NEH',
  'EST',
  'JOB',
  'PSA',
  'PRO',
  'ECC',
  'SNG',
  'ISA',
  'JER',
  'LAM',
  'EZK',
  'DAN',
  'HOS',
  'JOL',
  'AMO',
  'OBA',
  'JON',
  'MIC',
  'NAM',
  'HAB',
  'ZEP',
  'HAG',
  'ZEC',
  'MAL',
  'MAT',
  'MRK',
  'LUK',
  'JHN',
  'ACT',
  'ROM',
  '1CO',
  '2CO',
  'GAL',
  'EPH',
  'PHP',
  'COL',
  '1TH',
  '2TH',
  '1TI',
  '2TI',
  'TIT',
  'PHM',
  'HEB',
  'JAS',
  '1PE',
  '2PE',
  '1JN',
  '2JN',
  '3JN',
  'JUD',
  'REV',
] as const;

const YOUVERSION_LOCALE_CONFIG: Record<
  Locale,
  { versionId: string; translation: string }
> = {
  en: { versionId: '59', translation: 'NIV' },
  ru: { versionId: '400', translation: 'RUSV' },
};

export function getYouVersionChapterUrl(
  selection: BibleBookSelection,
  locale: Locale,
): string | null {
  if (!selection.book || !selection.chapter) {
    return null;
  }

  const bookCode = YOUVERSION_BOOK_CODES[selection.book.id];
  if (!bookCode) {
    return null;
  }

  const { versionId, translation } =
    YOUVERSION_LOCALE_CONFIG[locale] ?? YOUVERSION_LOCALE_CONFIG.ru;

  return `https://www.bible.com/bible/${versionId}/${bookCode}.${selection.chapter}.${translation}`;
}
