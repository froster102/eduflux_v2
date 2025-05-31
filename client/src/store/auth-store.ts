import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Auth {
  user: User | null;
  setUser: (user: User) => void;
  signout: () => void;
}

const initialState = {
  user: null,
};

export const useAuthStore = create<Auth>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user: User) => set((state) => ({ ...state, user })),
      signout: () => set(() => ({ ...initialState })),
    }),
    {
      name: "auth",
    },
  ),
);
