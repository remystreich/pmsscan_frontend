import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import Home from './Home';

describe('Home', () => {
   it('renders without crashing', () => {
      render(<Home />);
   });

   it('increments counter when button is clicked', () => {
      render(<Home />);
      const button = screen.getByRole('button');

      expect(button.textContent).includes('count is 0');

      fireEvent.click(button);
      expect(button.textContent).includes('count is 1');
   });
});
