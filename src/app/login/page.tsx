'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
  initiateAnonymousSignIn,
} from '@/firebase/non-blocking-login';
import { useAuth, useUser } from '@/firebase';

import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { Film, Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/home');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleEmailLogin(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      initiateEmailSignIn(auth, values.email, values.password);
    } catch (error: any) {
      handleAuthError(error);
    } 
  }

  async function handleEmailSignUp(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      initiateEmailSignUp(auth, values.email, values.password);
    } catch (error: any) {
      handleAuthError(error);
    }
  }

  async function handleAnonymousLogin() {
    setIsLoading(true);
    try {
      initiateAnonymousSignIn(auth);
    } catch (error: any) {
      handleAuthError(error);
    }
  }

  function handleAuthError(error: any) {
    setIsLoading(false);
    let description = "An unexpected error occurred. Please try again.";
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
                description = "No account found with this email. Please sign up.";
                break;
            case 'auth/wrong-password':
                description = "Incorrect password. Please try again.";
                break;
            case 'auth/email-already-in-use':
                description = "An account already exists with this email address.";
                break;
            default:
                description = error.message;
        }
    }
    toast({
      variant: 'destructive',
      title: 'Authentication Error',
      description,
    });
  }

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Film className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle>Remian Edit Studio</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
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
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="flex flex-col gap-2 md:flex-row">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={form.handleSubmit(handleEmailSignUp)}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="animate-spin" />}
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAnonymousLogin}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Sign in Anonymously
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
