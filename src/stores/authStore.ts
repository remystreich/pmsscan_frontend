import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
   accessToken: string | null;
   setAccessToken: (token: string | null) => void;
   getAccessToken: () => string | null;
};

export const useAuthStore = create<AuthStore>()(
   persist(
      (set, get) => ({
         accessToken: null,
         setAccessToken: (token) => set({ accessToken: token }),
         getAccessToken: () => get().accessToken,
      }),
      {
         name: 'auth-storage',
      },
   ),
);
