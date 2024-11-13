import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('LoginForm', () => {
   it('renders all form fields and submit button', () => {
      render(
         <MemoryRouter>
            <LoginForm onLoginSuccess={() => {}} onLoginError={() => {}} />
         </MemoryRouter>,
      );

      // Vérifier la présence des champs par leur placeholder
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(
         screen.getByPlaceholderText('Enter your password'),
      ).toBeInTheDocument();

      // Vérifier la présence des labels
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();

      // Vérifier le bouton submit
      expect(
         screen.getByRole('button', { name: /login/i }),
      ).toBeInTheDocument();
   });
});

const mockFetch = vi.fn() as unknown as jest.Mock;
global.fetch = mockFetch;

describe('LoginForm', () => {
   const mockOnLoginSuccess = vi.fn();
   const mockOnLoginError = vi.fn();

   beforeEach(() => {
      mockFetch.mockClear();
      mockOnLoginSuccess.mockClear();
      mockOnLoginError.mockClear();
   });

   it('calls onLoginSuccess on successful login', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         json: async () => ({ access_token: 'mock_token' }),
      });

      render(
         <MemoryRouter>
            <LoginForm
               onLoginSuccess={mockOnLoginSuccess}
               onLoginError={mockOnLoginError}
            />
         </MemoryRouter>,
      );

      fireEvent.change(screen.getByPlaceholderText('Email'), {
         target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
         target: { value: 'password' },
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
         expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
      });
   });

   it('calls onLoginError on failed login', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      render(
         <MemoryRouter>
            <LoginForm
               onLoginSuccess={mockOnLoginSuccess}
               onLoginError={mockOnLoginError}
            />
         </MemoryRouter>,
      );

      fireEvent.change(screen.getByPlaceholderText('Email'), {
         target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
         target: { value: 'wrongpassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
         expect(mockOnLoginError).toHaveBeenCalledWith('Failed to login');
      });
   });

   it('displays validation errors for empty fields', async () => {
      render(
         <MemoryRouter>
            <LoginForm
               onLoginSuccess={mockOnLoginSuccess}
               onLoginError={mockOnLoginError}
            />
         </MemoryRouter>,
      );

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
         expect(screen.getByText('Invalid email')).toBeInTheDocument();
         expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
   });
});
