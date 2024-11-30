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
