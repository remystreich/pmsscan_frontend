export interface MeasuresData {
   pm1gm: number;
   pm10gm: number;
   pm25gm: number;
   temp: number;
   hum: number;
}

export interface PMScanObjType {
   name: string;
   version: number;
   mode: number;
   interval: number;
   display: Uint8Array;
   battery: number;
   charging: number;
   dataLogger: boolean;
   externalMemory: number;
}

export interface Info {
   message: string;
   type: 'error' | 'success';
}
