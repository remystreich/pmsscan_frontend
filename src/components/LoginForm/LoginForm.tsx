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
import { Link } from 'react-router-dom';

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
                  data-testid="login-form"
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
                                 type="password"
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
            <Link to="/forget-password">
               <p className="text-sm font-semibold underline">
                  Forgot your password?
               </p>
            </Link>
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
