import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type FormModalState = { isOpen: boolean; mode: 'create' | 'edit' };

interface InitialState {
  courseId: string | null;
  curriculumItems: CurriculumItem[];
  openChapterFormModal: FormModalState;
  openLectureFormModal: FormModalState;
  activeId: string | null;
  activeItem: CurriculumItem | null;
  selectedIndex: number;
  selectedLecture: Lecture | null;
  selectedChapter: Chapter | null;
  openFileUploadModal: boolean;
}

interface CurriculumStore extends InitialState {
  reArrangeCurriculumItems: (activeItemId: string, overItemId?: string) => void;
  reOrderCurriculumItems: () => void;
  insertCurriculumItem: (newItem: CurriculumItem, position: number) => void;
  setActiveId: (id: string | null) => void;
  setActiveItem: (item: CurriculumItem | null) => void;
  setCurriculumItems: (items: CurriculumItem[]) => void;
  setOpenChapterFormModal: (paylod: {
    isOpen: boolean;
    mode: 'create' | 'edit';
  }) => void;
  setOpenLectureFormModal: (paylod: {
    isOpen: boolean;
    mode: 'create' | 'edit';
  }) => void;
  updateLectureItem: (lecture: Lecture, index: number) => void;
  updateChapterItem: (chapter: Chapter, index: number) => void;
  deleteLectureItem: (id: string) => void;
  deleteChapterItem: (id: string) => void;
  setSelectedIndex: (index: number) => void;
  setSelectedChapter: (chapter: Chapter | null) => void;
  setSelectedLecture: (lecture: Lecture | null) => void;
  setOpenFileUploadModal: (open: boolean) => void;
}

const initialState: InitialState = {
  courseId: null,
  curriculumItems: [],
  openChapterFormModal: { isOpen: false, mode: 'create' },
  openLectureFormModal: { isOpen: false, mode: 'create' },
  openFileUploadModal: false,
  activeId: null,
  selectedIndex: 0,
  activeItem: null,
  selectedChapter: null,
  selectedLecture: null,
};

export const useCurriculumStore = create<CurriculumStore>()(
  immer((set) => ({
    ...initialState,
    setCurriculumItems: (items) => {
      set((state) => {
        state.curriculumItems = items;
      });
    },
    reArrangeCurriculumItems: (activeItemId: string, overItemId?: string) => {
      set((state) => {
        const activeIndex = state.curriculumItems.findIndex(
          (item) => item.id === activeItemId,
        );
        const overIndex = state.curriculumItems.findIndex(
          (item) => item.id === overItemId,
        );

        if (activeIndex === -1 || overIndex === -1) {
          return;
        }
        const newItems = [...state.curriculumItems];
        const movedItem = newItems[activeIndex];

        let itemsToMove: CurriculumItem[] = [];
        let itemsToRemoveCount = 0;

        if (movedItem._class === 'chapter') {
          itemsToMove.push(movedItem);
          itemsToRemoveCount++;

          for (let i = activeIndex + 1; i < newItems.length; i++) {
            if (newItems[i]._class === 'chapter') {
              break;
            }
            itemsToMove.push(newItems[i]);
            itemsToRemoveCount++;
          }
        } else {
          itemsToMove.push(movedItem);
          itemsToRemoveCount = 1;
        }

        newItems.splice(activeIndex, itemsToRemoveCount);

        newItems.splice(overIndex, 0, ...itemsToMove);

        state.curriculumItems = newItems;
        state.reOrderCurriculumItems();
      });
    },
    reOrderCurriculumItems: () => {
      set((state) => {
        const newItems = [...state.curriculumItems];

        let currentChapterIndex = 1;
        let currentLectureIndex = 1;

        for (let i = 0; i < newItems.length; i++) {
          if (newItems[i]._class === 'chapter') {
            newItems[i] = {
              ...newItems[i],
              objectIndex: currentChapterIndex++,
            };
          } else if (newItems[i]._class === 'lecture') {
            newItems[i] = {
              ...newItems[i],
              objectIndex: currentLectureIndex++,
            };
          }
        }
        state.curriculumItems = newItems;
      });
    },
    insertCurriculumItem: (newItem: CurriculumItem, position: number) => {
      set((state) => {
        const newItems = [...state.curriculumItems];

        newItems.splice(position + 1, 0, newItem);
        state.curriculumItems = newItems;
      });
    },
    setActiveId: (id) => {
      set((state) => {
        state.activeId = id;
      });
    },
    setOpenChapterFormModal: (paylod) => {
      set((state) => {
        state.openChapterFormModal = paylod;
      });
    },
    setOpenLectureFormModal: (payload) => {
      set((state) => {
        state.openLectureFormModal = payload;
      });
    },
    setActiveItem: (item) => {
      set((state) => {
        state.activeItem = item;
      });
    },
    updateLectureItem: (lecture, index) => {
      set((state) => {
        state.curriculumItems.splice(index, 1, lecture);
      });
    },
    updateChapterItem: (chapter, index) => {
      set((state) => {
        state.curriculumItems.splice(index, 1, chapter);
      });
    },
    deleteLectureItem: (id: string) => {
      set((state) => {
        state.curriculumItems = state.curriculumItems.filter(
          (item) => item.id !== id,
        );
      });
    },
    deleteChapterItem: (id: string) => {
      set((state) => {
        state.curriculumItems = state.curriculumItems.filter(
          (item) => item.id !== id,
        );
      });
    },
    setSelectedIndex: (index) => {
      set((state) => {
        state.selectedIndex = index;
      });
    },
    setSelectedChapter: (chapter: Chapter | null) => {
      set((state) => {
        state.selectedChapter = chapter;
      });
    },
    setSelectedLecture: (lecture: Lecture | null) => {
      set((state) => {
        state.selectedLecture = lecture;
      });
    },
    setOpenFileUploadModal: (open) => {
      set((state) => {
        state.openFileUploadModal = open;
      });
    },
  })),
);
