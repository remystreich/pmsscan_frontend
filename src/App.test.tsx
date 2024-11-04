import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
   it('renders without crashing', () => {
      render(<App />);
      const heading = screen.getByText('Vite + React');
      expect(heading).toBeDefined();
   });

   it('increments counter when button is clicked', () => {
      render(<App />);
      const button = screen.getByRole('button');

      expect(button.textContent).includes('count is 0');

      fireEvent.click(button);
      expect(button.textContent).includes('count is 1');
   });
});
