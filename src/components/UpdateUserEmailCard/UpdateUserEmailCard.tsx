import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { usePopupStore } from '@/stores/popupStore';
import { useEffect } from 'react';
import { User } from '@/types/types';

const formSchema = z.object({
   email: z.string().email('Invalid email').min(1, 'Email is required').max(255),
});

interface UpdateUserEmailCardProps {
   userEmail: string;
   onUserUpdate: (user: User) => void;
}

const UpdateUserEmailCard = ({ userEmail, onUserUpdate }: UpdateUserEmailCardProps) => {
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: userEmail,
      },
      mode: 'onChange',
   });

   useEffect(() => {
      form.reset({ email: userEmail });
   }, [userEmail, form]);

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
            const data = await response.json();
            onUserUpdate(data);
            showPopup('success', 'Email updated successfully');
         } else {
            const data = await response.json();
            throw new Error(data.message);
         }
      } catch (error) {
         console.error('Error in updating email:', error);
         showPopup('error', 'Failed to update email');
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription> {userEmail} </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input type="email" placeholder="Email" {...field} />
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

export default UpdateUserEmailCard;
