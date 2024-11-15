import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';

const ProtectedLayout = () => {
   return (
      <div>
         <Sidebar />
         <main>
            <Outlet />
         </main>
      </div>
   );
};

export default ProtectedLayout;
