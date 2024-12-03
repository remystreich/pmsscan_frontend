import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { usePopupStore } from '@/stores/popupStore';
import { usePMScanStore } from '@/stores/usePMScanStore';
import { useCallback, useEffect, useRef, useState } from 'react';

export const UpdateLedIntensityCard = () => {
   const { PMScanObj, isConnected } = usePMScanStore();
   const showPopup = usePopupStore((state) => state.showPopup);
   const [ledIntensity, setLedIntensity] = useState<number>(PMScanObj.display[8]);
   const timerRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      setLedIntensity(PMScanObj.display[8]);
   }, [PMScanObj, isConnected]);

   const ledValue: { [key: number]: string } = {
      0: '1%',
      1: '1%',
      52: '20%',
      103: '40%',
      154: '60%',
      205: '80%',
      255: '100%',
   };

   const handleSliderChange = useCallback(
      ([value]: [number]) => {
         if (!isConnected) {
            showPopup('error', 'Device is not connected');
            return;
         }
         if (value === 0) value = 1;
         setLedIntensity(value);
         if (timerRef.current) {
            clearTimeout(timerRef.current);
         }

         timerRef.current = setTimeout(() => {
            const currentPMScanObj = usePMScanStore.getState().PMScanObj;
            const newDisplay = currentPMScanObj.display;
            newDisplay[8] = value;
            usePMScanStore.setState({
               PMScanObj: {
                  ...currentPMScanObj,
                  display: newDisplay,
               },
            });

            const { manager } = usePMScanStore.getState();
            manager.writeDisplay(newDisplay);
         }, 500);
      },
      [isConnected, showPopup],
   );

   return (
      <Card>
         <CardHeader>
            <CardTitle>Led Intensity</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="relative flex gap-3">
               <Slider
                  defaultValue={[ledIntensity]}
                  value={[ledIntensity]}
                  min={1}
                  max={255}
                  step={51}
                  onValueChange={handleSliderChange}
               />
               <p className="text-gray-700"> {ledValue[ledIntensity]} </p>
               <div className={`absolute size-full bg-white opacity-50 ${isConnected ? 'hidden' : ''}`}></div>
            </div>
         </CardContent>
      </Card>
   );
};
