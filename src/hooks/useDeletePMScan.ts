import { useAuthFetch } from '@/hooks/useAuthFetch';
import { useCallback } from 'react';
import { usePMScanStore } from '@/stores/usePMScanStore';

const useDeletePMScan = () => {
   const { authFetch } = useAuthFetch();
   const { setPMScans, pmscans, disconnect } = usePMScanStore();

   const deletePMScan = useCallback(
      async (id: number) => {
         try {
            const response = await authFetch(`/pmscan/${id}`, {}, 'DELETE');
            if (!response.ok) {
               throw new Error('Failed to delete PMScan');
            } else {
               disconnect();
               const updatedPMScans = pmscans.filter((pmscan) => pmscan.id !== id);
               setPMScans(updatedPMScans);
            }
         } catch (error) {
            console.error('Error in PMScan deletion:', error);
            throw error;
         }
      },
      [authFetch, disconnect, pmscans, setPMScans],
   );

   return deletePMScan;
};

export default useDeletePMScan;
