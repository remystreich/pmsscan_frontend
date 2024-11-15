import { protectedRoutes } from '@/routes/protected.routes';
import { Link } from 'react-router-dom';

const Sidebar = () => {
   return (
      <nav>
         <ul>
            {protectedRoutes.flatMap(
               (route) =>
                  route.children?.map((childRoute) => (
                     <li key={childRoute.path}>
                        <Link to={`/${childRoute.path}`}>
                           {childRoute.path}
                        </Link>
                     </li>
                  )) || [],
            )}
         </ul>
      </nav>
   );
};

export default Sidebar;
