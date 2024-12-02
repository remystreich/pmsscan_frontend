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
   name: z.string().min(3, 'Name must be at least 3 characters').max(255),
});

interface UpdateUserNameCardProps {
   userName: string;
   onUserUpdate: (user: User) => void;
}

const UpdateUserNameCard = ({ userName, onUserUpdate }: UpdateUserNameCardProps) => {
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: userName,
      },
      mode: 'onChange',
   });

   useEffect(() => {
      form.reset({ name: userName });
   }, [userName, form]);

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
            showPopup('success', 'Name updated successfully');
         } else {
            const data = await response.json();
            showPopup('error', data.message);
         }
      } catch (error) {
         console.error('Error in updating name:', error);
         showPopup('error', 'Failed to update name');
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Name</CardTitle>
            <CardDescription> {userName} </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input {...field} />
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

export default UpdateUserNameCard;
