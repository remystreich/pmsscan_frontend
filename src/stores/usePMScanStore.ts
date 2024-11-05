import { create, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PMScanManager } from '../services/PMScanManager';
import { MeasuresData, PMScanObjType } from '../types/types';

export interface PMScanState {
   manager: PMScanManager;
   isConnected: boolean;
   measuresData: MeasuresData | null;
   PMScanObj: PMScanObjType;
   connect: () => void;
   disconnect: () => void;
}

export const usePMScanStore = create<PMScanState>()(
   devtools(
      (set, get, api: StoreApi<PMScanState>) => ({
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

         connect: () => {
            const { manager } = usePMScanStore.getState();
            manager.requestDevice();
            set({ isConnected: true });

            manager.handleRTData = (value: DataView) => {
               const rawData = new Uint8Array(value.buffer);
               const measuresData = {
                  pm1gm: (((rawData[9] & 0xff) << 8) | (rawData[8] & 0xff)) / 10,
                  pm10gm: (((rawData[13] & 0xff) << 8) | (rawData[12] & 0xff)) / 10,
                  pm25gm: (((rawData[11] & 0xff) << 8) | (rawData[10] & 0xff)) / 10,
                  temp: ((rawData[15] & 0xff) << 8) | (rawData[14] & 0xff),
                  hum: ((rawData[17] & 0xff) << 8) | (rawData[16] & 0xff),
               };

               set({ measuresData });
            };
         },

         disconnect: () => {
            const { manager } = usePMScanStore.getState();
            manager.disconnectDevice();
            set({ isConnected: false });
         },
      }),
      {
         name: 'PMScan Store',
      },
   ),
);
