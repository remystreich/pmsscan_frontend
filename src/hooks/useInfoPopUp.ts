import { useState, useCallback, useRef, useEffect } from 'react';

export type PopupType = 'error' | 'success';

interface PopupState {
   isVisible: boolean;
   type: PopupType;
   message: string;
}

interface PopupOptions {
   duration?: number;
}

const DEFAULT_DURATION = 3000;

export const useInfoPopup = (options: PopupOptions = {}) => {
   const [popupState, setPopupState] = useState<PopupState>({
      isVisible: false,
      type: 'success',
      message: '',
   });

   const timerRef = useRef<NodeJS.Timeout>();

   const hidePopup = useCallback(() => {
      setPopupState((prev) => ({ ...prev, isVisible: false }));
   }, []);

   const showPopup = useCallback(
      (type: PopupType, message: string) => {
         // Clear any existing timer
         if (timerRef.current) {
            clearTimeout(timerRef.current);
         }

         setPopupState({
            isVisible: true,
            type,
            message,
         });

         timerRef.current = setTimeout(() => {
            hidePopup();
            timerRef.current = undefined;
         }, options.duration || DEFAULT_DURATION);
      },
      [hidePopup, options.duration],
   );

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (timerRef.current) {
            clearTimeout(timerRef.current);
         }
      };
   }, []);

   return {
      popupState,
      showPopup,
      hidePopup,
   };
};
