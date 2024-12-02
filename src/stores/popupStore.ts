import { create } from 'zustand';

type PopupType = 'success' | 'error';

interface PopupState {
   type: PopupType;
   message: string;
   isVisible: boolean;
   showPopup: (type: PopupType, message: string) => void;
   hidePopup: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
   type: 'success',
   message: '',
   isVisible: false,
   showPopup: (type, message) => set({ type, message, isVisible: true }),
   hidePopup: () => set({ isVisible: false }),
}));
