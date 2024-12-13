import { InfoPMScanCard } from '@/components/InfoPmscanCard/InfoPMScanCard';
import { UpdateDeviceNameCard } from '@/components/UpdateDeviceNameCard/UpdateDeviceNameCard';
import { UpdateAcquisitionIntervalCard } from '@/components/UpdateAcquisitionIntervalCard/UpdateAcquisitionIntervalCard';
import { UpdateLedIntensityCard } from '@/components/UpdateLedIntensityCard/UpdateLedIntensityCard';
import { UpdateLedTresholdCard } from '@/components/UpdateLedTresholdCard/UpdateLedTresholdCard';
import { Button } from '@/components/ui/button';
import { usePMScanStore } from '@/stores/usePMScanStore';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import AutoFadeModal from '@/components/AutoFadeModal/AutoFadeModal';

export const PMScanSettings = () => {
   const { resetToFactory, eraseDataLoggerData, isConnected } = usePMScanStore();
   const [isErasing, setIsErasing] = useState(false);

   const eraseMemory = () => {
      setIsErasing(true);
      eraseDataLoggerData();
      setTimeout(() => {
         setIsErasing(false);
      }, 2000);
   };

   return (
      <section className="relative p-1">
         <h1 className="p-2 text-3xl font-bold lg:p-4">PMcan settings</h1>
         <div className="flex flex-col gap-4 p-2 lg:p-4">
            <InfoPMScanCard />
            <UpdateDeviceNameCard />
            <UpdateAcquisitionIntervalCard />
            <UpdateLedIntensityCard />
            <UpdateLedTresholdCard />
            <div className="relative my-4 flex w-full items-center justify-center gap-10">
               <Button variant="destructive" onClick={resetToFactory}>
                  Reset to factory
               </Button>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive">EraseMemory</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action will erase all the data stored in the memory of the PMScan.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={eraseMemory}>Continue</AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
               <div className={`absolute size-full bg-white opacity-50 ${isConnected ? 'hidden' : ''}`}></div>
            </div>
         </div>

         <AutoFadeModal isVisible={isErasing}>
            <div className="flex items-center justify-center gap-1">
               <p className="text-xl">Erasing datas...</p>
               <LoaderCircle className="size-8 animate-spin" />
            </div>
         </AutoFadeModal>
      </section>
   );
};
