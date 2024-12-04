import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePMScanStore } from '@/stores/usePMScanStore';

export const InfoPMScanCard = () => {
   const { PMScanObj, mode, isConnected } = usePMScanStore();

   const memoryState = () => {
      if (PMScanObj.externalMemory == false) {
         return 'none';
      }
      if (mode.memoryFull) {
         return 'full';
      }
      if (mode.acquisitionStarted && !mode.memoryFull) {
         return 'recording';
      }
      if (mode.memoryEmpty && !mode.acquisitionStarted) {
         return 'ready';
      }
      if (!mode.memoryFull && !mode.memoryEmpty && !mode.acquisitionStarted) {
         return 'record stopped';
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>PMScan Informations</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex items-center gap-1">
               <p className="text-lg font-bold">Id:</p>
               <p> {isConnected ? PMScanObj.deviceName : '--'} </p>
            </div>

            <div className="flex items-center gap-1">
               <p className="text-lg font-bold">Firmware version:</p>
               <p> {isConnected ? PMScanObj.version : '--'} </p>
            </div>

            <div className="flex items-center gap-1">
               <p className="text-lg font-bold">Status:</p>
               <p> {isConnected ? 'Connected' : 'Disconnected'} </p>
            </div>

            <div className="flex items-center gap-1">
               <p className="text-lg font-bold">Battery:</p>
               <p> {isConnected ? PMScanObj.battery : '--'} % </p>
            </div>

            <div className="flex items-center gap-1">
               <p className="text-lg font-bold">Memory state:</p>
               <p> {isConnected ? memoryState() : '--'} </p>
            </div>
         </CardContent>
      </Card>
   );
};
