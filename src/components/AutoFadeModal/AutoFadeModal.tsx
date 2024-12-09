import React, { useEffect } from 'react';

interface AutoFadeModalProps {
   isVisible: boolean;
   delay: number;
   children: React.ReactNode;
   onClose?: () => void;
}

const AutoFadeModal: React.FC<AutoFadeModalProps> = ({ isVisible, delay, children, onClose }) => {
   useEffect(() => {
      if (isVisible && onClose) {
         const timer = setTimeout(() => {
            onClose();
         }, delay);
         return () => clearTimeout(timer);
      }
   }, [isVisible, delay, onClose]);

   return (
      <div
         className={`${isVisible ? 'fixed' : 'hidden'} fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80`}
      >
         <div className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-10 py-5">
            {children}
         </div>
      </div>
   );
};

export default AutoFadeModal;
