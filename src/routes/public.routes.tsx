import Home from '@/pages/Home/Home';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject[] = [
   {
      path: '/',
      element: <Home />,
      children: [],
   },
];
