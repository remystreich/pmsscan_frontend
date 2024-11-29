import { Button } from '@/components/ui/button';
import { usePMScanStore } from '@/stores/usePMScanStore';

import { BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, HardDrive, Wifi } from 'lucide-react';

const Header = () => {
   const measuresData = usePMScanStore((state) => state.measuresData);
   const { isConnected, connect, disconnect, PMScanObj, mode } = usePMScanStore();

   const handleButtonClick = () => {
      if (isConnected) {
         disconnect();
      } else {
         connect();
      }
   };

   const batteryState = () => {
      if (PMScanObj.charging === 0) {
         if (PMScanObj.battery == 100) {
            return (
               <div className="flex items-center justify-center gap-1">
                  <BatteryFull className="w-6 text-lime-500" />
                  <p className="lg:text-md text-sm">{PMScanObj.battery}%</p>
               </div>
            );
         } else if (PMScanObj.battery >= 80 && PMScanObj.battery < 100) {
            return (
               <div className="flex items-center justify-center gap-1">
                  <BatteryMedium className="w-6 text-lime-500" />
                  <p className="lg:text-md text-sm">{PMScanObj.battery}%</p>
               </div>
            );
         } else if (PMScanObj.battery < 80 && PMScanObj.battery >= 50) {
            return (
               <div className="flex items-center justify-center gap-1">
                  <BatteryMedium className="w-6 text-yellow-500" />
                  <p className="lg:text-md text-sm">{PMScanObj.battery}%</p>
               </div>
            );
         } else if (PMScanObj.battery < 50 && PMScanObj.battery >= 15) {
            return (
               <div className="flex items-center justify-center gap-1">
                  <BatteryLow className="w-6 text-orange-500" />
                  <p className="lg:text-md text-sm">{PMScanObj.battery}%</p>
               </div>
            );
         } else if (PMScanObj.battery < 15) {
            return (
               <div className="flex items-center justify-center gap-1">
                  <BatteryWarning className="w-6 text-red-500" />
                  <p className="lg:text-md text-sm">{PMScanObj.battery}%</p>
               </div>
            );
         }
      } else {
         switch (PMScanObj.charging) {
            case 1:
               return (
                  <div className="flex items-center justify-center gap-1">
                     <BatteryCharging className="w-6 text-red-500" />
                     <p className="lg:text-md text-sm">Charging</p>
                  </div>
               );

            case 2:
               return (
                  <div className="flex items-center justify-center gap-1">
                     <BatteryCharging className="w-6 text-yellow-500" />
                     <p className="lg:text-md text-sm">Charging</p>
                  </div>
               );

            case 3:
               return (
                  <div className="flex items-center justify-center gap-1">
                     <BatteryCharging className="w-6 text-green-500" />
                     <p className="lg:text-md text-sm">Charging</p>
                  </div>
               );

            default:
               break;
         }
      }
   };

   const pm1Color = () => {
      if (!measuresData) return;
      if (measuresData.pm1 >= 0 && measuresData.pm1 < 8) {
         return 'text-blue-400';
      } else if (measuresData.pm1 >= 8 && measuresData.pm1 < 15) {
         return 'text-green-500';
      } else if (measuresData.pm1 >= 15 && measuresData.pm1 < 21) {
         return 'text-yellow-400';
      } else if (measuresData.pm1 >= 21 && measuresData.pm1 < 36) {
         return 'text-orange-500';
      } else if (measuresData.pm1 >= 36 && measuresData.pm1 < 50) {
         return 'text-red-600';
      } else if (measuresData.pm1 >= 50) {
         return 'text-violet-850';
      }
   };

   const pm25Color = () => {
      if (!measuresData) return;
      if (measuresData.pm25 >= 0 && measuresData.pm25 < 11) {
         return 'text-blue-400';
      } else if (measuresData.pm25 >= 11 && measuresData.pm25 < 21) {
         return 'text-green-500';
      } else if (measuresData.pm25 >= 21 && measuresData.pm25 < 26) {
         return 'text-yellow-400';
      } else if (measuresData.pm25 >= 26 && measuresData.pm25 < 51) {
         return 'text-orange-500';
      } else if (measuresData.pm25 >= 51 && measuresData.pm25 < 75) {
         return 'text-red-600';
      } else if (measuresData.pm25 >= 75) {
         return 'text-violet-850';
      }
   };

   const pm10Color = () => {
      if (!measuresData) return;
      if (measuresData.pm10 >= 0 && measuresData.pm10 < 21) {
         return 'text-blue-400';
      } else if (measuresData.pm10 >= 21 && measuresData.pm10 < 41) {
         return 'text-green-500';
      } else if (measuresData.pm10 >= 41 && measuresData.pm10 < 51) {
         return 'text-yellow-400';
      } else if (measuresData.pm10 >= 51 && measuresData.pm10 < 101) {
         return 'text-orange-500';
      } else if (measuresData.pm10 >= 101 && measuresData.pm10 < 150) {
         return 'text-red-600';
      } else if (measuresData.pm10 >= 150) {
         return 'text-violet-850';
      }
   };

   const recordingState = () => {
      if (PMScanObj.isRecording && PMScanObj.externalMemory) {
         return 'Datalogger Recording';
      } else if (PMScanObj.isRecording && PMScanObj.externalMemory === false) {
         return 'Online Recording';
      } else if (mode.memoryFull) {
         return 'Memory full';
      } else if (!mode.memoryFull && !mode.memoryEmpty && !mode.acquisitionStarted) {
         return 'Record stopped';
      } else {
         return 'Ready';
      }
   };

   return (
      <header className="bg-card p-2 shadow-md">
         <div className="flex flex-col lg:flex-row">
            <div className="flex flex-1 justify-end lg:order-2">
               <Button variant={isConnected ? 'destructive' : 'default'} onClick={handleButtonClick}>
                  {isConnected ? 'Disconnect' : 'Connect'}
               </Button>
            </div>
            <div className="mt-4 flex flex-1 items-center justify-around lg:mt-0">
               {isConnected ? (
                  <>
                     <div className="flex items-center gap-1">
                        <Wifi className="w-5 text-primary" />
                        <p className="lg:text-md text-sm">Connected</p>
                     </div>
                     <p className="lg:text-md text-sm">{PMScanObj.name} </p>
                     <div className="flex items-center gap-1">
                        <HardDrive className="w-4" />
                        <p className="lg:text-md max-w-16 text-sm md:max-w-full"> {recordingState()} </p>
                     </div>
                     <>{batteryState()}</>
                  </>
               ) : (
                  <>
                     <div className="flex w-full items-center gap-2">
                        <Wifi />
                        <p>Disconnected</p>
                     </div>
                  </>
               )}
            </div>
         </div>
         {isConnected ? (
            <div className="mb-2 mt-5 flex items-center justify-around">
               <div className="flex min-w-20 flex-col items-center justify-center gap-2 rounded-md border border-solid border-emerald-600 px-2 py-1">
                  <p className="font-bold text-primary">PM 1</p>
                  <p className={`text-xl font-bold ${pm1Color()}`}> {measuresData?.pm1} </p>
               </div>
               <div className="flex min-w-20 flex-col items-center justify-center gap-2 rounded-md border border-solid border-emerald-600 px-2 py-1">
                  <p className="font-bold text-primary">PM 2.5</p>
                  <p className={`text-xl font-bold ${pm25Color()}`}>{measuresData?.pm25} </p>
               </div>
               <div className="flex min-w-20 flex-col items-center justify-center gap-2 rounded-md border border-solid border-emerald-600 px-2 py-1">
                  <p className="font-bold text-primary">PM 10</p>
                  <p className={`text-xl font-bold ${pm10Color()}`}> {measuresData?.pm10} </p>
               </div>
            </div>
         ) : null}
      </header>
   );
};

export default Header;
