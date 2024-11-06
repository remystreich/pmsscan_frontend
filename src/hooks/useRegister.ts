import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const API_URL = import.meta.env.VITE_API_URL;

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

export const useRegister = () => {
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
         // const response = await fetch(`${API_URL}/register`, {
         //    method: 'POST',
         //    body: JSON.stringify(data),
         // });
         console.log('Form submitted:', data);
         console.log(API_URL);
      } catch (error) {
         console.error('Registration error:', error);
         // Gérer les erreurs
      }
   };

   return {
      form,
      onSubmit,
   };
};
