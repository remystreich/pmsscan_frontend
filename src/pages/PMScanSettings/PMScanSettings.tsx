import { InfoPMScanCard } from '@/components/InfoPmscanCard/InfoPMScanCard';
import { UpdateDeviceNameCard } from '@/components/UpdateDeviceNameCard/UpdateDeviceNameCard';
import { UpdateAcquisitionIntervalCard } from '@/components/UpdateAcquisitionIntervalCard/UpdateAcquisitionIntervalCard';
import { UpdateLedIntensityCard } from '@/components/UpdateLedIntensityCard/UpdateLedIntensityCard';

export const PMScanSettings = () => {
   return (
      <main>
         <h1 className="p-2 text-3xl font-bold lg:p-4">PMcan settings</h1>
         <div className="flex flex-col gap-4 p-2 lg:p-4">
            <InfoPMScanCard />
            <UpdateDeviceNameCard />
            <UpdateAcquisitionIntervalCard />
            <UpdateLedIntensityCard />
         </div>
      </main>
   );
};
