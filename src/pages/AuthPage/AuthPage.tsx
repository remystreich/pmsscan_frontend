import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegisterForm } from '@/components/RegisterForm/RegisterForm';
import { LoginForm } from '@/components/LoginForm/LoginForm';
import { useState } from 'react';
import { useInfoPopup } from '@/hooks/useInfoPopUp';
import InfoPopup from '@/components/InfoPopUp/InfoPopUp';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';

const AuthPage = () => {
   const [activeTab, setActiveTab] = useState('register');
   const { popupState, showPopup } = useInfoPopup();
   const navigate = useNavigate();

   return (
      <AuthLayout>
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="grid w-full lg:max-w-[500px]"
         >
            <TabsList className="grid grid-cols-2">
               <TabsTrigger value="register">Register</TabsTrigger>
               <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="register">
               <RegisterForm
                  onRegisterSuccess={() => {
                     setActiveTab('login');
                     showPopup('success', 'Account created successfully');
                  }}
                  onRegisterError={(message) => {
                     showPopup('error', message);
                  }}
               />
            </TabsContent>
            <TabsContent value="login">
               <LoginForm
                  onLoginSuccess={() => {
                     navigate('/home');
                  }}
                  onLoginError={(message) => {
                     showPopup('error', message);
                  }}
               />
            </TabsContent>
         </Tabs>
         <InfoPopup
            message={popupState.message}
            type={popupState.type}
            isVisible={popupState.isVisible}
         />
      </AuthLayout>
   );
};

export default AuthPage;
