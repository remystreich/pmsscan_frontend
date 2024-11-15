import Home from '@/pages/Home/Home';
import AuthPage from '@/pages/AuthPage/AuthPage';
import ForgetPasswordPage from '@/pages/ForgetPasswordPage/ForgetPassordPage';
import { RouteObject } from 'react-router-dom';
import ResetPasswordPage from '@/pages/ResetPasswordPage/ResetPasswordPage';

export const publicRoutes: RouteObject[] = [
   {
      path: '/',
      element: <AuthPage />,
      children: [],
   },
   {
      path: '/forget-password',
      element: <ForgetPasswordPage />,
   },
   {
      path: '/reset-password',
      element: <ResetPasswordPage />,
   },
];
