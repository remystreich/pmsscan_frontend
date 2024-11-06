import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import pmscan_belt_photo from '@/assets/pmscan_belt_photo.webp';
import { RegisterForm } from '@/components/RegisterForm/RegisterForm';
import { LoginForm } from '@/components/LoginForm/LoginForm';
import TERA_logotype from '@/assets/TERA_logotype.webp';

const AuthPage = () => {
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
            <Tabs
               defaultValue="register"
               className="grid w-full lg:max-w-[500px]"
            >
               <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="register">Register</TabsTrigger>
                  <TabsTrigger value="login">Login</TabsTrigger>
               </TabsList>
               <TabsContent value="register">
                  <RegisterForm />
               </TabsContent>
               <TabsContent value="login">
                  <LoginForm />
               </TabsContent>
            </Tabs>
         </div>
      </main>
   );
};

export default AuthPage;
