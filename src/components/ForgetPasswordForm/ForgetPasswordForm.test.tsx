import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgetPasswordForm from './ForgetPasswordForm';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('ForgetPasswordForm', () => {
   const mockOnSuccess = vi.fn();
   const mockOnError = vi.fn();
   const mockFetch = vi.fn() as unknown as jest.Mock;
   global.fetch = mockFetch;

   beforeEach(() => {
      mockFetch.mockClear();
      mockOnSuccess.mockClear();
      mockOnError.mockClear();
   });

   it('renders the form with email field', () => {
      render(
         <MemoryRouter>
            <ForgetPasswordForm
               onSuccess={mockOnSuccess}
               onError={mockOnError}
            />
         </MemoryRouter>,
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(
         screen.getByPlaceholderText('email@exemple.com'),
      ).toBeInTheDocument();
      expect(
         screen.getByRole('button', { name: /send reset link/i }),
      ).toBeInTheDocument();
   });

   it('handles successful password reset request', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         json: async () => ({ message: 'Reset email sent' }),
      });

      render(
         <MemoryRouter>
            <ForgetPasswordForm
               onSuccess={mockOnSuccess}
               onError={mockOnError}
            />
         </MemoryRouter>,
      );

      fireEvent.change(screen.getByPlaceholderText('email@exemple.com'), {
         target: { value: 'test@example.com' },
      });

      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

      await waitFor(() => {
         expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
   });

   it('validates email field', async () => {
      render(
         <MemoryRouter>
            <ForgetPasswordForm
               onSuccess={mockOnSuccess}
               onError={mockOnError}
            />
         </MemoryRouter>,
      );

      fireEvent.change(screen.getByPlaceholderText('email@exemple.com'), {
         target: { value: 'invalid-email' },
      });

      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

      expect(
         await screen.findByText(/invalid email address/i),
      ).toBeInTheDocument();
   });
});
