import { Slider } from '@/components/ui/slider';
import { usePMScanStore } from '@/stores/usePMScanStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePopupStore } from '@/stores/popupStore';

export const AcquisitionIntervalSlider = () => {
   const { PMScanObj, isConnected } = usePMScanStore();
   const showPopup = usePopupStore((state) => state.showPopup);
   const [PMScanInterval, setPMScanInterval] = useState<number>(PMScanObj.interval);
   const timerRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      const defaultValue = convertToSliderValue(PMScanObj.interval);
      setPMScanInterval(defaultValue);
   }, [PMScanObj, isConnected]);

   const convertToSliderValue = (pmValue: number) => Math.abs(pmValue - 5);

   const convertToPMScanValue = (sliderValue: number) => Math.abs(sliderValue - 5);

   const handleSliderChange = useCallback(
      ([value]: [number]) => {
         if (!isConnected) {
            showPopup('error', 'Device is not connected');
            return;
         }
         setPMScanInterval(value);
         if (timerRef.current) {
            clearTimeout(timerRef.current);
         }

         timerRef.current = setTimeout(() => {
            const newValue = convertToPMScanValue(value);
            const currentPMScanObj = usePMScanStore.getState().PMScanObj;

            usePMScanStore.setState({
               PMScanObj: {
                  ...currentPMScanObj,
                  interval: newValue,
               },
            });

            const { manager } = usePMScanStore.getState();
            manager.writeInterval(newValue);
         }, 500);
      },
      [isConnected, showPopup],
   );

   const timeValue: { [key: number]: string } = {
      0: '1s',
      1: '5s',
      2: '10s',
      3: '30s',
      4: '1m',
      5: '5m',
   };

   return (
      <div className="relative flex gap-3">
         <Slider
            defaultValue={[PMScanInterval]}
            value={[PMScanInterval]}
            min={0}
            max={5}
            step={1}
            onValueChange={handleSliderChange}
         />
         <p className="text-gray-700"> {timeValue[PMScanInterval]} </p>
         <div className={`absolute size-full bg-white opacity-50 ${isConnected ? 'hidden' : ''}`}></div>
      </div>
   );
};
