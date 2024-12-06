import { useEffect, useState } from 'react';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { useAuthStore } from '@/stores/authStore';

export const useFetchRecords = (pmscanId: number, page: number, limit: number) => {
   const { authFetch } = useAuthFetch();
   const accessToken = useAuthStore((state) => state.accessToken);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [response, setResponse] = useState<unknown | null>(null);

   useEffect(() => {
      const fetchRecords = async () => {
         if (accessToken) {
            setIsLoading(true);
            try {
               const response = await authFetch(`/records/${pmscanId}?page=${page}&limit=${limit}`, {}, 'GET');
               const data = await response.json();

               setResponse(data);
               setError(null);
            } catch (error) {
               console.error('Erreur lors de la récupération des PMScans:', error);
               setError('Erreur lors de la récupération des PMScans');
            } finally {
               setIsLoading(false);
            }
         }
      };

      fetchRecords();
   }, [accessToken, authFetch, setIsLoading, setError, pmscanId, page, limit]);

   return { response, isLoading, error };
};
