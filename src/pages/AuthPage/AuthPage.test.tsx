import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import AuthPage from './AuthPage';

describe('AuthPage', () => {
   it('renders register form', () => {
      render(<AuthPage />);
      const registerForm = screen.getByText('Create an account');
      expect(registerForm).toBeDefined();

      const loginTab = screen.getByRole('tab', { name: /login/i });
      fireEvent.click(loginTab);
      expect(screen.getByText('Login')).toBeDefined();
   });

   it('renders login form', () => {
      render(<AuthPage />);
      const loginForm = screen.getByText('Login');
      expect(loginForm).toBeDefined();

      const registerTab = screen.getByRole('tab', { name: /register/i });
      fireEvent.click(registerTab);
      expect(screen.getByText('Create an account')).toBeDefined();
   });

   it('should display the TERA logo', () => {
      render(<AuthPage />);
      const logos = screen.getAllByAltText('TERA_logotype');
      expect(logos.length).toBeGreaterThan(0);
   });

   it('should display the belt photo on desktop view', () => {
      render(<AuthPage />);
      const beltPhoto = screen.getByAltText('mscan_belt_photo');
      expect(beltPhoto).toBeDefined();
   });
});
