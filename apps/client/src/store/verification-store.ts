import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Verification {
  verificationEmail: string | null;
  setVerificationEmail: (email: string) => void;
}

const initialState = {
  verificationEmail: null,
};

export const useVerificationStore = create<Verification>()(
  persist(
    (set) => ({
      ...initialState,
      setVerificationEmail: (email) => {
        set((state) => ({ ...state, verificationEmail: email }));
      },
    }),
    {
      name: '__temp',
    },
  ),
);
