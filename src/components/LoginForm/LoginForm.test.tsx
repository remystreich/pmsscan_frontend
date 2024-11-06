import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import '@testing-library/jest-dom';
import React from 'react';

describe('LoginForm', () => {
   it('renders all form fields and submit button', () => {
      render(<LoginForm onLoginSuccess={() => {}} onLoginError={() => {}} />);

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
