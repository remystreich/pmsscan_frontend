import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { protectedRoutes } from '@/routes/protected.routes';
import TERA_logotype from '@/assets/TERA_logotype.webp';
import { Button } from '@/components/ui/button';
import useLogout from '@/hooks/useLogout';
import { useInfoPopup } from '@/hooks/useInfoPopUp';
import InfoPopup from '../InfoPopUp/InfoPopUp';

const Sidebar = () => {
   const [isOpen, setIsOpen] = useState(false);

   const { popupState, showPopup } = useInfoPopup();

   const toggleSidebar = () => {
      setIsOpen(!isOpen);
   };

   const { logout, loading, error } = useLogout();
   useEffect(() => {
      if (loading) {
         showPopup('success', 'Logging out...');
      }
      if (error) {
         showPopup('error', error);
      }
   }, [loading, error, showPopup]);

   const handleLogout = () => {
      logout();
   };

   return (
      <div className="relative">
         <button
            onClick={toggleSidebar}
            className="fixed left-2.5 top-1 z-[1010] rounded-lg bg-transparent p-2 text-primary md:block lg:hidden"
         >
            <Menu size={40} />
         </button>

         <aside
            className={`fixed left-0 top-0 h-screen w-full max-w-screen-sm bg-card p-2 text-card-foreground shadow-md transition-transform duration-300 ease-in-out md:w-60 lg:fixed lg:block lg:w-60 ${
               isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
         >
            <h2 className="mt-5 flex items-center justify-center border-b border-border pb-3">
               <Link to="/home" className="flex justify-center gap-2">
                  <p className="mt-1 font-semibold text-primary">PMScan by</p>
                  <img
                     src={TERA_logotype}
                     alt="Logo"
                     className="h-auto w-32 max-w-full"
                  />
               </Link>
            </h2>

            <ul className="my-8 list-none p-0">
               {protectedRoutes.map(
                  (route) =>
                     route.children?.map((childRoute) => {
                        const Icon = childRoute.icon;
                        return (
                           <li key={childRoute.path}>
                              <Link
                                 to={`/${childRoute.path}`}
                                 className="flex items-center gap-2 rounded-md p-2.5 text-card-foreground no-underline transition-all hover:bg-secondary"
                              >
                                 {Icon && <Icon size={20} />}
                                 <span className="capitalize">
                                    {childRoute.path}
                                 </span>
                              </Link>
                           </li>
                        );
                     }) || [],
               )}
            </ul>
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-center border-t border-border py-2">
               <Button onClick={handleLogout} variant="outline">
                  <LogOut /> Logout
               </Button>
            </div>
         </aside>
         <InfoPopup
            message={popupState.message}
            type={popupState.type}
            isVisible={popupState.isVisible}
         />
      </div>
   );
};

export default Sidebar;
