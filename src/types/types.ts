export interface MeasuresData {
   pm1: number;
   pm10: number;
   pm25: number;
   temp: number;
   hum: number;
}

export interface PMScanObjType {
   name: string;
   deviceName: string;
   version: number;
   mode: number;
   interval: number;
   display: Uint8Array;
   battery: number;
   charging: number;
   isRecording: boolean;
   externalMemory: boolean;
   databaseId: number | null;
}

export interface Info {
   message: string;
   type: 'error' | 'success';
}

export interface PMScanMode {
   acquisitionStarted: boolean;
   disconnectRequested: boolean;
   factoryResetRequested: boolean;
   lowPowerModeEnabled: boolean;
   memoryDownloadRequested: boolean;
   memoryEmpty: boolean;
   memoryEraseRequested: boolean;
   memoryFull: boolean;
}

export interface PMScan {
   createdAt: string;
   deviceName: string;
   display: Uint8Array;
   id: number;
   name: string;
   updatedAt: string;
   userId?: number;
}

export interface User {
   id: number;
   name: string;
   email: string;
   createdAt: string;
   updatedAt: string;
}

export type RecordData = {
   id: number;
   createdAt: string;
   updatedAt: string;
   data: {
      type: string;
      data: number[];
   };
   name: string;
   type: string;
   pmScanId: number;
};

export type Record = {
   id: number;
   name: string;
   pmScanId: number;
   createdAt: string;
   updatedAt: string;
   type: string;
   measuresCount: number;
};
