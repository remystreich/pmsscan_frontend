import { useAuthFetch } from '@/hooks/useAuthFetch';
import { useCallback } from 'react';

export const useGetCurrentUser = () => {
   const { authFetch } = useAuthFetch();

   const getCurrentUser = useCallback(async () => {
      try {
         const response = await authFetch('/users', {}, 'GET');
         if (!response.ok) {
            throw new Error('Failed to get current user');
         }
         const data = await response.json();
         return data;
      } catch (error) {
         console.error('Error in getting current user:', error);
         throw error;
      }
   }, [authFetch]);

   return getCurrentUser;
};
