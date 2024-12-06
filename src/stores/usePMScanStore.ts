import { create, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PMScanManager } from '../services/PMScanManager';
import { MeasuresData, PMScanObjType, PMScanMode, PMScan } from '../types/types';

export interface PMScanState {
   manager: PMScanManager;
   isConnected: boolean;
   measuresData: MeasuresData | null;
   datasForChart: Uint8Array[];
   PMScanObj: PMScanObjType;
   pmscans: PMScan[];
   isLoading: boolean;
   error: string | null;
   mode: PMScanMode;
   connect: () => void;
   disconnect: () => void;
   resetToFactory: () => void;
   eraseDataLoggerData: () => void;
   setPMScans: (pmscans: PMScan[]) => void;
   setIsLoading: (isLoading: boolean) => void;
   setError: (error: string | null) => void;
   startOnlineRecording: () => void;
   stopOnlineRecording: () => void;
}

export const usePMScanStore = create<PMScanState>()(
   devtools(
      (set, _get, api: StoreApi<PMScanState>) => ({
         manager: new PMScanManager(api),
         isConnected: false,
         measuresData: null,
         datasForChart: [],
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

         resetToFactory: async () => {
            if (usePMScanStore.getState().isConnected === false) return;
            const { manager } = usePMScanStore.getState();
            manager.writeMode(0x80, false, false);
            setTimeout(() => {
               manager.disconnectDevice();
            }, 1000);
         },

         eraseDataLoggerData: async () => {
            if (usePMScanStore.getState().isConnected === false) return;
            const { manager } = usePMScanStore.getState();
            await manager.writeMode(0x08, true, false); // stopper enregistrement
            await new Promise((resolve) => setTimeout(resolve, 200)); // sleep 200ms
            await manager.writeMode(0x20, false, false); // effacer les données
         },

         setPMScans: (pmscans) => set({ pmscans }),
         setIsLoading: (isLoading) => set({ isLoading }),
         setError: (error) => set({ error }),
         startOnlineRecording: () => {
            const { manager } = usePMScanStore.getState();
            manager.isOnlineRecording = true;
            manager.updatePMScanObj({ isRecording: true });
         },
         stopOnlineRecording: () => {
            const { manager } = usePMScanStore.getState();
            manager.isOnlineRecording = false;
            manager.updatePMScanObj({ isRecording: false });
         },
      }),
      {
         name: 'PMScan Store',
      },
   ),
);
