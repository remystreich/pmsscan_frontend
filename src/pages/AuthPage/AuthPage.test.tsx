import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from './AuthPage';

// Composant wrapper pour les tests
const AuthPageWithRouter = () => (
   <BrowserRouter>
      <AuthPage />
   </BrowserRouter>
);

describe('AuthPage', () => {
   it('renders register form', () => {
      render(<AuthPageWithRouter />);
      const registerForm = screen.getByText('Create an account');
      expect(registerForm).toBeDefined();

      const loginTab = screen.getByRole('tab', { name: /login/i });
      fireEvent.click(loginTab);
      expect(screen.getByText('Login')).toBeDefined();
   });

   it('renders login form', () => {
      render(<AuthPageWithRouter />);
      const loginForm = screen.getByText('Login');
      expect(loginForm).toBeDefined();

      const registerTab = screen.getByRole('tab', { name: /register/i });
      fireEvent.click(registerTab);
      expect(screen.getByText('Create an account')).toBeDefined();
   });

   it('should display the TERA logo', () => {
      render(<AuthPageWithRouter />);
      const logos = screen.getAllByAltText('TERA_logotype');
      expect(logos.length).toBeGreaterThan(0);
   });

   it('should display the belt photo on desktop view', () => {
      render(<AuthPageWithRouter />);
      const beltPhoto = screen.getByAltText('mscan_belt_photo');
      expect(beltPhoto).toBeDefined();
   });
});
