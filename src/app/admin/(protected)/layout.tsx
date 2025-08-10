
'use client';

import { ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, Timer } from 'lucide-react';
import AdminHeader from '@/components/admin/header';
import { useIdleTimeout } from '@/hooks/use-idle-timeout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Logout Failed', description: 'An error occurred during logout.', variant: 'destructive' });
    }
  };

  const { isIdle, isWarningActive, start, stop, reset } = useIdleTimeout({
    onIdle: handleLogout,
    idleTime: 30 * 60 * 1000, // 30 minutes
    warningTime: 2 * 60 * 1000, // 2 minutes warning
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
      stop(); // Stop timer if user is not logged in
    } else if (user) {
      start(); // Start timer when user is logged in
    }
  }, [user, loading, router, start, stop]);

  const handleAddNewStudent = () => {
    router.push('/admin/students', { scroll: false });
    setTimeout(() => {
        const event = new CustomEvent('openNewStudentForm');
        window.dispatchEvent(event);
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Verifying authentication...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-muted/40 min-h-screen">
          <AdminHeader onAddNew={handleAddNewStudent} />
          {children}
          <AlertDialog open={isWarningActive}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <Timer className="mr-2" /> Session Timeout Warning
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You have been inactive for a while. For your security, you will be logged out automatically in 2 minutes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={reset} className="bg-primary hover:bg-primary/90">
                  Stay Logged In
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </div>
    );
  }

  return null; 
}
