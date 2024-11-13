import TERA_logotype from '@/assets/TERA_logotype.webp';
import pmscan_belt_photo from '@/assets/pmscan_belt_photo.webp';

type AuthLayoutProps = {
   children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
   return (
      <main className="grid grid-cols-1 items-center justify-center lg:h-screen lg:grid-cols-2">
         <div className="m-10 lg:hidden">
            <img src={TERA_logotype} alt="TERA_logotype" />
         </div>
         <div className="col-span-1 hidden h-full lg:block">
            <img
               src={TERA_logotype}
               alt="TERA_logotype"
               className="absolute left-10 top-10 w-52"
            />
            <img
               src={pmscan_belt_photo}
               alt="mscan_belt_photo"
               className="h-full w-full object-fill object-right"
            />
         </div>
         <div className="col-span-1 flex flex-col items-center justify-center p-5">
            {children}
         </div>
      </main>
   );
};

export default AuthLayout;
