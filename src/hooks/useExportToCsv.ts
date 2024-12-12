import { useAuthFetch } from '@/hooks/useAuthFetch';
import { usePopupStore } from '@/stores/popupStore';
import { useCallback } from 'react';

export const useExportToCsv = () => {
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);

   const exportToCsv = useCallback(
      async (id: number) => {
         try {
            const response = await authFetch(`/records/toCSV/${id}`, {}, 'GET');
            if (!response.ok) {
               throw new Error('Failed to export Record');
            } else {
               const blob = await response.blob();

               // Créer une URL pour le blob
               const url = window.URL.createObjectURL(blob);

               // Créer un élément <a> temporaire
               const link = document.createElement('a');
               link.href = url;

               // Récupérer le nom du fichier depuis les headers ou utiliser un nom par défaut
               const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || `export_${id}.csv`;
               link.setAttribute('download', filename);

               // Simuler le clic
               document.body.appendChild(link);
               link.click();

               // Nettoyer
               document.body.removeChild(link);
               window.URL.revokeObjectURL(url);
            }
         } catch (error) {
            console.error('Error in Record export:', error);
            showPopup('error', 'Failed to export Record');
         }
      },
      [authFetch, showPopup],
   );

   return exportToCsv;
};
