
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Mail, KeyRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type ResetFormValues = z.infer<typeof resetSchema>;

interface LoginFormProps {
    onBack: () => void; // Kept for potential future use, but not currently active
}

export function LoginForm({ onBack }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'reset'>('login');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'Login Successful', description: 'Redirecting to dashboard...' });
      router.push('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email inbox for instructions to reset your password.',
      });
      setView('login'); // Switch back to login view after sending
    } catch (error: any) {
        console.error('Password reset error:', error);
        let description = 'An error occurred. Please try again.';
        if (error.code === 'auth/user-not-found') {
            description = 'No user found with this email address.';
        }
        toast({
            title: 'Reset Failed',
            description,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const LoginView = (
    <motion.div key="login" initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-bold text-center mb-1 text-primary">Admin / Counselor Login</h2>
      <p className="text-center text-muted-foreground text-sm mb-6">Enter your credentials to access the portal.</p>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <FormField control={loginForm.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input icon={Mail} type="email" placeholder="you@pixaredu.com" {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={loginForm.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Password</FormLabel><FormControl><Input icon={KeyRound} type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <div className="text-right">
            <Button variant="link" size="sm" type="button" onClick={() => setView('reset')} className="px-0 h-auto text-xs">Forgot Password?</Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Form>
    </motion.div>
  );

  const ResetView = (
    <motion.div key="reset" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-bold text-center mb-1 text-primary">Reset Password</h2>
      <p className="text-center text-muted-foreground text-sm mb-6">Enter your email to receive a password reset link.</p>
      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
          <FormField control={resetForm.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input icon={Mail} type="email" placeholder="Enter your registered email" {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
          <Button variant="link" size="sm" className="w-full text-muted-foreground" onClick={() => setView('login')} type="button">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Button>
        </form>
      </Form>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
        {view === 'login' ? LoginView : ResetView}
    </AnimatePresence>
  );
}
