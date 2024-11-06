import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
   email: z
      .string()
      .email('Invalid email')
      .min(1, 'Email is required')
      .max(255),
   password: z.string().min(1, 'Password is required').max(255),
});

export type LoginFormData = z.infer<typeof formSchema>;

export const useLogin = () => {
   const form = useForm<LoginFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   });

   const onSubmit = async (data: LoginFormData) => {
      try {
         // Ici, vous pouvez ajouter votre logique d'API
         console.log('Form submitted:', data);
         // Exemple:
         // await loginUser(data);
      } catch (error) {
         console.error('Login error:', error);
         // Gérer les erreurs
      }
   };

   return {
      form,
      onSubmit,
   };
};
