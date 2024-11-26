import { useAuthFetch } from '@/hooks/useAuthFetch';

export const usePMScanListFetch = () => {
   const { authFetch } = useAuthFetch();

   return async () => {
      const response = await authFetch(`/pmscan`, {}, 'GET');
      const data = await response.json();
      return data;
   };
};
