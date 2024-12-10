import { AcquisitionIntervalSlider } from '@/components/AcquisitionIntervalSlider/AcquisitionIntervalSlider';
import AutoFadeModal from '@/components/AutoFadeModal/AutoFadeModal';
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
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface RecordingButtonProps {
   recordingAction: string;
   isConnected: boolean;
   onStartRecording: (isDataLogger: boolean) => void;
   onRecordingAction: () => void;
}

const RecordingButton = ({ recordingAction, isConnected, onStartRecording, onRecordingAction }: RecordingButtonProps) => {
   const [isDataLoggerSelected, setIsDataLoggerSelected] = useState(true);
   const [isStartingRecord, setIsStartingRecord] = useState(false);

   const handleStartRecording = () => {
      onStartRecording(isDataLoggerSelected);
      setIsStartingRecord(true);
      setTimeout(() => {
         setIsStartingRecord(false);
      }, 2500);
   };

   return recordingAction === 'Start recording' ? (
      <>
         <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button disabled={!isConnected}> {recordingAction} </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Recording options</AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                  <div className="mt-3 flex items-center justify-evenly">
                     <button
                        onClick={() => setIsDataLoggerSelected(false)}
                        className={`rounded-md ${isDataLoggerSelected ? 'border border-border' : 'border-2 border-primary'} flex items-center justify-center gap-2 p-2`}
                     >
                        <p className="max-w-20 text-foreground lg:max-w-full">Local recording</p>
                        <span
                           className={`size-4 rounded-full ${isDataLoggerSelected ? 'border-2 border-border' : 'border-4 border-primary'}`}
                        ></span>
                     </button>
                     <button
                        onClick={() => setIsDataLoggerSelected(true)}
                        className={`rounded-md ${isDataLoggerSelected ? 'border-2 border-primary' : 'border border-border'} flex items-center justify-center gap-2 p-2`}
                     >
                        <p className="max-w-20 text-foreground lg:max-w-full">Datalogger recording</p>
                        <span
                           className={`size-4 rounded-full ${isDataLoggerSelected ? 'border-4 border-primary' : 'border-2 border-border'}`}
                        ></span>
                     </button>
                  </div>
                  <div>
                     <h3 className="my-2 text-foreground">Acquisition interval</h3>
                     <AcquisitionIntervalSlider />
                  </div>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStartRecording}>Start recording</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <AutoFadeModal isVisible={isStartingRecord}>
            <div className="flex items-center justify-center gap-1">
               <p className="text-xl">Start recording...</p>
               <LoaderCircle className="size-8 animate-spin" />
            </div>
         </AutoFadeModal>
      </>
   ) : (
      <Button onClick={onRecordingAction} disabled={!isConnected}>
         {recordingAction}
      </Button>
   );
};

export default RecordingButton;
