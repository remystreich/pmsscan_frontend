import { StoreApi } from 'zustand';
import { PMScanState } from '../stores/usePMScanStore';
import { useAuthStore } from '@/stores/authStore';
import { PMScanObjType, MeasuresData, PMScanMode } from '../types/types';
import { API_URL } from '@/utils/constants';
import { uint8ArrayToBase64 } from '@/utils/functions';
import { authFetch } from '@/utils/authFetch';
import { usePopupStore } from '@/stores/popupStore';

export class PMScanManager {
   private device: BluetoothDevice | null = null;
   private gatt: BluetoothRemoteGATTServer | null = null;
   private service: BluetoothRemoteGATTService | null = null;
   private shouldConnect: boolean = false;
   public PMScanInited: boolean = false;
   public PMScanTime: number = 0;

   public isOnlineRecording: boolean = false;

   private storeApi: StoreApi<PMScanState> | null = null;
   private uint8ArrayToBase64 = uint8ArrayToBase64;
   private gattOperationInProgress: boolean = false;
   private pendingData: Uint8Array[] = [];
   private timerForPendingData: NodeJS.Timeout | null = null;

   public dataLoggerTransfer: boolean = false;
   private dataloggerPendingData: Uint8Array = new Uint8Array();

   //pour online recording, on a besoin de l'id du record en cours, si id ==0 on crée un nouveau record, sinon on ajoute les données à l'id du record
   public recordId: number = 0;

   public PMScanObj: PMScanObjType = {
      name: 'PMScanXXXXXX',
      deviceName: '',
      version: 0,
      mode: 0,
      interval: 0,
      display: new Uint8Array([150, 0, 44, 1, 244, 1, 32, 3, 255, 255]),
      battery: 0,
      charging: 0,
      isRecording: false,
      externalMemory: false,
      databaseId: null,
   };

   public mode: PMScanMode = {
      acquisitionStarted: false,
      disconnectRequested: false,
      factoryResetRequested: false,
      lowPowerModeEnabled: false,
      memoryDownloadRequested: false,
      memoryEmpty: false,
      memoryEraseRequested: false,
      memoryFull: false,
   };

   constructor(storeApi?: StoreApi<PMScanState>) {
      if (storeApi) {
         this.storeApi = storeApi;
      }
   }

   private getAccessToken(): string | null {
      return useAuthStore.getState().accessToken;
   }

   private updatePMScanConnectionStatus(isConnected: boolean): void {
      if (this.storeApi) {
         this.storeApi.setState({ isConnected });
      }
   }

   public updatePMScanObj(partialObj: Partial<PMScanObjType>) {
      this.PMScanObj = { ...this.PMScanObj, ...partialObj };
      if (this.storeApi) {
         this.storeApi.setState((state) => ({
            ...state,
            PMScanObj: {
               ...state.PMScanObj,
               ...partialObj,
            },
         }));
      }
   }

   private updateMeasuresData(measuresData: MeasuresData | null): void {
      if (this.storeApi) {
         this.storeApi.setState({ measuresData });
      }
   }

   private updateDatasForChart(datasForChart: Uint8Array[]): void {
      if (this.storeApi) {
         this.storeApi.setState(() => ({
            datasForChart: [...datasForChart],
         }));
      }
      // const test = this.storeApi.getState().datasForChart;
      // test.forEach((rawData) => {
      //    const dt2000 = 946684800;
      //    const ts2000 =
      //       ((rawData[3] & 0xff) << 24) | ((rawData[2] & 0xff) << 16) | ((rawData[1] & 0xff) << 8) | (rawData[0] & 0xff);
      //    const measuredAt = new Date((ts2000 + dt2000) * 1000);
      //    console.log('Measured At:', measuredAt);
      // }); TODO: Remove this
   }

   private showPopup(message: string, success: boolean): void {
      const showPopup = usePopupStore.getState().showPopup;
      showPopup(success ? 'success' : 'error', message);
   }

   private readTimeStamp(rawData: Uint8Array): number {
      return ((rawData[3] & 0xff) << 24) | ((rawData[2] & 0xff) << 16) | ((rawData[1] & 0xff) << 8) | (rawData[0] & 0xff);
   }

   async requestDevice(): Promise<void> {
      const available = await navigator.bluetooth.getAvailability();
      if (!available) {
         this.showPopup('Bluetooth is not available on this navigator', false);
         return;
      }
      try {
         this.device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'PMScan' }],
            optionalServices: ['f3641900-00b0-4240-ba50-05ca45bf8abc'],
         });

         if (this.device) {
            this.gatt = this.device.gatt as BluetoothRemoteGATTServer;
            this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
            this.shouldConnect = true;
            this.connect();
         }
      } catch (error) {
         console.error(error);
         this.showPopup('Bluetooth device request failed', false);
         console.error('Bluetooth device request failed', error);
      }
   }

   connect(): void {
      if (this.shouldConnect === false || !this.gatt) return;

      this.exponentialBackoff(
         10, // max retries
         1.2, // seconds delay
         () => this.gatt!.connect(),
         (server) => {
            this.onPMScanConnected(server);
         },
         () => {
            this.showPopup('Failed to reconnect', false);
         },
      );
   }

   private exponentialBackoff(
      maxRetries: number,
      delay: number,
      toTry: () => Promise<BluetoothRemoteGATTServer>,
      success: (server: BluetoothRemoteGATTServer) => void,
      fail: () => void,
   ): void {
      toTry()
         .then((result) => success(result))
         .catch(() => {
            if (maxRetries === 0) {
               return fail();
            }
            setTimeout(() => {
               this.exponentialBackoff(--maxRetries, delay * 2, toTry, success, fail);
            }, delay * 1000);
         });
   }

   private async onPMScanConnected(server: BluetoothRemoteGATTServer): Promise<void> {
      const PMScanServiceUUID = 'f3641900-00b0-4240-ba50-05ca45bf8abc';
      this.PMScanInited = false;
      this.service = await server.getPrimaryService(PMScanServiceUUID);
      if (!this.device?.name) {
         console.error('Device name is not set');
         return;
      }
      this.updatePMScanObj({ deviceName: this.device?.name });
      try {
         await this.initializeBatteryCharacteristic();
         await this.initializeChargingCharacteristic();
         await this.initializeTimeCharacteristic();
         await this.initializeOTHCharacteristic();
         await this.initializeIntervalCharacteristic();
         await this.ReadMode();
         await this.initializeDisplayCharacteristic();
         await this.initializeIMDataCharacteristic();
         await this.initializeRTDataCharacteristic();

         this.PMScanInited = true;
         this.updatePMScanConnectionStatus(true);
         this.registerPMScan();
      } catch (error) {
         this.disconnectDevice();
         this.showPopup('Error initializing PMScan connection', false);
         console.error(error, 'onPMScanConnected');
      }
   }

   private async registerPMScan(): Promise<void> {
      if (this.storeApi) {
         try {
            await this.getPMscansList();
            const { pmscans, setPMScans } = this.storeApi.getState();
            const existingPMScan = pmscans.find((pmscan) => pmscan.deviceName === this.PMScanObj.deviceName);
            this.updatePMScanObj({ name: this.PMScanObj.deviceName });
            if (existingPMScan) {
               this.updatePMScanObj({ databaseId: existingPMScan.id });
               this.updateDisplayCharacteristic(existingPMScan.display);
            } else if (!existingPMScan) {
               const payload = {
                  name: this.PMScanObj.deviceName,
                  deviceName: this.PMScanObj.deviceName,
                  display: this.uint8ArrayToBase64(this.PMScanObj.display),
               };

               const accessToken = this.getAccessToken();
               if (!accessToken) {
                  throw new Error('No access token available');
               }
               const response = await authFetch(`${API_URL}/pmscan`, {
                  method: 'POST',
                  body: JSON.stringify(payload),
               });

               const data = await response.json();

               if (data.display && data.display.type === 'Buffer') {
                  data.display = new Uint8Array(data.display.data);
               }

               pmscans.push(data);
               setPMScans(pmscans);
            }
         } catch (error) {
            console.error('Error registering PMScan:', error);
         }
      }
   }

   private async getPMscansList(): Promise<void> {
      if (!this.storeApi) return;
      const { setPMScans } = this.storeApi.getState();
      try {
         const response = await authFetch(`${API_URL}/pmscan`);

         const data = await response.json();

         for (let i = 0; i < data.length; i++) {
            if (data[i].display && data[i].display.type === 'Buffer') {
               data[i].display = new Uint8Array(data[i].display.data);
            }
         }

         setPMScans(data);
      } catch (error) {
         console.error('Error fetching PMScans:', error);
      }
   }

   private async initializeBatteryCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      const PMScanBatteryUUID = 'f3641904-00b0-4240-ba50-05ca45bf8abc';
      const batteryCharacteristic = await this.service.getCharacteristic(PMScanBatteryUUID);
      const batteryValue = await batteryCharacteristic.readValue();
      this.updatePMScanObj({ battery: batteryValue.getUint8(0) });

      await batteryCharacteristic.startNotifications();
      batteryCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
         const value = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
         if (value) {
            this.updatePMScanObj({ battery: value.getUint8(0) });
         }
      });
   }

   private async initializeChargingCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      const PMScanChargingUUID = 'f3641905-00b0-4240-ba50-05ca45bf8abc';
      const chargingCharacteristic = await this.service.getCharacteristic(PMScanChargingUUID);
      const chargingValue = await chargingCharacteristic.readValue();
      this.updatePMScanObj({ charging: chargingValue.getUint8(0) });

      await chargingCharacteristic.startNotifications();
      chargingCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
         const value = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
         if (value) {
            this.updatePMScanObj({ charging: value.getUint8(0) });
         }
      });
   }

   private async initializeTimeCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      const PMScanTimeUUID = 'f3641906-00b0-4240-ba50-05ca45bf8abc';
      const timeCharacteristic = await this.service.getCharacteristic(PMScanTimeUUID);
      const timeValue = await timeCharacteristic.readValue();
      this.PMScanTime = timeValue.getUint32(0);

      if (this.PMScanTime === 0) {
         const dt2000 = 946684800;
         const timeDt2000 = Math.floor(new Date().getTime() / 1000 - dt2000);
         const time = new Uint8Array([
            timeDt2000 & 0xff,
            (timeDt2000 >> 8) & 0xff,
            (timeDt2000 >> 16) & 0xff,
            (timeDt2000 >> 24) & 0xff,
         ]);
         await timeCharacteristic.writeValueWithResponse(time);
      }
   }

   private async initializeOTHCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      const PMScanOTHUUID = 'f3641903-00b0-4240-ba50-05ca45bf8abc';
      const othCharacteristic = await this.service.getCharacteristic(PMScanOTHUUID);
      const othValue = await othCharacteristic.readValue();
      this.updatePMScanObj({ version: othValue.getUint8(0) >> 2 });
   }

   private async initializeIntervalCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      const PMScanIntervalUUID = 'f3641907-00b0-4240-ba50-05ca45bf8abc';
      const intervalCharacteristic = await this.service.getCharacteristic(PMScanIntervalUUID);
      const intervalValue = await intervalCharacteristic.readValue();
      this.updatePMScanObj({ interval: intervalValue.getUint8(0) });
   }

   public async ReadMode(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      if (this.gattOperationInProgress) {
         return;
      }
      this.gattOperationInProgress = true;

      const PMScanModeUUID = 'f3641908-00b0-4240-ba50-05ca45bf8abc';
      const modeCharacteristic = await this.service.getCharacteristic(PMScanModeUUID);
      const modeValue = await modeCharacteristic.readValue();
      const uint8 = modeValue.getUint8(0);
      this.updateModeObject(uint8);
      this.gattOperationInProgress = false;
   }

   private async initializeDisplayCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      const PMScanDisplayUUID = 'f364190a-00b0-4240-ba50-05ca45bf8abc';
      const displayCharacteristic = await this.service.getCharacteristic(PMScanDisplayUUID);
      await displayCharacteristic.writeValueWithResponse(this.PMScanObj.display);
      const displayValue = await displayCharacteristic.readValue();
      const display = new Uint8Array(displayValue.buffer);
      this.updatePMScanObj({ display: display });
   }

   private async updateDisplayCharacteristic(newDisplay: Uint8Array): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }
      if (newDisplay.length !== 10) {
         throw new Error('Invalid display');
      }
      this.updatePMScanObj({ display: newDisplay });
      const PMScanDisplayUUID = 'f364190a-00b0-4240-ba50-05ca45bf8abc';
      const displayCharacteristic = await this.service.getCharacteristic(PMScanDisplayUUID);
      await displayCharacteristic.writeValueWithResponse(newDisplay);
   }

   private async initializeIMDataCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }

      const PMScanIMDataUUID = 'f3641902-00b0-4240-ba50-05ca45bf8abc';
      const imDataCharacteristic = await this.service.getCharacteristic(PMScanIMDataUUID);
      await imDataCharacteristic.startNotifications();
      imDataCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
         const value = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
         if (value && !this.dataLoggerTransfer) {
            this.handleCacheData(value);
         } else if (value && this.dataLoggerTransfer) {
            this.handleDataLoggerData(value);
         }
      });
   }

   private async initializeRTDataCharacteristic(): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }
      const PMScanRTDataUUID = 'f3641901-00b0-4240-ba50-05ca45bf8abc';
      const rtDataCharacteristic = await this.service.getCharacteristic(PMScanRTDataUUID);
      await rtDataCharacteristic.startNotifications();
      rtDataCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
         const value = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
         if (value) {
            this.handleRTData(value);
         }
      });
   }

   public disconnectDevice(): void {
      if (this.device?.gatt?.connected) {
         this.shouldConnect = false;
         this.updatePMScanConnectionStatus(false);
         this.device.gatt.disconnect();
         this.writeMode(0x40, false, false);
         this.PMScanInited = false;
         this.isOnlineRecording = false;
         this.updatePMScanObj({ isRecording: false });
      }
   }

   private onDisconnected(): void {
      this.updatePMScanConnectionStatus(false);
      if (this.shouldConnect) {
         this.connect();
      }
   }

   public async writeInterval(value: number): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }
      try {
         const PMScanIntervalUUID = 'f3641907-00b0-4240-ba50-05ca45bf8abc';
         const interval = new Uint8Array([value]);
         const intervalCharacteristic = await this.service.getCharacteristic(PMScanIntervalUUID);
         await intervalCharacteristic.writeValueWithResponse(interval);
         this.updatePMScanObj({ interval: value });
         this.showPopup('Interval written successfully', true);
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
         this.showPopup('Error writing interval', false);
      }
   }

   public async writeDisplay(value: Uint8Array): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }
      try {
         const PMScanDisplayUUID = 'f364190a-00b0-4240-ba50-05ca45bf8abc';
         const displayCharacteristic = await this.service.getCharacteristic(PMScanDisplayUUID);
         await displayCharacteristic.writeValueWithResponse(value);
         this.updatePMScanObj({ display: value });
         this.showPopup('Display written successfully', true);
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
         this.showPopup('Error writing display', false);
      }
   }

   updateModeObject(value: number): void {
      this.mode.factoryResetRequested = (value & 0x80) !== 0;
      this.mode.disconnectRequested = (value & 0x40) !== 0;
      this.mode.memoryEraseRequested = (value & 0x20) !== 0;
      this.mode.memoryDownloadRequested = (value & 0x10) !== 0;
      this.mode.acquisitionStarted = (value & 0x08) !== 0;
      this.mode.memoryFull = (value & 0x04) !== 0;
      this.mode.memoryEmpty = (value & 0x02) !== 0;
      this.mode.lowPowerModeEnabled = (value & 0x01) !== 0;

      if (this.mode.memoryFull == true && this.mode.memoryEmpty == true) {
         this.updatePMScanObj({ externalMemory: false });
      } else {
         this.updatePMScanObj({ externalMemory: true });
      }
      this.storeApi?.setState({ mode: this.mode });
      if (this.mode.acquisitionStarted) {
         this.updatePMScanObj({ isRecording: true });
      }
      this.updatePMScanObj({ mode: value });
   }

   async writeMode(modeFlags: number, toZero: boolean = false, shouldRead: boolean = true): Promise<void> {
      if (!this.service) {
         throw new Error('Service is not initialized');
      }
      if (this.gattOperationInProgress) {
         return;
      }

      try {
         this.gattOperationInProgress = true;
         const PMScanModeUUID = 'f3641908-00b0-4240-ba50-05ca45bf8abc';
         const modeCharacteristic = await this.service.getCharacteristic(PMScanModeUUID);
         const modeValue = await modeCharacteristic.readValue();
         const currentValue = modeValue.getUint8(0);
         const modeToWrite = new Uint8Array(1);
         if (toZero === true) {
            modeToWrite[0] = currentValue & ~modeFlags;
         } else {
            modeToWrite[0] = currentValue | modeFlags;
         }
         await modeCharacteristic.writeValueWithResponse(modeToWrite);
         this.updateModeObject(modeToWrite[0]);
      } catch (error) {
         if (modeFlags !== 0x80 && modeFlags !== 0x40) {
            console.error('Error writing mode:', modeFlags, error);
            this.showPopup('Error writing mode', false);
         }
      } finally {
         this.gattOperationInProgress = false;
         if (shouldRead) {
            this.ReadMode();
         }
      }
   }

   private handleCacheData(value: DataView): void {
      const rawData = new Uint8Array(value.buffer);
      if (rawData[18] == 0xaf && rawData[19] == 0xaf) {
         this.dataLoggerTransfer = true;
         return;
      }

      if (rawData != null && rawData[9] !== 0xff && rawData[8] !== 0xff && rawData[9] !== 0xaf && rawData[8] !== 0xaf) {
         this.pendingData.push(rawData);
         clearTimeout(this.timerForPendingData as NodeJS.Timeout);
         this.timerForPendingData = setTimeout(() => {
            this.processPendingData();
         }, 2500);
      }
   }

   private processPendingData(): void {
      this.pendingData.sort((a, b) => {
         const timestampA = this.readTimeStamp(a);
         const timestampB = this.readTimeStamp(b);
         return timestampA - timestampB;
      });

      this.pendingData.forEach((rawData) => {
         if (rawData != null && rawData[9] !== 0xff && rawData[8] !== 0xff && rawData[9] !== 0xaf && rawData[8] !== 0xaf) {
            this.addRawDataToQueue(rawData, true);
         }
      });

      this.pendingData = [];
   }

   private isTransferComplete: boolean = false;

   // private timer: Date | null = null; TODO: Remove this
   // private startTime: number | null = null;

   private async handleDataLoggerData(value: DataView): Promise<void> {
      const rawData = new Uint8Array(value.buffer);

      if (rawData != null && rawData.every((byte) => byte === 0xff)) {
         this.isTransferComplete = true;
         if (this.dataloggerPendingData.length > 0) {
            await this.writeDataLoggerData(this.dataloggerPendingData);
            this.dataloggerPendingData = new Uint8Array(0);
         }
         await new Promise((resolve) => setTimeout(resolve, 300));
         await this.eraseDataLoggerData();
         this.dataLoggerTransfer = false;

         // if (this.startTime) {
         //    const endTime = Date.now();
         //    const duration = endTime - this.startTime;
         //    console.log(`Durée du transfert : ${duration / 1000} s`);
         //    this.startTime = null;
         // }
      } else if (
         rawData[0] !== 0xff &&
         rawData[1] !== 0xff &&
         rawData[2] !== 0xff &&
         rawData[3] !== 0xff &&
         rawData[18] !== 0xaf &&
         rawData[19] !== 0xaf &&
         rawData[8] !== 0xff &&
         rawData[9] !== 0xff &&
         rawData[10] !== 0xff &&
         rawData[11] !== 0xff &&
         rawData[12] !== 0xff &&
         rawData[13] !== 0xff &&
         this.isTransferComplete === false
      ) {
         // console.log('data received');
         // if (this.timer == null) {
         //    this.timer = new Date();
         //    this.startTime = Date.now();
         // }

         this.storeApi?.setState({ isDownloadingDataLogger: true });
         const newArray = new Uint8Array(this.dataloggerPendingData.length + rawData.length);
         newArray.set(this.dataloggerPendingData, 0);
         newArray.set(rawData, this.dataloggerPendingData.length);
         this.dataloggerPendingData = newArray;
      }
   }

   public handleRTData(value: DataView): void {
      const rawData = new Uint8Array(value.buffer);

      if (rawData != null && rawData[9] !== 0xff && rawData[8] !== 0xff && rawData[9] !== 0xaf && rawData[8] !== 0xaf) {
         this.addRawDataToQueue(rawData, false);

         const measuresData = {
            pm1: (((rawData[9] & 0xff) << 8) | (rawData[8] & 0xff)) / 10,
            pm10: (((rawData[13] & 0xff) << 8) | (rawData[12] & 0xff)) / 10,
            pm25: (((rawData[11] & 0xff) << 8) | (rawData[10] & 0xff)) / 10,
            temp: ((rawData[15] & 0xff) << 8) | (rawData[14] & 0xff),
            hum: ((rawData[17] & 0xff) << 8) | (rawData[16] & 0xff),
         };
         this.updateMeasuresData(measuresData);
      }
   }

   private addRawDataToQueue(rawData: Uint8Array, isIMData: boolean): void {
      if (!this.storeApi) {
         return;
      }
      const datasForChart = this.storeApi?.getState().datasForChart;
      if (datasForChart.length >= 7200) {
         datasForChart.shift();
      }
      datasForChart.push(rawData);
      if (isIMData == true) {
         datasForChart.sort((a, b) => {
            const timestampA = this.readTimeStamp(a);
            const timestampB = this.readTimeStamp(b);
            return timestampA - timestampB;
         });
      }
      this.updateDatasForChart(datasForChart);
      if (this.isOnlineRecording) {
         this.handleOnlineRecording(rawData);
      }
   }

   private async handleOnlineRecording(rawData: Uint8Array): Promise<void> {
      if (this.recordId === 0) {
         try {
            const accessToken = this.getAccessToken();
            if (!accessToken) {
               throw new Error('No access token available');
            }
            const response = await authFetch(`${API_URL}/records/${this.PMScanObj.databaseId}`, {
               method: 'POST',
               body: JSON.stringify({
                  data: this.uint8ArrayToBase64(rawData),
                  name: this.PMScanObj.deviceName + '-' + new Date().toISOString().split('.')[0].replace('T', ' '),
                  type: 'Local record',
               }),
            });
            const data = await response.json();

            this.recordId = data.id;
         } catch (error) {
            console.error('Error registering record:', error);
            this.showPopup('Error registering record:', false);
         }
      } else {
         try {
            const accessToken = this.getAccessToken();
            if (!accessToken) {
               throw new Error('No access token available');
            }
            await authFetch(`${API_URL}/records/append-data/${this.recordId}`, {
               method: 'PATCH',
               body: JSON.stringify({
                  data: this.uint8ArrayToBase64(rawData),
                  name: this.PMScanObj.deviceName + '-' + new Date().toISOString(),
               }),
            });
         } catch (error) {
            console.error('Error updating record:', error);
            this.showPopup('Error updating record:', false);
         }
      }
   }

   public async eraseDataLoggerData(): Promise<void> {
      if (!this.service) return;

      try {
         this.storeApi?.setState({ isErasingDataLogger: true });
         this.storeApi?.setState({ isDownloadingDataLogger: false });
         await this.writeMode(0x08, true, false);
         this.updatePMScanObj({ isRecording: false });
         await new Promise((resolve) => setTimeout(resolve, 500)); // sleep 200ms
         await this.writeMode(0x20, false, false);
         await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep 200ms
         await this.ReadMode();
      } catch (error) {
         console.error('Error erasing data logger data:', error);
         this.showPopup('Error erasing data logger data:', false);
      } finally {
         this.storeApi?.setState({ isErasingDataLogger: false });
         this.isTransferComplete = false;
      }
   }

   private async writeDataLoggerData(rawData: Uint8Array): Promise<void> {
      try {
         const accessToken = this.getAccessToken();
         if (!accessToken) {
            throw new Error('No access token available');
         }

         const payload = {
            data: this.uint8ArrayToBase64(rawData),
            name: this.PMScanObj.deviceName + '-' + new Date().toISOString().split('.')[0].replace('T', ' '),
            type: 'Datalogger record',
         };

         await authFetch(`${API_URL}/records/${this.PMScanObj.databaseId}`, {
            method: 'POST',
            body: JSON.stringify(payload),
         });
      } catch (error) {
         console.error('Error registering record:', error);
         this.showPopup('Error registering record:', false);
      }
   }
}
