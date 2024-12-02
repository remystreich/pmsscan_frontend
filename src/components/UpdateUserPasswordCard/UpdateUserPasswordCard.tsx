import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { usePopupStore } from '@/stores/popupStore';
import { EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';

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

const UpdateUserPasswordCard = () => {
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);
   const [showPassword, setShowPassword] = useState(false);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         password: '',
         confirmPassword: '',
      },
      mode: 'onChange',
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
         const response = await authFetch(
            '/users',
            {
               body: JSON.stringify(values),
            },
            'PATCH',
         );

         if (response.ok) {
            showPopup('success', 'Password updated successfully');
         } else {
            const data = await response.json();
            showPopup('error', data.message);
         }
      } catch (error) {
         console.error('Error in updating password:', error);
         showPopup('error', 'Failed to update password');
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription> Enter your new password </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <div className="relative">
                                 <Input type={showPassword ? 'text' : 'password'} placeholder="Your password" {...field} />
                                 <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
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
                              Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1
                              special character
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
                                    placeholder="Confirm your password"
                                    {...field}
                                 />
                                 <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
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
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="mt-4 flex w-full justify-end">
                     <Button type="submit" className="">
                        Save changes
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

export default UpdateUserPasswordCard;
