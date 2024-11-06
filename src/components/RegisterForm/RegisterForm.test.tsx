import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';
import '@testing-library/jest-dom';
import React from 'react';

describe('RegisterForm', () => {
   it('renders all form fields and submit button', () => {
      render(<RegisterForm onRegisterSuccess={() => {}} onRegisterError={() => {}} />);

      // Vérifier la présence des champs par leur placeholder
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
      expect(
         screen.getByPlaceholderText('Confirm your password'),
      ).toBeInTheDocument();

      // Vérifier la présence des labels
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Confirm Password')).toBeInTheDocument();

      // Vérifier le bouton submit
      expect(
         screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument();
   });

   it('toggles password visibility when eye icon is clicked', async () => {
      render(
         <RegisterForm
            onRegisterSuccess={() => {}}
            onRegisterError={() => {}}
         />,
      );
      const user = userEvent.setup();

      // Sélectionner le champ password par son placeholder
      const passwordInput = screen.getByPlaceholderText('Your password');
      const toggleButton = passwordInput.parentElement?.querySelector('button');

      expect(passwordInput).toHaveAttribute('type', 'password');

      if (toggleButton) {
         await user.click(toggleButton);
         expect(passwordInput).toHaveAttribute('type', 'text');

         await user.click(toggleButton);
         expect(passwordInput).toHaveAttribute('type', 'password');
      }
   });

   it('displays validation errors for invalid inputs', async () => {
      render(
         <RegisterForm
            onRegisterSuccess={() => {}}
            onRegisterError={() => {}}
         />,
      );
      const user = userEvent.setup();

      // Soumettre le formulaire vide
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Vérifier les messages d'erreur
      expect(
         await screen.findByText(/Name must be at least 3 characters/i),
      ).toBeInTheDocument();
      expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
      expect(
         await screen.findByText(/Password must be at least 8 characters/i),
      ).toBeInTheDocument();
   });

   it('displays validation errors for passwords that do not match', async () => {
      render(
         <RegisterForm
            onRegisterSuccess={() => {}}
            onRegisterError={() => {}}
         />,
      );
      const user = userEvent.setup();

      // Remplir les champs
      await user.type(
         screen.getByPlaceholderText('Your password'),
         'password123',
      );
      await user.type(
         screen.getByPlaceholderText('Confirm your password'),
         'password456',
      );

      // Soumettre le formulaire
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Vérifier le message d'erreur
      expect(
         await screen.findByText(/Passwords do not match/i),
      ).toBeInTheDocument();
   });
});
