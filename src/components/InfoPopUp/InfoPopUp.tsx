import React from 'react';
import { PopupType } from '@/hooks/useInfoPopUp';

interface InfoPopupProps {
   message: string;
   type: PopupType;
   isVisible: boolean;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ message, type, isVisible }) => {
   return (
      <div
         className={`fixed left-1/2 z-50 w-5/6 max-w-[600px] -translate-x-1/2 transform rounded-md bg-gray-800 p-1 shadow-md transition-all duration-500 ease-in-out ${
            isVisible ? 'bottom-[100px]' : '-bottom-[100px]'
         }`}
      >
         <div className="flex min-h-10 items-stretch gap-2.5">
            <div
               className={`w-4 ${type === 'error' ? 'bg-red-500' : 'bg-primary'}`}
            />
            <div className="flex flex-col justify-center">
               <p className="text-base text-white">{message}</p>
            </div>
         </div>
      </div>
   );
};

export default InfoPopup;