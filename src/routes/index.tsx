import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { publicRoutes } from './public.routes';

export const router = createBrowserRouter([...publicRoutes] as RouteObject[]);
