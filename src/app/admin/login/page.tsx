
'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { LoginForm } from '@/components/admin/login-form';
import Image from 'next/image';

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/admin/dashboard');
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm overflow-hidden">
        <CardContent className="p-6">
            <div className="text-center mb-4">
               <Image src="/logo.png" alt="Pixar Edu Logo" width={60} height={60} className="mx-auto" />
            </div>
           <LoginForm onBack={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
}
