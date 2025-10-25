import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface InitialState {
  selectedChat: Chat | null;
}

export interface ChatStore extends InitialState {
  setSelectedChat: (chat: Chat | null) => void;
  resetSelectedChat: () => void;
}

const initialState: InitialState = {
  selectedChat: null,
};

export const useChatStore = create<ChatStore>()(
  immer((set) => ({
    ...initialState,
    setSelectedChat: (chat) => {
      set((state) => {
        state.selectedChat = chat;
      });
    },
    resetSelectedChat: () => {
      set((state) => {
        state.selectedChat = null;
      });
    },
  })),
);
