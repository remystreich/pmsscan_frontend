import { usePMScanListFetch } from '@/hooks/usePMScanListFetch';
import { usePMScanStore } from '@/stores/usePMScanStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { PMScan } from '@/types/types';
import { useEffect, useState } from 'react';
import RecordsContent from '@/components/RecordsContent/RecordsContent';
import AutoFadeModal from '@/components/AutoFadeModal/AutoFadeModal';
import RecordingButton from '@/components/RecordingButton/RecordingButton';

const RecordsPage = () => {
   const {
      pmscans,
      mode,
      PMScanObj,
      isConnected,
      startOnlineRecording,
      stopOnlineRecording,
      startDataloggerRecording,
      downladDataLoggerData,
      isDownloadingDataLogger,
      isErasingDataLogger,
   } = usePMScanStore();

   const { isLoading, error } = usePMScanListFetch();
   const [recordingAction, setRecordingAction] = useState('Start recording');
   const [isDownloading, setIsDownloading] = useState(false);

   const [downloadState, setDownloadState] = useState('Downloading');
   const [progressValue, setProgressValue] = useState(0);
   const [isRunning, setIsRunning] = useState(false);

   const handleStartRecording = (isDataLogger: boolean) => {
      if (isDataLogger) {
         startDataloggerRecording();
      } else {
         startOnlineRecording();
      }
   };

   const handleRecordingAction = () => {
      if (recordingAction === 'Stop recording') {
         stopOnlineRecording();
      } else if (recordingAction === 'Stop recording and download' || recordingAction === 'Download') {
         setIsDownloading(true);
         setProgressValue(0);
         setIsRunning(true);
         downladDataLoggerData();
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
   }, [PMScanObj, isConnected, mode]);

   useEffect(() => {
      if (isDownloadingDataLogger === false && isErasingDataLogger === false) {
         setIsDownloading(false);
      }
      if (isDownloadingDataLogger === true && isErasingDataLogger === false) {
         setDownloadState('Downloading');
      }
      if (isDownloadingDataLogger === false && isErasingDataLogger === true) {
         setDownloadState('Erasing');
         setProgressValue(95);
         setTimeout(() => {
            setProgressValue(100);
            setIsRunning(false);
            setDownloadState('Downloading');
         }, 3000);
      }
   }, [isDownloadingDataLogger, isErasingDataLogger]);

   useEffect(() => {
      let intervalId: NodeJS.Timeout;

      if (progressValue >= 100) {
         setIsDownloading(false);
         return;
      }

      if (isRunning) {
         intervalId = setInterval(() => {
            setProgressValue((prev) => prev + 1);
         }, 919);
      }

      return () => {
         if (intervalId) {
            clearInterval(intervalId);
         }
      };
   }, [isRunning, progressValue]);

   return (
      <>
         <section>
            <div className="flex items-center justify-between px-2">
               <h1 className="p-2 text-3xl font-bold lg:p-4">Records</h1>
               <RecordingButton
                  recordingAction={recordingAction}
                  isConnected={isConnected}
                  onStartRecording={handleStartRecording}
                  onRecordingAction={handleRecordingAction}
               />
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

         <AutoFadeModal isVisible={isDownloading}>
            <div className="flex w-full flex-col items-center justify-center gap-1">
               <p className="text-xl">{downloadState}...</p>
               <div className="flex w-full items-center gap-2">
                  <Progress value={progressValue} />
                  <p>{progressValue}%</p>
               </div>
            </div>
         </AutoFadeModal>
      </>
   );
};

export default RecordsPage;
