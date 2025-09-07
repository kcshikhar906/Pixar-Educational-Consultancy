
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
import CounselorDashboard from './counselor-dashboard/page'; // Import the new counselor dashboard

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'counselors', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserRole(userData.role);
            setUserName(userData.name);
          } else {
            // This user is authenticated but has no role document.
            // Log them out for security.
            toast({ title: 'Access Denied', description: 'You do not have permissions to access this area.', variant: 'destructive'});
            await signOut(auth);
            router.push('/admin/login');
          }
        } catch (e) {
            console.error("Error fetching user role:", e);
            toast({ title: 'Error', description: 'Could not verify your user role.', variant: 'destructive'});
            await signOut(auth);
        } finally {
            setIsCheckingRole(false);
        }
      } else if (!loading) {
          // If no user and not loading, push to login
          router.push('/admin/login');
          setIsCheckingRole(false);
      }
    };

    checkUserRole();
  }, [user, loading, router, toast]);

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

  if (user && userRole) {
    if (userRole === 'admin') {
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
    } else if (userRole === 'counselor') {
      // Render the counselor-specific dashboard directly
      return <CounselorDashboard counselorName={userName || 'Counselor'} />;
    }
  }

  // If user is not authenticated or has no role, they will be redirected by the useEffect.
  // This return is a fallback.
  return null; 
}
