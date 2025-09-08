
'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, UserCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { LoginForm } from '@/components/admin/login-form';
import Image from 'next/image';

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [view, setView] = useState<'selection' | 'login'>('selection');

  useEffect(() => {
    if (user) {
      router.replace('/admin');
    }
  }, [user, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <p className="ml-2">Loading...</p>
      </div>
    );
  }

  const renderInitialSelection = () => (
    <motion.div
      key="selection"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
        <Image src="/logo.png" alt="Pixar Edu Logo" width={80} height={80} className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Welcome to Pixar Edu Portal</h1>
        <p className="text-muted-foreground mb-6">Please select your login type.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 text-lg flex-col gap-2"
              onClick={() => setView('login')}
            >
              <Shield className="h-6 w-6" />
              Admin / Counselor Login
            </Button>
            {/* This button is kept for layout but could be used for other roles in the future */}
            <Button
              variant="outline"
              className="h-20 text-lg flex-col gap-2"
              disabled
            >
                <UserCheck className="h-6 w-6" />
              Student Login (Coming Soon)
            </Button>
        </div>
    </motion.div>
  );

  const renderLoginForm = () => (
     <motion.div
      key="login-form"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
       <LoginForm onBack={() => setView('selection')} />
    </motion.div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="p-6">
            <AnimatePresence mode="wait">
                {view === 'login' ? renderLoginForm() : renderInitialSelection()}
            </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
