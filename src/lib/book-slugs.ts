// URL-friendly slugs for all 66 Bible books, indexed by book ID.
// Based on English book names for clean, internationally recognizable URLs.
// e.g. ?book=genesis&chapter=1, ?book=matthew&chapter=5
export const BOOK_SLUGS: readonly string[] = [
  // Old Testament (0-38)
  'genesis',
  'exodus',
  'leviticus',
  'numbers',
  'deuteronomy',
  'joshua',
  'judges',
  'ruth',
  '1-samuel',
  '2-samuel',
  '1-kings',
  '2-kings',
  '1-chronicles',
  '2-chronicles',
  'ezra',
  'nehemiah',
  'esther',
  'job',
  'psalms',
  'proverbs',
  'ecclesiastes',
  'song-of-solomon',
  'isaiah',
  'jeremiah',
  'lamentations',
  'ezekiel',
  'daniel',
  'hosea',
  'joel',
  'amos',
  'obadiah',
  'jonah',
  'micah',
  'nahum',
  'habakkuk',
  'zephaniah',
  'haggai',
  'zechariah',
  'malachi',
  // New Testament (39-65)
  'matthew',
  'mark',
  'luke',
  'john',
  'acts',
  'james',
  '1-peter',
  '2-peter',
  '1-john',
  '2-john',
  '3-john',
  'jude',
  'romans',
  '1-corinthians',
  '2-corinthians',
  'galatians',
  'ephesians',
  'philippians',
  'colossians',
  '1-thessalonians',
  '2-thessalonians',
  '1-timothy',
  '2-timothy',
  'titus',
  'philemon',
  'hebrews',
  'revelation',
];

const SLUG_TO_ID: Record<string, number> = Object.fromEntries(
  BOOK_SLUGS.map((slug, id) => [slug, id]),
);

export function bookIdToSlug(id: number): string | null {
  return BOOK_SLUGS[id] ?? null;
}

export function slugToBookId(slug: string): number | null {
  const id = SLUG_TO_ID[slug.toLowerCase()];
  return id !== undefined ? id : null;
}
