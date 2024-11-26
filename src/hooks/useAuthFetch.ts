// src/hooks/useFetchWithAuth.ts
import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { API_URL } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

export const useAuthFetch = () => {
   const { getAccessToken, setAccessToken } = useAuthStore();
   const navigate = useNavigate();

   const authFetch = useCallback(
      async (url: string, options: RequestInit = {}, method: string) => {
         const accessToken = getAccessToken();
         // Ajout du token aux headers
         const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
         };

         const response = await fetch(API_URL + url, {
            ...options,
            credentials: 'include',
            headers,
            method: method,
         });

         // Si 401, on tente de refresh
         if (response.status === 401) {
            const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
               method: 'POST',
               credentials: 'include',
            });

            if (refreshResponse.ok) {
               const { access_token } = await refreshResponse.json();
               setAccessToken(access_token);

               // On retente la requête originale avec le nouveau token
               return fetch(API_URL + url, {
                  ...options,
                  credentials: 'include',
                  headers: {
                     ...headers,
                     Authorization: `Bearer ${access_token}`,
                  },
                  method: method,
               });
            } else {
               // Si le refresh échoue, on déconnecte
               setAccessToken(null);
               navigate('/');
               throw new Error('Session expirée');
            }
         }

         return response;
      },
      [getAccessToken, setAccessToken, navigate],
   );

   return { authFetch };
};
