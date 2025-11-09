import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface InitialState {
  showSidebar: boolean;
}

interface LayoutStore extends InitialState {
  setShowSidebar: (value: boolean) => void;
}

const initialState: InitialState = {
  showSidebar: true,
};

export const useLayoutStore = create<LayoutStore>()(
  immer((set) => ({
    ...initialState,
    setShowSidebar: (value) =>
      set((state) => {
        state.showSidebar = value;
      }),
  })),
);
