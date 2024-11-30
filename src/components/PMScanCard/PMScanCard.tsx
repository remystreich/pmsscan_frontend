import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePMScanStore } from '@/stores/usePMScanStore';
import { PMScan } from '@/types/types';
import { useEffect, useState } from 'react';
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
import useDeletePMScan from '@/hooks/useDeletePMScan';
import { useInfoPopup } from '@/hooks/useInfoPopUp';
import InfoPopup from '@/components/InfoPopUp/InfoPopUp';

interface PMScanCardProps {
   pmscan: PMScan;
}

const PMScanCard = ({ pmscan }: PMScanCardProps) => {
   const { isConnected, PMScanObj, mode } = usePMScanStore();
   const [isPMscanConnected, setIsPmscanConnected] = useState(false);
   const [memoryState, setMemoryState] = useState('');
   const deletePMScan = useDeletePMScan();
   const { showPopup, popupState } = useInfoPopup();

   const handleDelete = async () => {
      try {
         await deletePMScan(pmscan.id);
         console.log('PMScan deleted successfully');
         showPopup('success', 'PMScan deleted successfully');
      } catch (error) {
         console.error('Error in PMScan deletion:', error);
         showPopup('error', 'Failed to delete PMScan');
      }
   };

   useEffect(() => {
      if (pmscan.deviceName === PMScanObj.deviceName && isConnected === true) {
         setIsPmscanConnected(true);
      } else {
         setIsPmscanConnected(false);
      }

      if (PMScanObj.externalMemory == false) {
         setMemoryState('none');
      } else if (mode.memoryFull) {
         setMemoryState('full');
      } else if (mode.memoryEmpty && !mode.acquisitionStarted) {
         setMemoryState('ready');
      } else if (mode.acquisitionStarted && !mode.memoryFull) {
         setMemoryState('recording');
      } else if (!mode.memoryFull && !mode.memoryEmpty && !mode.acquisitionStarted) {
         setMemoryState('record stopped');
      }
   }, [pmscan.deviceName, PMScanObj, isConnected, mode]);

   return (
      <>
         <Card className="col-span-1">
            <div className="flex items-center gap-2 pl-2 pt-1">
               <span className={`size-3 rounded-full ${isPMscanConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
               <p className="text-sm">{pmscan.deviceName} </p>
            </div>
            <CardHeader>
               <CardTitle className="text-center"> {pmscan.name} </CardTitle>
            </CardHeader>
            <CardContent>
               {isConnected ? (
                  <div className="flex items-center justify-around">
                     <p>Memory: {memoryState} </p>
                  </div>
               ) : (
                  <div className="flex items-center justify-around">
                     <p>Device disconnected</p>
                  </div>
               )}
            </CardContent>
            <CardFooter>
               <div className="flex w-full justify-end">
                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                           <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove your data from
                              our servers.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </div>
            </CardFooter>
         </Card>
         <InfoPopup message={popupState.message} type={popupState.type} isVisible={popupState.isVisible} />
      </>
   );
};

export default PMScanCard;
