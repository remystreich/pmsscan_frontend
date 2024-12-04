import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AcquisitionIntervalSlider } from '@/components/AcquisitionIntervalSlider/AcquisitionIntervalSlider';

export const UpdateAcquisitionIntervalCard = () => {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Acquisition interval</CardTitle>
         </CardHeader>
         <CardContent>
            <AcquisitionIntervalSlider />
         </CardContent>
      </Card>
   );
};
