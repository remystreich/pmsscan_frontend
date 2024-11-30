import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock the custom hooks
vi.mock('@/hooks/usePMScanListFetch', () => ({
   usePMScanListFetch: vi.fn(() => ({
      pmscans: [
         { id: 1, deviceName: 'Device 1' },
         { id: 2, deviceName: 'Device 2' },
      ],
      isLoading: false,
      error: null,
   })),
}));

import { usePMScanListFetch } from '../../hooks/usePMScanListFetch';

describe('Home', () => {
   const renderWithRouter = (component: React.ReactNode) => {
      return render(<BrowserRouter>{component}</BrowserRouter>);
   };

   it('renders without crashing', () => {
      renderWithRouter(<Home />);
   });

   it('displays loading state', () => {
      const mockUsePMScanListFetch = vi.fn().mockReturnValue({
         pmscans: [],
         isLoading: true,
         error: null,
      });
      vi.mocked(usePMScanListFetch).mockImplementation(mockUsePMScanListFetch);
      renderWithRouter(<Home />);
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
   });

   it('displays error message', () => {
      const mockUsePMScanListFetch = vi.fn().mockReturnValue({
         pmscans: [],
         isLoading: false,
         error: 'Error message',
      });
      vi.mocked(usePMScanListFetch).mockImplementation(mockUsePMScanListFetch);
      renderWithRouter(<Home />);
      expect(screen.getByText('Erreur: Error message')).toBeInTheDocument();
   });
});
