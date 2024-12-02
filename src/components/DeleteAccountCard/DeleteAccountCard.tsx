import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { usePopupStore } from '@/stores/popupStore';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

const DeleteAccountCard = () => {
   const { authFetch } = useAuthFetch();
   const navigate = useNavigate();
   const showPopup = usePopupStore((state) => state.showPopup);

   const handleDelete = async () => {
      try {
         const response = await authFetch('/users', {}, 'DELETE');

         if (response.ok) {
            navigate('/');
         } else {
            const data = await response.json();
            showPopup('error', data.message);
         }
      } catch (error) {
         console.error('Error in deleting account:', error);
         showPopup('error', 'Failed to delete account');
      }
   };

   return (
      <Card className="border-destructive bg-red-50">
         <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>Permanently remove your Personal Account and all of its contents</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="mt-4 flex w-full justify-end">
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete your account and remove your data from our
                           servers.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>
         </CardContent>
      </Card>
   );
};

export default DeleteAccountCard;
