import AuthLayout from '@/layouts/AuthLayout';
import ForgetPasswordForm from '@/components/ForgetPasswordForm/ForgetPasswordForm';
import { usePopupStore } from '@/stores/popupStore';

const ForgetPasswordPage = () => {
   const showPopup = usePopupStore((state) => state.showPopup);

   const handleSuccess = (message: string) => {
      showPopup('success', message);
   };

   const handleError = (message: string) => {
      showPopup('error', message);
   };

   return (
      <AuthLayout>
         <ForgetPasswordForm onSuccess={handleSuccess} onError={handleError} />
      </AuthLayout>
   );
};

export default ForgetPasswordPage;
