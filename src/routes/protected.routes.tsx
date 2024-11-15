import ProtectedLayout from '@/layouts/ProtectedLayout';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home/Home';

export const protectedRoutes: RouteObject[] = [
   {
      path: '/',
      element: <ProtectedLayout />,
      children: [
         {
            path: 'home',
            element: <Home />,
         },
         // Ajoutez d'autres routes protégées ici
      ],
   },
];
