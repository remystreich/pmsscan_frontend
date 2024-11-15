import ProtectedLayout from '@/layouts/ProtectedLayout';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import { House, LucideIcon } from 'lucide-react';

interface CustomRouteObject extends Omit<RouteObject, 'children'> {
   icon?: LucideIcon;
   children?: CustomRouteObject[];
}

export const protectedRoutes: CustomRouteObject[] = [
   {
      path: '/',
      element: <ProtectedLayout />,
      children: [
         {
            path: 'home',
            element: <Home />,
            icon: House,
         },
         {
            path: 'hometest',
            element: <Home />,
         },
      ],
   },
];
