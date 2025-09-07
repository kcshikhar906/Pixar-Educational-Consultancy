
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs, // Changed from onSnapshot for one-time fetch to generate index link
  Query,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { Student } from '@/lib/data';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import { Card } from '@/components/ui/card';
import { Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CounselorDashboardProps {
  counselorName: string;
}

export default function CounselorDashboard({ counselorName }: CounselorDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!counselorName) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const constraints: QueryConstraint[] = [
          where('assignedTo', '==', counselorName),
          orderBy('timestamp', 'desc'),
        ];
        const q = query(collection(db, 'students'), ...constraints);

        const querySnapshot = await getDocs(q); // Using getDocs to trigger the index error
        const studentData: Student[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          studentData.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate(),
          } as Student);
        });
        setStudents(studentData);
      } catch (err: any) {
        console.error("Firestore Error:", err);
        if (err.code === 'failed-precondition') {
             const firestoreError = "The query requires an index. You can create it here: " + (err.message.match(/https?:\/\/[^\s]+/g) || [])[0];
             setError("A database index is required. Please check the browser console (F12) for a link to create it automatically.");
             console.error(firestoreError); // This will log the error with the clickable link
        } else {
            setError("Could not load your assigned students. Please check your connection or contact an admin.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
    
    // Since we are not using a real-time listener now, we return an empty cleanup function.
    return () => {};

  }, [counselorName]);

  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleDeselect = () => {
    setSelectedStudent(null);
  };

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

  return (
    <div className="bg-muted/40 min-h-screen">
      <header className="sticky top-0 z-30 flex h-auto items-center justify-between border-b bg-background px-4 sm:px-6 py-2">
        <div className="flex items-center space-x-2">
          <Image src="/navbar.png" alt="Pixar Edu Logo" width={48} height={48} />
          <div>
            <h1 className="text-xl font-bold">Counselor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {counselorName}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout} size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-3">
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="h-full">
              {error ? (
                <Alert variant="destructive" className="m-4">
                    <AlertTitle>Error Loading Data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <DataTable onRowSelect={handleRowSelect} selectedStudentId={selectedStudent?.id} filterMode="recent" />
              )}
            </Card>
          </div>
          <div className="lg:col-span-4 xl:col-span-2">
            {selectedStudent ? (
              <StudentForm
                student={selectedStudent}
                onFormClose={handleDeselect}
                onFormSubmitSuccess={handleDeselect}
              />
            ) : (
              <Card className="h-full flex items-center justify-center bg-background border-dashed shadow-none">
                <div className="text-center text-muted-foreground p-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                  <p className="font-semibold text-lg">No Student Selected</p>
                  <p className="text-sm">Select a student from your list on the left to view or edit their details.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
