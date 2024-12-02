import AuthLayout from '@/layouts/AuthLayout';
import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { usePopupStore } from '@/stores/popupStore';

const ResetPasswordPage = () => {
   const showPopup = usePopupStore((state) => state.showPopup);
   const navigate = useNavigate();

   const handleSuccess = (message: string) => {
      showPopup('success', message);
      navigate('/');
   };

   const handleError = (message: string) => {
      showPopup('error', message);
   };

   const [searchParams] = useSearchParams();
   const resetToken = searchParams.get('token');

   function isTokenExpired(token: string) {
      try {
         const { exp } = JSON.parse(atob(token.split('.')[1]));
         const now = Date.now() / 1000;
         return exp < now;
      } catch (error) {
         console.error('Error decoding token:', error);
         return true;
      }
   }

   if (!resetToken || isTokenExpired(resetToken)) {
      return (
         <AuthLayout>
            <div className="mt-8 text-center">
               <h2 className="text-2xl font-bold">Invalid reinitialization link</h2>
               <p className="my-4 text-gray-600">Make sure you are using the correct link or request a new one.</p>
               <Link to="/">
                  <p className="text-md font-semibold underline">Back</p>
               </Link>
            </div>
         </AuthLayout>
      );
   }

   return (
      <AuthLayout>
         <ResetPasswordForm resetToken={resetToken} onSuccess={handleSuccess} onError={handleError} />
      </AuthLayout>
   );
};
export default ResetPasswordPage;
