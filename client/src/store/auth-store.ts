import { create } from "zustand";

export interface Auth {
  user: User | null;
  session: Session | null;
  authToken: string | null;
  setAuthData: (user: User, session: Session, authToken: string) => void;
  signout: () => void;
}

const initialState = {
  user: null,
  session: null,
  authToken: null,
};

export const useAuthStore = create<Auth>((set) => ({
  ...initialState,
  setAuthData: (user: User, session: Session, authToken: string) =>
    set((state) => ({ ...state, user, session, authToken })),
  signout: () => set(() => ({ ...initialState })),
}));
