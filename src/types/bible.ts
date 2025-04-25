export interface BibleBook {
  id: number;
  name: string;
  chapters: number;
}

export type BibleBookSelection = {
  book: BibleBook | null;
  chapter: number | null;
};
