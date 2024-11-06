import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { useRegister } from '@/hooks/useRegister';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type RegisterFormProps = {
   onRegisterSuccess: () => void;
   onRegisterError: (message: string) => void;
};

export function RegisterForm({
   onRegisterSuccess,
   onRegisterError,
}: RegisterFormProps) {
   const { form, onSubmit } = useRegister(onRegisterSuccess, onRegisterError);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
               Create a new account to get started
            </CardDescription>
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
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input placeholder="John Doe" {...field} />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input
                                 type="email"
                                 placeholder="Email"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

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
                                    type={
                                       showConfirmPassword ? 'text' : 'password'
                                    }
                                    placeholder="Confirm your password"
                                    {...field}
                                 />
                                 <button
                                    type="button"
                                    onClick={() =>
                                       setShowConfirmPassword(
                                          !showConfirmPassword,
                                       )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                 >
                                    {showConfirmPassword ? (
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
               </form>
            </Form>
         </CardContent>
         <CardFooter className="flex justify-center">
            <Button
               className="w-full"
               type="submit"
               onClick={form.handleSubmit(onSubmit)}
            >
               Submit
            </Button>
         </CardFooter>
      </Card>
   );
}
