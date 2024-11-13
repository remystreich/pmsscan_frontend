import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForgetPasswordPage from '@/pages/ForgetPasswordPage/ForgetPassordPage';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

describe('ForgetPasswordPage', () => {
   it('renders all form fields and submit button', () => {
      render(
         <MemoryRouter>
            <ForgetPasswordPage />
         </MemoryRouter>,
      );

      // Vérifier la présence des champs par leur placeholder
      expect(
         screen.getByPlaceholderText('Enter your email'),
      ).toBeInTheDocument();

      // Vérifier la présence des labels
      expect(screen.getByText('Email')).toBeInTheDocument();

      // Vérifier le bouton submit
      expect(
         screen.getByRole('button', { name: /reset password/i }),
      ).toBeInTheDocument();
   });
});
