import ProtectedLayout from '@/layouts/ProtectedLayout';
import { RouteObject } from 'react-router-dom';
import { House, LucideIcon, Clipboard, UserRoundPen, Settings, ChartLine } from 'lucide-react';
import Home from '@/pages/Home/Home';
import RecordsPage from '@/pages/Records/RecordsPage';
import AccountSettings from '@/pages/AccountSettings/AccountSettings';
import PMScanSettings from '@/pages/PMScanSettings/PMScanSettings';
import RealTimeView from '@/pages/RealTimeView/RealTimeView';

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
            path: 'real-time-view',
            element: <RealTimeView />,
            icon: ChartLine,
         },

         {
            path: 'records',
            element: <RecordsPage />,
            icon: Clipboard,
         },

         {
            path: 'pmscan-settings',
            element: <PMScanSettings />,
            icon: Settings,
         },

         {
            path: 'account-settings',
            element: <AccountSettings />,
            icon: UserRoundPen,
         },
      ],
   },
];
