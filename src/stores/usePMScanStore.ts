import { create, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PMScanManager } from '../services/PMScanManager';
import { MeasuresData, PMScanObjType, Info } from '../types/types';

export interface PMScan {
   id: string;
   createdAt: string;
   updatedAt: string;
   name: string;
   deviceId: string;
   deviceName: string;
   display: Uint8Array;
   // Ajoutez d'autres propriétés nécessaires
}

export interface PMScanState {
   manager: PMScanManager;
   isConnected: boolean;
   measuresData: MeasuresData | null;
   PMScanObj: PMScanObjType;
   info: Info | null;
   connect: () => void;
   disconnect: () => void;
   setInfo: (info: Info | null) => void;
}

export const usePMScanStore = create<PMScanState>()(
   devtools(
      (set, _get, api: StoreApi<PMScanState>) => ({
         manager: new PMScanManager(api),
         isConnected: false,
         measuresData: null,
         PMScanObj: {
            name: '',
            version: 0,
            mode: 0,
            interval: 0,
            display: new Uint8Array(),
            battery: 0,
            charging: 0,
            dataLogger: false,
            externalMemory: 0,
         },
         info: null,

         connect: () => {
            const { manager } = usePMScanStore.getState();
            manager.requestDevice();
         },

         disconnect: () => {
            const { manager } = usePMScanStore.getState();
            manager.disconnectDevice();
         },

         setInfo: (info: Info | null) => set({ info }),
      }),
      {
         name: 'PMScan Store',
      },
   ),
);
