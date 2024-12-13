import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX } from 'lucide-react';
import { useRecordStore } from '@/stores/recordsStore';

const formSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters').max(255),
});

type UpdateDeviceNameCardProps = {
   recordName: string;
   recordId: number;
   onClose: () => void;
};

export const ChangeRecordNameModal = ({ recordName, recordId, onClose }: UpdateDeviceNameCardProps) => {
   const { updateRecordName } = useRecordStore();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: {
         name: recordName,
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      await updateRecordName(recordId, values.name);
      onClose();
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
