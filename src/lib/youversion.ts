import type { BibleBookSelection } from '@/types/bible';
import type { Locale } from '@/store/locale-store';

// YouVersion book codes mapped to Russian Synodal book order (used in bible.ts)
// Russian NT order: Gospels → Acts → Catholic Epistles (James, 1-2 Peter, 1-3 John, Jude)
// → Pauline Epistles (Romans, 1-2 Cor, Gal, Eph, Phil, Col, 1-2 Thess, 1-2 Tim, Titus, Philemon, Hebrews) → Revelation
const YOUVERSION_BOOK_CODES = [
  // Old Testament (0-38) - same order in Russian and English
  'GEN',  // 0
  'EXO',  // 1
  'LEV',  // 2
  'NUM',  // 3
  'DEU',  // 4
  'JOS',  // 5
  'JDG',  // 6
  'RUT',  // 7
  '1SA',  // 8
  '2SA',  // 9
  '1KI',  // 10
  '2KI',  // 11
  '1CH',  // 12
  '2CH',  // 13
  'EZR',  // 14
  'NEH',  // 15
  'EST',  // 16
  'JOB',  // 17
  'PSA',  // 18
  'PRO',  // 19
  'ECC',  // 20
  'SNG',  // 21
  'ISA',  // 22
  'JER',  // 23
  'LAM',  // 24
  'EZK',  // 25
  'DAN',  // 26
  'HOS',  // 27
  'JOL',  // 28
  'AMO',  // 29
  'OBA',  // 30
  'JON',  // 31
  'MIC',  // 32
  'NAM',  // 33
  'HAB',  // 34
  'ZEP',  // 35
  'HAG',  // 36
  'ZEC',  // 37
  'MAL',  // 38
  // New Testament - Russian Synodal order
  'MAT',  // 39
  'MRK',  // 40
  'LUK',  // 41
  'JHN',  // 42
  'ACT',  // 43
  // Catholic Epistles (Russian order)
  'JAS',  // 44 - James
  '1PE',  // 45 - 1 Peter
  '2PE',  // 46 - 2 Peter
  '1JN',  // 47 - 1 John
  '2JN',  // 48 - 2 John
  '3JN',  // 49 - 3 John
  'JUD',  // 50 - Jude
  // Pauline Epistles (Russian order)
  'ROM',  // 51 - Romans
  '1CO',  // 52 - 1 Corinthians
  '2CO',  // 53 - 2 Corinthians
  'GAL',  // 54 - Galatians
  'EPH',  // 55 - Ephesians
  'PHP',  // 56 - Philippians
  'COL',  // 57 - Colossians
  '1TH',  // 58 - 1 Thessalonians
  '2TH',  // 59 - 2 Thessalonians
  '1TI',  // 60 - 1 Timothy
  '2TI',  // 61 - 2 Timothy
  'TIT',  // 62 - Titus
  'PHM',  // 63 - Philemon
  'HEB',  // 64 - Hebrews
  'REV',  // 65 - Revelation
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
