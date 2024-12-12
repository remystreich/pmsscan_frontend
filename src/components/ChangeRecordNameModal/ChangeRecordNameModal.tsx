import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { usePopupStore } from '@/stores/popupStore';
import { CircleX } from 'lucide-react';

const formSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters').max(255),
});

type UpdateDeviceNameCardProps = {
   recordName: string;
   recordId: number;
   onClose: () => void;
   onSuccess: (recordId: number, newName: string) => void;
};

export const ChangeRecordNameModal = ({ recordName, recordId, onClose, onSuccess }: UpdateDeviceNameCardProps) => {
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: {
         name: recordName,
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
         const response = await authFetch(
            `/records/update-record-name/${recordId}`,
            {
               body: JSON.stringify(values),
            },
            'PATCH',
         );
         if (response.ok) {
            showPopup('success', 'Name updated successfully');
            onSuccess(recordId, values.name);
            onClose();
         } else {
            onClose();
            const data = await response.json();
            throw new Error(data.message);
         }
      } catch (error) {
         console.error('Error in updating name:', error);
         showPopup('error', 'Failed to update name');
      }
   };

   return (
      <Card className="relative w-full max-w-screen-sm">
         <button onClick={onClose} className="text-l absolute right-3 top-2 font-bold">
            <CircleX />
         </button>
         <CardHeader>
            <CardTitle>Update record name</CardTitle>
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
                        Save change
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
