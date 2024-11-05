import { StoreApi } from 'zustand';
import { PMScanState } from '../stores/usePMScanStore';
import { PMScanObjType } from '../types/types';

const PMScanServiceUUID = 'f3641900-00b0-4240-ba50-05ca45bf8abc';
const PMScanRTDataUUID = 'f3641901-00b0-4240-ba50-05ca45bf8abc';
const PMScanIMDataUUID = 'f3641902-00b0-4240-ba50-05ca45bf8abc';
const PMScanOTHUUID = 'f3641903-00b0-4240-ba50-05ca45bf8abc';
const PMScanBatteryUUID = 'f3641904-00b0-4240-ba50-05ca45bf8abc';
const PMScanChargingUUID = 'f3641905-00b0-4240-ba50-05ca45bf8abc';
const PMScanTimeUUID = 'f3641906-00b0-4240-ba50-05ca45bf8abc';
const PMScanIntervalUUID = 'f3641907-00b0-4240-ba50-05ca45bf8abc';
const PMScanModeUUID = 'f3641908-00b0-4240-ba50-05ca45bf8abc';
const PMScanDisplayUUID = 'f364190a-00b0-4240-ba50-05ca45bf8abc';

const dt2000 = 946684800;

export class PMScanManager {
   private device: BluetoothDevice | null = null;
   private gatt: BluetoothRemoteGATTServer | null = null;
   private service: BluetoothRemoteGATTService | null = null;
   private shouldConnect: boolean = false;
   private dataLoggerTransfer: boolean = false;
   public PMScanInited: boolean = false;
   public PMScanTime: number = 0;

   private storeApi: StoreApi<PMScanState> | null = null;

   public PMScanObj = {
      name: 'PMScanXXXXXX',
      version: 0,
      mode: 0,
      interval: 0,
      display: new Uint8Array(10),
      battery: 0,
      charging: 0,
      dataLogger: false,
      externalMemory: 0,
   };

   constructor(storeApi?: StoreApi<PMScanState>) {
      if (storeApi) {
         this.storeApi = storeApi;
      }
   }

   private updatePMScanObj(partialObj: Partial<PMScanObjType>) {
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

   async requestDevice(): Promise<void> {
      try {
         this.device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'PMScan' }],
            optionalServices: ['f3641900-00b0-4240-ba50-05ca45bf8abc'],
         });

         if (this.device) {
            this.gatt = this.device.gatt || null;
            this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
            this.shouldConnect = true;
            this.connect();
         }
      } catch (error) {
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
            console.log('Success');
            this.onPMScanConnected(server);
         },
         () => {
            console.log('Failed to reconnect.');
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
      this.PMScanInited = false;
      this.service = await server.getPrimaryService(PMScanServiceUUID);

      try {
         const batteryCharacteristic = await this.service.getCharacteristic(PMScanBatteryUUID);
         const batteryValue = await batteryCharacteristic.readValue();
         this.PMScanObj.battery = batteryValue.getUint8(0);

         await batteryCharacteristic.startNotifications();
         batteryCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
            if (value) {
               this.PMScanObj.battery = value.getUint8(0);
               console.log('battery', this.PMScanObj.battery);
               this.updatePMScanObj({ battery: this.PMScanObj.battery });
            }
         });

         const chargingCharacteristic = await this.service.getCharacteristic(PMScanChargingUUID);
         const chargingValue = await chargingCharacteristic.readValue();
         this.PMScanObj.charging = chargingValue.getUint8(0);

         this.updatePMScanObj({ charging: this.PMScanObj.charging });

         await chargingCharacteristic.startNotifications();
         chargingCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
            if (value) {
               this.PMScanObj.charging = value.getUint8(0);
               this.updatePMScanObj({ charging: this.PMScanObj.charging });
            }
         });

         const timeCharacteristic = await this.service.getCharacteristic(PMScanTimeUUID);
         const timeValue = await timeCharacteristic.readValue();
         this.PMScanTime = timeValue.getUint32(0);

         if (this.PMScanTime === 0) {
            const timeDt2000 = Math.floor(new Date().getTime() / 1000 - dt2000);
            const time = new Uint8Array([
               timeDt2000 & 0xff,
               (timeDt2000 >> 8) & 0xff,
               (timeDt2000 >> 16) & 0xff,
               (timeDt2000 >> 24) & 0xff,
            ]);
            await timeCharacteristic.writeValueWithResponse(time);
         }

         const othCharacteristic = await this.service.getCharacteristic(PMScanOTHUUID);
         const othValue = await othCharacteristic.readValue();
         this.PMScanObj.version = othValue.getUint8(0) >> 2;

         const intervalCharacteristic = await this.service.getCharacteristic(PMScanIntervalUUID);
         const intervalValue = await intervalCharacteristic.readValue();
         this.PMScanObj.interval = intervalValue.getUint8(0);

         const modeCharacteristic = await this.service.getCharacteristic(PMScanModeUUID);
         const modeValue = await modeCharacteristic.readValue();
         const uint8 = modeValue.getUint8(0);
         this.PMScanObj.mode = uint8;
         // TODO: Update mode flags...

         const displayCharacteristic = await this.service.getCharacteristic(PMScanDisplayUUID);
         await displayCharacteristic.writeValueWithResponse(this.PMScanObj.display); //TODO: Récupérer en bdd
         const displayValue = await displayCharacteristic.readValue();
         this.PMScanObj.display = new Uint8Array(displayValue.buffer);

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

         const rtDataCharacteristic = await this.service.getCharacteristic(PMScanRTDataUUID);
         await rtDataCharacteristic.startNotifications();
         rtDataCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = (event.target as BluetoothRemoteGATTCharacteristic)?.value;
            if (value) {
               this.handleRTData(value);
            }
         });

         console.log('inited');
         this.PMScanInited = true;
         //   this.createDeviceCard();
         //   this.updateCard();
         //   this.showInfo("Init finished", false);
         //   document.getElementById("changePseudoInput").value = this.PMScanObj.pseudo || this.PMScanObj.deviceName;
         //   this.updateUI();
      } catch (error) {
         //   this.showInfo(`Connection error`, true);
         this.disconnectDevice();
         console.error(error, 'onPMScanConnected');
      }
   }

   public disconnectDevice(): void {
      if (this.device?.gatt?.connected) {
         this.shouldConnect = false;
         this.device.gatt.disconnect();
         console.log('Disconnected from GATT Server');
      }
   }

   private onDisconnected(): void {
      console.log('PMScan Device disconnected');
      if (this.shouldConnect) {
         this.connect();
      }
   }

   private handleCacheData(value: DataView): void {
      const rawData = new Uint8Array(value.buffer);

      if (rawData != null && rawData[9] !== 0xff && rawData[8] !== 0xff && rawData[9] !== 0xaf && rawData[8] !== 0xaf) {
         // this.addRawDataToQueue(rawData, false);

         const measuresData = {
            pm1gm: (((rawData[9] & 0xff) << 8) | (rawData[8] & 0xff)) / 10,
            pm10gm: (((rawData[13] & 0xff) << 8) | (rawData[12] & 0xff)) / 10,
            pm25gm: (((rawData[11] & 0xff) << 8) | (rawData[10] & 0xff)) / 10,
            temp: ((rawData[15] & 0xff) << 8) | (rawData[14] & 0xff),
            hum: ((rawData[17] & 0xff) << 8) | (rawData[16] & 0xff),
         };

         console.log('Measures Data:', measuresData);
      }
   }

   private handleDataLoggerData(value: DataView): void {
      const rawData = new Uint8Array(value.buffer);

      if (rawData != null && rawData[9] !== 0xff && rawData[8] !== 0xff && rawData[9] !== 0xaf && rawData[8] !== 0xaf) {
         // this.addRawDataToQueue(rawData, false);

         const measuresData = {
            pm1gm: (((rawData[9] & 0xff) << 8) | (rawData[8] & 0xff)) / 10,
            pm10gm: (((rawData[13] & 0xff) << 8) | (rawData[12] & 0xff)) / 10,
            pm25gm: (((rawData[11] & 0xff) << 8) | (rawData[10] & 0xff)) / 10,
            temp: ((rawData[15] & 0xff) << 8) | (rawData[14] & 0xff),
            hum: ((rawData[17] & 0xff) << 8) | (rawData[16] & 0xff),
         };

         console.log('Measures Data:', measuresData);
      }
   }

   public handleRTData(value: DataView): void {
      const rawData = new Uint8Array(value.buffer);

      if (rawData != null && rawData[9] !== 0xff && rawData[8] !== 0xff && rawData[9] !== 0xaf && rawData[8] !== 0xaf) {
         // this.addRawDataToQueue(rawData, false);

         const measuresData = {
            pm1gm: (((rawData[9] & 0xff) << 8) | (rawData[8] & 0xff)) / 10,
            pm10gm: (((rawData[13] & 0xff) << 8) | (rawData[12] & 0xff)) / 10,
            pm25gm: (((rawData[11] & 0xff) << 8) | (rawData[10] & 0xff)) / 10,
            temp: ((rawData[15] & 0xff) << 8) | (rawData[14] & 0xff),
            hum: ((rawData[17] & 0xff) << 8) | (rawData[16] & 0xff),
         };

         console.log('Measures Data:', measuresData);
      }
   }
}
