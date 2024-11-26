import { create } from 'zustand';

type AuthStore = {
   accessToken: string | null;
   setAccessToken: (token: string | null | { access_token: string }) => void;
   getAccessToken: () => string | null;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
   accessToken: null,
   setAccessToken: (token) => {
      const actualToken =
         typeof token === 'object' && token?.access_token
            ? token.access_token
            : token;
      set({ accessToken: actualToken as string | null });
   },
   getAccessToken: () => get().accessToken,
}));
