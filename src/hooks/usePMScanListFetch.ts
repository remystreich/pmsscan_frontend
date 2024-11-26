import { useEffect } from 'react';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { useAuthStore } from '@/stores/authStore';
import { usePMScansListStore } from '@/stores/pmscansListSore';

export const usePMScanListFetch = () => {
   const { authFetch } = useAuthFetch();
   const accessToken = useAuthStore((state) => state.accessToken);
   const { pmscans, setPMScans, isLoading, setIsLoading, error, setError } =
      usePMScansListStore();

   useEffect(() => {
      let isMounted = true;

      const fetchPMScans = async () => {
         if (accessToken) {
            setIsLoading(true);
            try {
               const response = await authFetch(`/pmscan`, {}, 'GET');
               const data = await response.json();
               if (isMounted) {
                  setPMScans(data);
                  setError(null);
               }
            } catch (error) {
               if (isMounted) {
                  console.error(
                     'Erreur lors de la récupération des PMScans:',
                     error,
                  );
                  setError('Erreur lors de la récupération des PMScans');
               }
            } finally {
               if (isMounted) {
                  setIsLoading(false);
               }
            }
         }
      };

      fetchPMScans();

      return () => {
         isMounted = false;
      };
   }, [accessToken, authFetch, setPMScans, setIsLoading, setError]);

   return { pmscans, isLoading, error };
};
