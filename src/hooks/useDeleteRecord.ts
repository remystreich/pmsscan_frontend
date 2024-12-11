import { useAuthFetch } from '@/hooks/useAuthFetch';
import { useCallback } from 'react';
import { usePopupStore } from '@/stores/popupStore';

export const useDeleteRecord = () => {
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);

   const deleteRecord = useCallback(
      async (id: number) => {
         try {
            const response = await authFetch(`/records/${id}`, {}, 'DELETE');
            if (!response.ok) {
               throw new Error('Failed to delete Record');
            } else {
               showPopup('success', 'Record deleted successfully');
            }
         } catch (error) {
            console.error('Error in Record deletion:', error);
            showPopup('error', 'Failed to delete Record');
         }
      },
      [authFetch, showPopup],
   );

   return deleteRecord;
};
