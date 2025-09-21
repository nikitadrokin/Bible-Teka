import type { BibleBookSelection } from '@/types/bible';
import type { Locale } from '@/store/locale-store';

const YOUVERSION_BOOK_CODES: Record<number, string> = {
  0: 'GEN',
  1: 'EXO',
  2: 'LEV',
  3: 'NUM',
  4: 'DEU',
  5: 'JOS',
  6: 'JDG',
  7: 'RUT',
  8: '1SA',
  9: '2SA',
  10: '1KI',
  11: '2KI',
  12: '1CH',
  13: '2CH',
  14: 'EZR',
  15: 'NEH',
  16: 'EST',
  17: 'JOB',
  18: 'PSA',
  19: 'PRO',
  20: 'ECC',
  21: 'SNG',
  22: 'ISA',
  23: 'JER',
  24: 'LAM',
  25: 'EZK',
  26: 'DAN',
  27: 'HOS',
  28: 'JOL',
  29: 'AMO',
  30: 'OBA',
  31: 'JON',
  32: 'MIC',
  33: 'NAM',
  34: 'HAB',
  35: 'ZEP',
  36: 'HAG',
  37: 'ZEC',
  38: 'MAL',
  39: 'MAT',
  40: 'MRK',
  41: 'LUK',
  42: 'JHN',
  43: 'ACT',
  44: 'JAS',
  45: '1PE',
  46: '2PE',
  47: '1JN',
  48: '2JN',
  49: '3JN',
  50: 'JUD',
  51: 'ROM',
  52: '1CO',
  53: '2CO',
  54: 'GAL',
  55: 'EPH',
  56: 'PHP',
  57: 'COL',
  58: '1TH',
  59: '2TH',
  60: '1TI',
  61: '2TI',
  62: 'TIT',
  63: 'PHM',
  64: 'HEB',
  65: 'REV',
};

const YOUVERSION_LOCALE_CONFIG: Record<Locale, { versionId: string; translation: string }> = {
  en: { versionId: '111', translation: 'NIV' },
  ru: { versionId: '105', translation: 'RUSV' },
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

  const { versionId, translation } = YOUVERSION_LOCALE_CONFIG[locale] ??
    YOUVERSION_LOCALE_CONFIG.en;

  return `https://www.bible.com/bible/${versionId}/${bookCode}.${selection.chapter}.${translation}`;
}
