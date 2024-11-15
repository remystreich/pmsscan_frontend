import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';

const ProtectedLayout = () => {
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
