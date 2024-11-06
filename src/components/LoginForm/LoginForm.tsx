import { useLogin } from '@/hooks/useLogin';
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
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type LoginFormProps = {
   onLoginSuccess: () => void;
   onLoginError: (message: string) => void;
};

export function LoginForm({ onLoginSuccess, onLoginError }: LoginFormProps) {
   const { form, onSubmit } = useLogin(onLoginSuccess, onLoginError);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
               Enter your credentials to access your account
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  noValidate
                  className="space-y-8"
                  onSubmit={form.handleSubmit(onSubmit)}
               >
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
                              <Input
                                 placeholder="Enter your password"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription></FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </form>
            </Form>
         </CardContent>
         <CardFooter className="flex flex-col items-center gap-6">
            <p className="text-sm font-semibold underline">
               Forgot your password?
            </p>
            {/* TODO: Add forgot password functionality && link to the forgot password page */}
            <Button
               className="w-full"
               type="submit"
               onClick={form.handleSubmit(onSubmit)}
            >
               Login
            </Button>
         </CardFooter>
      </Card>
   );
}
