import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '@/utils/constants';

const formSchema = z
   .object({
      name: z.string().min(3, 'Name must be at least 3 characters').max(255),
      email: z
         .string()
         .email('Invalid email')
         .min(1, 'Email is required')
         .max(255),
      password: z
         .string()
         .min(8, 'Password must be at least 8 characters')
         .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
         ),
      confirmPassword: z.string(),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
   });

export type RegisterFormData = z.infer<typeof formSchema>;

export const useRegister = (
   onSuccess?: () => void,
   onError?: (message: string) => void,
) => {
   const form = useForm<RegisterFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: '',
         email: '',
         password: '',
         confirmPassword: '',
      },
   });

   const onSubmit = async (data: RegisterFormData) => {
      try {
         const body = {
            name: data.name,
            email: data.email,
            password: data.password,
         };
         const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
            body: JSON.stringify(body),
         });
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register');
         } else {
            onSuccess?.();
         }
      } catch (error) {
         console.error('Registration error:', error);
         onError?.(
            error instanceof Error ? error.message : 'Failed to register',
         );
      }
   };

   return {
      form,
      onSubmit,
   };
};
