import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '@/utils/constants';
import { useAuthStore } from '@/stores/authStore';

const formSchema = z.object({
   email: z.string().email('Invalid email').min(1, 'Email is required').max(255),
   password: z.string().min(1, 'Password is required').max(255),
});

export type LoginFormData = z.infer<typeof formSchema>;

export const useLogin = (onSuccess?: () => void, onError?: (message: string) => void) => {
   const { setAccessToken } = useAuthStore();
   const form = useForm<LoginFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: '',
         password: '',
      },
      mode: 'onChange',
   });

   const onSubmit = async (data: LoginFormData) => {
      try {
         const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
         });
         if (!response.ok) {
            throw new Error('Failed to login');
         } else {
            const { access_token } = await response.json();
            setAccessToken(access_token);
            onSuccess?.();
         }
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
         onError?.('Failed to login');
      }
   };

   return {
      form,
      onSubmit,
   };
};
