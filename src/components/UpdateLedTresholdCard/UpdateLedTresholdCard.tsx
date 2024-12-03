import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePopupStore } from '@/stores/popupStore';
import { usePMScanStore } from '@/stores/usePMScanStore';
import { useCallback, useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { uint8ArrayToBase64 } from '@/utils/functions';

const formSchema = z.object({
   yellow: z.number().int().min(0).max(255),
   orange: z.number().int().min(0).max(255),
   red: z.number().int().min(0).max(255),
   purple: z.number().int().min(0).max(255),
});

export const UpdateLedTresholdCard = () => {
   const { PMScanObj, isConnected } = usePMScanStore();
   const [display, setDisplay] = useState<Uint8Array>(PMScanObj.display);
   const { authFetch } = useAuthFetch();
   const showPopup = usePopupStore((state) => state.showPopup);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         yellow: ((display[1] << 8) | display[0]) / 10,
         orange: ((display[3] << 8) | display[2]) / 10,
         red: ((display[5] << 8) | display[4]) / 10,
         purple: ((display[7] << 8) | display[6]) / 10,
      },
      mode: 'onChange',
   });

   useEffect(() => {
      setDisplay(PMScanObj.display);
      form.reset({
         yellow: ((PMScanObj.display[1] << 8) | PMScanObj.display[0]) / 10,
         orange: ((PMScanObj.display[3] << 8) | PMScanObj.display[2]) / 10,
         red: ((PMScanObj.display[5] << 8) | PMScanObj.display[4]) / 10,
         purple: ((PMScanObj.display[7] << 8) | PMScanObj.display[6]) / 10,
      });
   }, [PMScanObj, form, isConnected]);

   const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
      if (isConnected === false) return;

      try {
         const newDisplay = await writeDisplayGatt(values);
         const payload = uint8ArrayToBase64(newDisplay);
         const response = await authFetch(
            `/pmscan/${PMScanObj.databaseId}`,
            {
               body: JSON.stringify({ display: payload }),
            },
            'PATCH',
         );

         if (response.ok) {
            showPopup('success', 'Name updated successfully');
         } else {
            const data = await response.json();
            console.error('Error in updating name:', data);
            showPopup('error', data.message);
         }
      } catch (error) {
         console.error('Error in updating name:', error);
         showPopup('error', 'Failed to update name');
      }
   };

   async function writeDisplayGatt(values: z.infer<typeof formSchema>): Promise<Uint8Array> {
      const currentPMScanObj = usePMScanStore.getState().PMScanObj;
      const newDisplay = new Uint8Array([...currentPMScanObj.display]);
      newDisplay[0] = values.yellow * 10;
      newDisplay[1] = (values.yellow * 10) >> 8;
      newDisplay[2] = values.orange * 10;
      newDisplay[3] = (values.orange * 10) >> 8;
      newDisplay[4] = values.red * 10;
      newDisplay[5] = (values.red * 10) >> 8;
      newDisplay[6] = values.purple * 10;
      newDisplay[7] = (values.purple * 10) >> 8;

      usePMScanStore.setState({
         PMScanObj: {
            ...currentPMScanObj,
            display: newDisplay,
         },
      });

      const { manager } = usePMScanStore.getState();
      manager.writeDisplay(newDisplay);
      return newDisplay;
   }

   const resetTreshold = useCallback(() => {
      if (isConnected === false) return;
      const defaultValues = {
         yellow: 15,
         orange: 30,
         red: 50,
         purple: 80,
      };
      form.reset({
         yellow: defaultValues.yellow,
         orange: defaultValues.orange,
         red: defaultValues.red,
         purple: defaultValues.purple,
      });
      writeDisplayGatt({
         yellow: defaultValues.yellow,
         orange: defaultValues.orange,
         red: defaultValues.red,
         purple: defaultValues.purple,
      });
   }, [form, isConnected]);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Led Intensity</CardTitle>
         </CardHeader>
         <CardContent className="relative">
            <div className={`absolute size-full bg-white opacity-50 ${isConnected ? 'hidden' : ''}`}></div>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
                  <FormField
                     control={form.control}
                     name="yellow"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Yellow</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 {...field}
                                 value={field.value ?? ''}
                                 onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="orange"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Orange</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 {...field}
                                 value={field.value ?? ''}
                                 onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="red"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Red</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 {...field}
                                 value={field.value ?? ''}
                                 onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="purple"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Purple</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 {...field}
                                 value={field.value ?? ''}
                                 onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="col-span-1 mt-4 flex justify-end gap-4 lg:col-span-2">
                     <Button type="submit" className="">
                        Save changes
                     </Button>
                     <Button variant="destructive" onClick={resetTreshold}>
                        Reset to default
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
