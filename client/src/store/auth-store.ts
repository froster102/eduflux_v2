import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Auth {
  user: User | null;
  setUser: (user: User) => void;
  addUserRole: (role: Role) => void;
  updateUser: (data: Partial<User>) => void;
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
      addUserRole: (role) =>
        set((state) => {
          if (state.user) {
            return {
              ...state,
              user: {
                ...state.user,
                roles: [...state.user.roles, role],
              },
            };
          }

          return { ...state };
        }),
      updateUser: (data) =>
        set((state) => {
          if (state.user) {
            return {
              ...state,
              user: {
                ...state.user,
                ...data,
              },
            };
          }

          return state;
        }),
      signout: () => set(() => ({ ...initialState })),
    }),
    {
      name: "auth",
    },
  ),
);
