import { Button } from '@/components/ui/button';
import { usePMScanListFetch } from '@/hooks/usePMScanListFetch';
import { usePMScanStore } from '@/stores/usePMScanStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PMScan } from '@/types/types';
import { useEffect, useState } from 'react';
import RecordsContent from '@/components/RecordsContent/RecordsContent';
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
import { AcquisitionIntervalSlider } from '@/components/AcquisitionIntervalSlider/AcquisitionIntervalSlider';

const RecordsPage = () => {
   const { pmscans, mode, PMScanObj, isConnected, startOnlineRecording, stopOnlineRecording } = usePMScanStore();
   const { isLoading, error } = usePMScanListFetch();
   const [recordingAction, setRecordingAction] = useState('Start recording');
   const [isDataLoggerSelected, setIsDataLoggerSelected] = useState(true);

   const handleStartRecording = () => {
      console.log('Start recording');
      startOnlineRecording();

      //TODO: Add datalogger recording
   };

   const handleRecordingAction = () => {
      if (recordingAction === 'Stop recording') {
         stopOnlineRecording();
      }
   };

   useEffect(() => {
      if (isConnected === false) {
         setRecordingAction('Start recording');
         return;
      }
      if (mode.memoryEmpty === true && PMScanObj.isRecording === false) {
         setRecordingAction('Start recording');
      }
      if (mode.acquisitionStarted === true && mode.memoryFull === false && PMScanObj.isRecording === true) {
         setRecordingAction('Stop recording and download');
      }
      if (mode.memoryFull === true && PMScanObj.externalMemory === true) {
         setRecordingAction('Download');
      }
      if (
         PMScanObj.isRecording === true &&
         mode.acquisitionStarted === false &&
         mode.memoryFull === false &&
         mode.memoryEmpty === true
      ) {
         setRecordingAction('Stop recording');
      }
      if (Object.values(mode).every((value) => value === false)) {
         setRecordingAction('Download');
      }
   }, [PMScanObj.externalMemory, PMScanObj.isRecording, isConnected, mode]);

   return (
      <>
         <section>
            <div className="flex items-center justify-between px-2">
               <h1 className="p-2 text-3xl font-bold lg:p-4">Records</h1>
               {recordingAction === 'Start recording' ? (
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
               ) : (
                  <Button onClick={handleRecordingAction} disabled={!isConnected}>
                     {' '}
                     {recordingAction}{' '}
                  </Button>
               )}
            </div>
            <div>
               {isLoading && <div>Loading...</div>}
               {error && <div>Error: {error}</div>}
               {pmscans.map((pmscan: PMScan) => (
                  <Accordion key={pmscan.id} type="single" collapsible>
                     <AccordionItem value={pmscan.deviceName}>
                        <AccordionTrigger> {pmscan.name} </AccordionTrigger>
                        <AccordionContent>
                           <RecordsContent pmscanId={pmscan.id} />
                        </AccordionContent>
                     </AccordionItem>
                  </Accordion>
               ))}
            </div>
         </section>
      </>
   );
};

export default RecordsPage;
