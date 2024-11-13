import Home from '@/pages/Home/Home';
import AuthPage from '@/pages/AuthPage/AuthPage';
import ForgetPasswordPage from '@/pages/ForgetPasswordPage/ForgetPassordPage';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject[] = [
   {
      path: '/',
      element: <AuthPage />,
      children: [],
   },
   {
      path: '/home',
      element: <Home />,
   },
   {
      path: '/forget-password',
      element: <ForgetPasswordPage />,
   },
];
