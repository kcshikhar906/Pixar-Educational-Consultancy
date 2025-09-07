
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Loader2, Timer } from 'lucide-react';
import AdminHeader from '@/components/admin/header';
import { useIdleTimeout } from '@/hooks/use-idle-timeout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import CounselorDashboard from './counselor-dashboard/page';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    if (loading) {
      setIsCheckingRole(true);
      return;
    }
    if (!user) {
      router.replace('/admin/login');
      return;
    }

    const checkUserRole = async () => {
      try {
        const userDocRef = doc(db, 'counselors', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role);
          setUserName(userData.name);
        } else {
          toast({ title: 'Access Denied', description: 'You do not have permissions to access this area.', variant: 'destructive'});
          await signOut(auth);
          router.replace('/admin/login');
        }
      } catch (e) {
          console.error("Error fetching user role:", e);
          toast({ title: 'Error', description: 'Could not verify your user role.', variant: 'destructive'});
          await signOut(auth);
          router.replace('/admin/login');
      } finally {
          setIsCheckingRole(false);
      }
    };

    checkUserRole();
  }, [user, loading, router, toast]);

  const handleLogout = async () => {
    // Navigate away first to ensure listeners are detached cleanly before sign-out
    router.push('/admin/login'); 
    try {
      // Small delay to allow component unmount to complete before sign out
      setTimeout(async () => {
        await signOut(auth);
        toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Logout Failed', description: 'An error occurred during logout.', variant: 'destructive' });
    }
  };

  const { isWarningActive, reset } = useIdleTimeout({
    onIdle: handleLogout,
    idleTime: 30 * 60 * 1000, // 30 minutes
    warningTime: 2 * 60 * 1000, // 2 minutes warning
  });

  const handleAddNewStudent = () => {
    router.push('/admin/students', { scroll: false });
    setTimeout(() => {
        const event = new CustomEvent('openNewStudentForm');
        window.dispatchEvent(event);
    }, 100);
  };

  if (loading || isCheckingRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Verifying authentication...</p>
      </div>
    );
  }

  if (userRole === 'admin') {
    return (
      <div className="bg-muted/40 min-h-screen">
          <AdminHeader onAddNew={handleAddNewStudent} onLogout={handleLogout} />
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
  
  if (userRole === 'counselor' && userName) {
    return <CounselorDashboard counselorName={userName} onLogout={handleLogout} />;
  }

  // This fallback will show the loader until a role is determined or the user is redirected.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Verifying role...</p>
    </div>
  );
}
