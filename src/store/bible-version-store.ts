import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SYNO_VERSION } from '@/lib/youversion';

interface BibleVersionStore {
  versionId: number;
  readerOpen: boolean;
  setVersionId: (versionId: number) => void;
  setReaderOpen: (readerOpen: boolean) => void;
}

export const useBibleVersionStore = create<BibleVersionStore>()(
  persist(
    (set) => ({
      versionId: SYNO_VERSION.id,
      readerOpen: false,
      setVersionId: (versionId) => set({ versionId }),
      setReaderOpen: (readerOpen) => set({ readerOpen }),
    }),
    {
      name: 'bible-teka-version',
    },
  ),
);
