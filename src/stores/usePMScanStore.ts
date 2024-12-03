import { create, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PMScanManager } from '../services/PMScanManager';
import { MeasuresData, PMScanObjType, Info, PMScanMode, PMScan } from '../types/types';

export interface PMScanState {
   manager: PMScanManager;
   isConnected: boolean;
   measuresData: MeasuresData | null;
   PMScanObj: PMScanObjType;
   info: Info | null;
   pmscans: PMScan[];
   isLoading: boolean;
   error: string | null;
   mode: PMScanMode;
   connect: () => void;
   disconnect: () => void;
   setInfo: (info: Info | null) => void;
   setPMScans: (pmscans: PMScan[]) => void;
   setIsLoading: (isLoading: boolean) => void;
   setError: (error: string | null) => void;
}

export const usePMScanStore = create<PMScanState>()(
   devtools(
      (set, _get, api: StoreApi<PMScanState>) => ({
         manager: new PMScanManager(api),
         isConnected: false,
         measuresData: null,
         PMScanObj: {
            name: '',
            deviceName: '',
            version: 0,
            mode: 0,
            interval: 0,
            display: new Uint8Array(),
            battery: 0,
            charging: 0,
            isRecording: false,
            externalMemory: false,
            databaseId: null,
         },
         info: null,
         pmscans: [],
         isLoading: false,
         error: null,
         mode: {
            acquisitionStarted: false,
            disconnectRequested: false,
            factoryResetRequested: false,
            lowPowerModeEnabled: false,
            memoryDownloadRequested: false,
            memoryEmpty: false,
            memoryEraseRequested: false,
            memoryFull: false,
         },

         connect: () => {
            const { manager } = usePMScanStore.getState();
            manager.requestDevice();
         },

         disconnect: () => {
            const { manager } = usePMScanStore.getState();
            manager.disconnectDevice();
         },

         setInfo: (info: Info | null) => set({ info }),

         setPMScans: (pmscans) => set({ pmscans }),
         setIsLoading: (isLoading) => set({ isLoading }),
         setError: (error) => set({ error }),
      }),
      {
         name: 'PMScan Store',
      },
   ),
);
