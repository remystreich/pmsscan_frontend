import { Button } from '@/components/ui/button';
import { usePMScanStore } from '@/stores/usePMScanStore';
import { Wifi } from 'lucide-react';

const Header = () => {
   const { isConnected, connect, disconnect, PMScanObj } = usePMScanStore();

   const handleButtonClick = () => {
      if (isConnected) {
         disconnect();
      } else {
         connect();
      }
   };

   return (
      <header className="bg-card p-2 shadow-md">
         <div className="flex flex-col lg:flex-row">
            <div className="flex flex-1 justify-end lg:order-2">
               <Button
                  variant={isConnected ? 'destructive' : 'default'}
                  onClick={handleButtonClick}
               >
                  {isConnected ? 'Disconnect' : 'Connect'}
               </Button>
            </div>
            <div className="mt-4 flex flex-1 items-center justify-around lg:mt-0">
               {isConnected ? (
                  <>
                     <div className="flex items-center gap-2">
                        <Wifi className="text-primary" />
                        <p>Connected</p>
                     </div>
                     <p>Name</p>
                     {/* <p>Charging: {PMScanObj.charging ? 'Yes' : 'No'}</p> TODO:add name et recording */}
                     <p>Recording</p>
                     <p>Battery: {PMScanObj.battery}%</p>
                  </>
               ) : (
                  <>
                     <div className="flex w-full items-center gap-2">
                        <Wifi />
                        <p>Disconnected</p>
                     </div>
                  </>
               )}
            </div>
         </div>
         <div className="mb-2 mt-5 flex items-center justify-around">
            <div className="flex min-w-20 flex-col items-center justify-center gap-2 rounded-md border border-solid border-emerald-600 px-2 py-1">
               <p className="font-bold text-primary">PM 1</p>
               <p>10</p>
            </div>
            <div className="flex min-w-20 flex-col items-center justify-center gap-2 rounded-md border border-solid border-emerald-600 px-2 py-1">
               <p className="font-bold text-primary">PM 2.5</p>
               <p>10</p>
            </div>
            <div className="flex min-w-20 flex-col items-center justify-center gap-2 rounded-md border border-solid border-emerald-600 px-2 py-1">
               <p className="font-bold text-primary">PM 10</p>
               <p>10</p>
            </div>
         </div>
      </header>
   );
};

export default Header;
