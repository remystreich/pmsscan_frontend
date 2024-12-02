import UpdateUserNameCard from '@/components/UpdateUserNameCard/UpdateUserNameCard';
import { useEffect, useState } from 'react';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';
import { usePopupStore } from '@/stores/popupStore';
import { User } from '@/types/types';
import UpdateUserEmailCard from '@/components/UpdateUserEmailCard/UpdateUserEmailCard';
import UpdateUserPasswordCard from '@/components/UpdateUserPasswordCard/UpdateUserPasswordCard';
import DeleteAccountCard from '@/components/DeleteAccountCard/DeleteAccountCard';

const AccountSettings = () => {
   const getCurrentUser = useGetCurrentUser();
   const showPopup = usePopupStore((state) => state.showPopup);
   const [user, setUser] = useState<User | undefined>(undefined);

   const handleUserUpdate = (updatedUser: User) => {
      setUser(updatedUser);
   };

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const user = await getCurrentUser();
            setUser(user);
         } catch (error) {
            console.error('Error in getting current user:', error);
            showPopup('error', 'Failed to get user');
         }
      };
      fetchUser();
   }, [getCurrentUser, showPopup]);

   return (
      <main>
         <h1 className="p-2 text-3xl font-bold lg:p-4">Update Account credentials</h1>
         <div className="flex flex-col gap-4 p-2 lg:p-4">
            <UpdateUserNameCard userName={user?.name || ''} onUserUpdate={handleUserUpdate} />
            <UpdateUserEmailCard userEmail={user?.email || ''} onUserUpdate={handleUserUpdate} />
            <UpdateUserPasswordCard />
            <DeleteAccountCard />
         </div>
      </main>
   );
};

export default AccountSettings;
