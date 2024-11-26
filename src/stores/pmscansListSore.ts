import { create } from 'zustand';
import { PMScan } from './usePMScanStore';

interface PMScansListState {
   pmscans: PMScan[];
   isLoading: boolean;
   error: string | null;
   setPMScans: (pmscans: PMScan[]) => void;
   setIsLoading: (isLoading: boolean) => void;
   setError: (error: string | null) => void;
}

export const usePMScansListStore = create<PMScansListState>()((set) => ({
   pmscans: [],
   isLoading: false,
   error: null,
   setPMScans: (pmscans) => set({ pmscans }),
   setIsLoading: (isLoading) => set({ isLoading }),
   setError: (error) => set({ error }),
}));
