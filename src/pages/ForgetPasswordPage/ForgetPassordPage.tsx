import InfoPopup from '@/components/InfoPopUp/InfoPopUp';
import { Button } from '@/components/ui/button';
import { useInfoPopup } from '@/hooks/useInfoPopUp';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import ForgetPasswordForm from '@/components/ForgetPasswordForm/ForgetPasswordForm';

const ForgetPasswordPage = () => {
   const { popupState, showPopup } = useInfoPopup();

   const handleSuccess = (message: string) => {
      showPopup('success', message);
   };

   const handleError = (message: string) => {
      showPopup('error', message);
   };

   return (
      <AuthLayout>
         <ForgetPasswordForm onSuccess={handleSuccess} onError={handleError} />
         <InfoPopup
            message={popupState.message}
            type={popupState.type}
            isVisible={popupState.isVisible}
         />
      </AuthLayout>
   );
};

export default ForgetPasswordPage;
