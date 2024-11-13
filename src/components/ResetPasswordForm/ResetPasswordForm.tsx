import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '@/utils/constants';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z
   .object({
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

interface ResetPasswordFormProps {
   resetToken: string;
   onSuccess: (message: string) => void;
   onError: (message: string) => void;
}

const ResetPasswordForm = ({
   resetToken,
   onSuccess,
   onError,
}: ResetPasswordFormProps) => {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { password: '', confirmPassword: '' },
      mode: 'onChange',
   });

   const [showPassword, setShowPassword] = useState(false);

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
         const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               password: values.password,
               token: resetToken,
            }),
         });

         if (!response.ok) {
            const data = await response.json();
            onError(data.message);
            return;
         }

         onSuccess('Password reset successfully');
      } catch (error) {
         console.error('Error resetting password:', error);
         onError('An error occurred. Please try again later.');
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Ask for a password reset</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  noValidate
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <div className="relative">
                                 <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Your password"
                                    {...field}
                                 />
                                 <button
                                    type="button"
                                    onClick={() =>
                                       setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                 >
                                    {showPassword ? (
                                       <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                       <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                 </button>
                              </div>
                           </FormControl>
                           <FormDescription>
                              Password must contain at least 8 characters, 1
                              uppercase letter, 1 lowercase letter, 1 number and
                              1 special character
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="confirmPassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Confirm Password</FormLabel>
                           <FormControl>
                              <div className="relative">
                                 <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Your password"
                                    {...field}
                                 />
                                 <button
                                    type="button"
                                    onClick={() =>
                                       setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                 >
                                    {showPassword ? (
                                       <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                       <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                 </button>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit">Reset password</Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

export default ResetPasswordForm;
