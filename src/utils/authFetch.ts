import { API_URL } from '@/utils/constants';
import { useAuthStore } from '@/stores/authStore';

export async function authFetch(url: string, options: RequestInit = {}) {
   let accessToken = useAuthStore.getState().accessToken;

   // Première tentative avec le token actuel
   let response = await fetch(url, {
      ...options,
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
         Authorization: `Bearer ${accessToken}`,
         ...options.headers,
      },
      credentials: 'include',
   });

   // Si 401, on tente de rafraîchir le token
   if (response.status === 401) {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
         method: 'POST',
         credentials: 'include',
      });

      if (!refreshResponse.ok) {
         throw new Error('Session expired');
      }

      const { access_token } = await refreshResponse.json();
      accessToken = access_token;

      // Nouvelle tentative avec le token rafraîchi
      response = await fetch(url, {
         ...options,
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`,
            ...options.headers,
         },
         credentials: 'include',
      });
   }

   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }

   return response.json();
}

