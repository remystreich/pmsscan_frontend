import { RecordData, Record } from '@/types/types';
import { create } from 'zustand';
import { authFetch } from '@/utils/authFetch';
import { API_URL } from '@/utils/constants';
import { usePopupStore } from '@/stores/popupStore';

interface RecordsResponse {
   records: Record[];
   meta: {
      totalPages: number;
      page: number;
      limit: number;
   };
}

interface RecordStore {
   records: Record[];
   loading: boolean;
   error: string | null;

   meta: {
      totalPages: number;
      page: number;
      limit: number;
   } | null;
   singleRecordLoading: boolean;
   singleRecordError: string | null;
   currentFetch: { pmscanId: number; page: number; limit: number };
   recordsDays: string[];
   selectedDate: Date | undefined;

   reset: () => void;
   fetchRecords: (pmscanId: number, page: number, limit: number) => Promise<void>;
   deleteRecord: (id: number) => Promise<void>;
   getSingleRecord: (id: number) => Promise<RecordData | undefined>;
   exportToCsv: (id: number) => Promise<void>;
   updateRecordName: (id: number, name: string) => Promise<void>;
   refreshRecords: () => Promise<void>;
   getRecordsDays: () => Promise<void>;
   setSelectedDate: (date: Date | undefined) => void;
}

const popUpStore = usePopupStore.getState();

export const useRecordStore = create<RecordStore>((set, get) => ({
   records: [],
   loading: false,
   error: null,
   meta: null,
   singleRecordLoading: false,
   singleRecordError: null,
   currentFetch: { pmscanId: 0, page: 0, limit: 0 },
   recordsDays: [],
   selectedDate: undefined,

   reset: () => {
      set({
         records: [],
         loading: false,
         error: null,
         meta: null,
      });
   },

   fetchRecords: async (pmscanId: number, page: number, limit: number) => {
      set({ loading: true, error: null });
      try {
         let date = '';
         const selectedDate = get().selectedDate;
         if (selectedDate && selectedDate instanceof Date) {
            date = selectedDate.toISOString();
         }
         const response = await authFetch(`${API_URL}/records/${pmscanId}?page=${page}&limit=${limit}&date=${date}`);

         const data = (await response.json()) as RecordsResponse;

         set({
            records: data.records,
            meta: data.meta,
            error: null,
            loading: false,
            currentFetch: { pmscanId, page, limit },
         });
      } catch (error) {
         console.error('Erreur lors de la récupération des records:', error);
         set({
            error: 'Erreur lors de la récupération des records',
            loading: false,
         });
      }
   },

   deleteRecord: async (id: number) => {
      try {
         const response = await authFetch(`${API_URL}/records/${id}`, { method: 'DELETE' });
         if (!response.ok) {
            throw new Error('Failed to delete Record');
         } else {
            const records = get().records.filter((record) => record.id !== id);
            set({ records });
            popUpStore.showPopup('success', 'Record deleted successfully');
         }
      } catch (error) {
         console.error('Error in Record deletion:', error);
         popUpStore.showPopup('error', 'Failed to delete Record');
      } finally {
         set({ loading: false });
      }
   },

   getSingleRecord: async (id: number) => {
      set({ singleRecordLoading: true, singleRecordError: null });
      try {
         const response = await authFetch(`${API_URL}/records/single/${id}`, { method: 'GET' });
         if (!response.ok) {
            throw new Error('Failed to get record');
         } else {
            const fetchedData: RecordData = await response.json();
            set({ singleRecordError: null });
            return fetchedData;
         }
      } catch (error) {
         console.error('Error in getting record:', error);
         set({ error: 'Failed to get record' });
         popUpStore.showPopup('error', 'Failed to get record');
      } finally {
         set({ singleRecordLoading: false });
      }
   },

   exportToCsv: async (id: number) => {
      try {
         const response = await authFetch(`${API_URL}/records/toCSV/${id}`, { method: 'GET' });
         if (!response.ok) {
            throw new Error('Failed to export Record');
         } else {
            const blob = await response.blob();

            // Créer une URL pour le blob
            const url = window.URL.createObjectURL(blob);

            // Créer un élément <a> temporaire
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
               ? contentDisposition.split('filename=')[1].replace(/^"|"$/g, '')
               : `export_${id}.csv`;

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
         popUpStore.showPopup('error', 'Failed to export Record');
      }
   },

   updateRecordName: async (id: number, name: string) => {
      try {
         const response = await authFetch(`${API_URL}/records/update-record-name/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ name }),
         });
         if (!response.ok) {
            throw new Error('Failed to update Record name');
         } else {
            const records = get().records.map((record) => {
               if (record.id === id) {
                  return { ...record, name };
               }
               return record;
            });
            set({ records });
            popUpStore.showPopup('success', 'Record name updated successfully');
         }
      } catch (error) {
         console.error('Error in Record name update:', error);
         popUpStore.showPopup('error', 'Failed to update Record name');
      }
   },

   refreshRecords: async () => {
      const { pmscanId, page, limit } = get().currentFetch;
      await get().fetchRecords(pmscanId, page, limit);
   },

   getRecordsDays: async () => {
      try {
         const response = await authFetch(`${API_URL}/records/dates/all`, { method: 'GET' });
         if (!response.ok) {
            throw new Error('Failed to get records days');
         } else {
            const data = await response.json();
            const dates = data.dates;
            set({ recordsDays: dates });
         }
      } catch (error) {
         console.error('Error in getting records days:', error);
      }
   },

   setSelectedDate: (date: Date | undefined) => {
      set({ selectedDate: date });
   },
}));
