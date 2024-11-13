import { describe } from 'vitest';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ResetPasswordPage from './ResetPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage/ResetPasswordPage';

vi.mock('react-router-dom', async (importOriginal) => {
   const actual = await importOriginal();
   return {
      ...actual,
      useSearchParams: vi.fn(() => [new URLSearchParams()]),
   };
});

describe('ResetPasswordPage', () => {
   const generateValidToken = () => {
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = { exp: Math.floor(Date.now() / 1000) + 60 * 60 };
      const base64UrlEncode = (obj: object) =>
         Buffer.from(JSON.stringify(obj)).toString('base64url');
      return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.signature`;
   };

   it('renders the correct message when the token is invalid', () => {
      render(
         <BrowserRouter>
            <ResetPasswordPage />
         </BrowserRouter>,
      );

      expect(
         screen.getByText('Invalid reinitialization link'),
      ).toBeInTheDocument();
      expect(
         screen.getByText(
            'Make sure you are using the correct link or request a new one.',
         ),
      ).toBeInTheDocument();
   });

   it('renders all form fields when the token is valid', () => {
      const validToken = generateValidToken();

      (useSearchParams as vi.Mock).mockReturnValue([
         new URLSearchParams({ token: validToken }),
      ]);

      render(
         <BrowserRouter>
            <ResetPasswordPage />
         </BrowserRouter>,
      );

      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Confirm Password')).toBeInTheDocument();
      expect(
         screen.getByRole('button', { name: /reset password/i }),
      ).toBeInTheDocument();
   });
});
