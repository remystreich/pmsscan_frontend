import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useAuthStore } from '@/stores/authStore';

const ProtectedLayout = () => {
   const { getAccessToken } = useAuthStore();
   const location = useLocation();

   if (!getAccessToken()) {
      return <Navigate to="/" state={{ from: location }} replace />;
   }

   return (
      <div className="flex h-screen">
         <Sidebar />
         <main className="flex-1 overflow-auto p-8 lg:ml-60">
            <Outlet />
         </main>
      </div>
   );
};

export default ProtectedLayout;
