
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminHeader from '@/components/admin/header';
import { StudentForm } from '@/components/admin/student-form';
import type { Student } from '@/lib/data';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [isNewStudentFormOpen, setIsNewStudentFormOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const handleAddNewStudent = () => {
    router.push('/admin/students', { scroll: false });
    // A bit of a hack to communicate with the student page,
    // a more robust solution would involve state management (e.g., Zustand, Redux)
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
      </div>
    );
  }

  return null; 
}
