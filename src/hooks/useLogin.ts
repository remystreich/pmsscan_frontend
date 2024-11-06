import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '@/utils/constants';
import { useAuthStore } from '@/stores/authStore';
const formSchema = z.object({
   email: z
      .string()
      .email('Invalid email')
      .min(1, 'Email is required')
      .max(255),
   password: z.string().min(1, 'Password is required').max(255),
});

export type LoginFormData = z.infer<typeof formSchema>;

export const useLogin = (
   onSuccess?: () => void,
   onError?: (message: string) => void,
) => {
   const { setAccessToken } = useAuthStore();
   const form = useForm<LoginFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   });

   const onSubmit = async (data: LoginFormData) => {
      try {
         console.log(API_URL);
         const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
            body: JSON.stringify(data),
         });
         if (!response.ok) {
            console.error('Login failed');
            throw new Error('Failed to login');
         } else {
            const { access_token } = await response.json();
            setAccessToken(access_token);
            onSuccess?.();
         }
      } catch (error) {
         console.error('Login error:', error);
         onError?.('Failed to login');
      }
   };

   return {
      form,
      onSubmit,
   };
};
