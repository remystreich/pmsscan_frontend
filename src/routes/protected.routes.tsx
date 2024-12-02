import ProtectedLayout from '@/layouts/ProtectedLayout';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import RecordsPage from '@/pages/Records/RecordsPage';
import AccountSettings from '@/pages/AccountSettings/AccountSettings';
import { House, LucideIcon, Clipboard, UserRoundPen } from 'lucide-react';

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
            path: 'records',
            element: <RecordsPage />,
            icon: Clipboard,
         },
         {
            path: 'account-settings',
            element: <AccountSettings />,
            icon: UserRoundPen,
         },
      ],
   },
];
