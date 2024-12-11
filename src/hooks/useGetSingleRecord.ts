import { useAuthFetch } from '@/hooks/useAuthFetch';
import { usePopupStore } from '@/stores/popupStore';
import { useCallback, useState } from 'react';
import { RecordData } from '@/types/types';

export const useGetSingleRecord = () => {
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);

   const [data, setData] = useState<RecordData | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   const fetchRecord = useCallback(
      async (id: number) => {
         setLoading(true);
         try {
            const response = await authFetch(`/records/single/${id}`, {}, 'GET');
            if (!response.ok) {
               throw new Error('Failed to get record');
            } else {
               const fetchedData: RecordData = await response.json();
               setData(fetchedData);
               setError(null);
               return fetchedData;
            }
         } catch (error) {
            console.error('Error in getting record:', error);
            setError('Failed to get record');
            showPopup('error', 'Failed to get record');
         } finally {
            setLoading(false);
         }
      },
      [authFetch, showPopup],
   );

   return { data, loading, error, fetchRecord };
};
