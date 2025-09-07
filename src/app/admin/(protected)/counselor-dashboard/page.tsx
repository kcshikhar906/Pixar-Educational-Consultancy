
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  QueryConstraint,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/data';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface CounselorDashboardProps {
  counselorName: string;
  onLogout: () => void;
}

export default function CounselorDashboard({ counselorName, onLogout }: CounselorDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!counselorName) return;

    setLoading(true);

    const constraints: QueryConstraint[] = [
      where('assignedTo', '==', counselorName),
      orderBy('timestamp', 'desc'),
      limit(15) // Fetch only the 15 most recent students.
    ];
    
    const q = query(collection(db, 'students'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
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
        setLoading(false);
        setError(null);
      },
      (err: any) => {
        console.error("Firestore Error:", err);
        setError("Could not load your assigned students. Please check your connection or contact an admin.");
        setLoading(false);
      }
    );
    
    return () => unsubscribe();

  }, [counselorName]);

  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleDeselect = () => {
    setSelectedStudent(null);
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
        <Button variant="outline" onClick={onLogout} size="sm">
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
                <DataTable students={students} allStudentsForSearch={students} onRowSelect={handleRowSelect} selectedStudentId={selectedStudent?.id} loading={loading} />
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
