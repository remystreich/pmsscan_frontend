// src/hooks/useRefreshToken.ts
import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { API_URL } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
   const { setAccessToken } = useAuthStore();
   const navigate = useNavigate();

   const refresh = useCallback(async () => {
      try {
         const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
         });

         if (response.ok) {
            const data = await response.json();
            setAccessToken(data.access_token);
         } else {
            console.error('Échec du rafraîchissement du jeton');
            setAccessToken(null);
            navigate('/');
            console.error('Échec du rafraîchissement du jeton');
         }
      } catch (error) {
         console.error('Erreur lors du rafraîchissement du jeton:', error);
         setAccessToken(null);
         navigate('/');
      }
   }, [setAccessToken, navigate]);

   return refresh;
};

export default useRefreshToken;
