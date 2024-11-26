import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/Header/Header';
import useRefreshToken from '@/hooks/useRefreshToken';
import { useEffect, useState, useRef } from 'react';

const ProtectedLayout = () => {
   const accessToken = useAuthStore((state) => state.accessToken);
   const location = useLocation();
   const refresh = useRefreshToken();
   const refreshAttemptedRef = useRef(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const verifyToken = async () => {
         try {
            if (!accessToken && !refreshAttemptedRef.current) {
               refreshAttemptedRef.current = true;
               await refresh();
            }
         } catch (error) {
            console.error('Token verification failed:', error);
         } finally {
            setLoading(false);
         }
      };

      verifyToken();
   }, [accessToken, refresh]);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (!accessToken && !refreshAttemptedRef.current) {
      return <Navigate to="/" state={{ from: location }} replace />;
   }

   return (
      <div className="flex h-screen">
         <Sidebar />
         <main className="flex-1 overflow-auto lg:ml-60">
            <Header />
            <Outlet />
         </main>
      </div>
   );
};

export default ProtectedLayout;
