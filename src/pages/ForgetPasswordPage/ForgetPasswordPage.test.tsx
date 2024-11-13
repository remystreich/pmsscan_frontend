import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForgetPasswordPage from './ForgetPassordPage';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('ForgetPasswordPage', () => {
   it('renders all form fields and submit button', () => {
      render(
         <BrowserRouter>
            <ForgetPasswordPage />
         </BrowserRouter>,
      );

      // Vérifier la présence des champs par leur placeholder
      expect(
         screen.getByPlaceholderText('email@exemple.com'),
      ).toBeInTheDocument();

      // Vérifier la présence des labels
      expect(screen.getByText('Email')).toBeInTheDocument();

      // Vérifier le bouton submit
      expect(
         screen.getByRole('button', { name: /send reset link/i }),
      ).toBeInTheDocument();
   });
});
