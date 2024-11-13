import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '@/utils/constants';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const formSchema = z.object({
   email: z.string().email('Invalid email address'),
});

interface ForgetPasswordFormProps {
   onSuccess: (message: string) => void;
   onError: (message: string) => void;
}

const ForgetPasswordForm = ({
   onSuccess,
   onError,
}: ForgetPasswordFormProps) => {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: '',
      },
      mode: 'onChange',
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
         const response = await fetch(
            `${API_URL}/auth/request-reset-password`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
               },
               body: JSON.stringify(values),
            },
         );
         if (response.ok) {
            setSuccessMessage(
               <p>
                  If an account with this email exists, a reset link has been
                  sent.
               </p>,
            );
            onSuccess('Success.');
         }
      } catch (error) {
         console.error('Error sending reset link:', error);
         onError('Error sending reset link.');
      }
   };

   const [successMessage, setSuccessMessage] = useState<React.ReactNode>(null);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
               Enter your user account&apos;s verified email address and we will
               send you a password reset link.
            </CardDescription>
         </CardHeader>
         <CardContent>
            {successMessage || (
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4"
                  >
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="email@exemple.com"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button type="submit" className="w-full">
                        Send reset link
                     </Button>
                  </form>
               </Form>
            )}
         </CardContent>
         <CardFooter>
            <Link
               to="/"
               className="text-sm font-bold text-foreground underline"
            >
               Back to login
            </Link>
         </CardFooter>
      </Card>
   );
};

export default ForgetPasswordForm;
