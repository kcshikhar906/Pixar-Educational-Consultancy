
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  QueryConstraint,
  limit,
  getDocs,
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
import { useToast } from '@/hooks/use-toast';

// A simple debounce hook
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};


interface CounselorDashboardProps {
  counselorName: string;
  onLogout: () => void;
}

export default function CounselorDashboard({ counselorName, onLogout }: CounselorDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    if (!counselorName) return;

    setLoading(true);
    setError(null);
    
    try {
        const constraints: QueryConstraint[] = [
            where('assignedTo', '==', counselorName)
        ];

        const searchLower = debouncedSearchTerm.toLowerCase();
        if (searchLower) {
            constraints.push(orderBy('searchableName'));
            constraints.push(where('searchableName', '>=', searchLower));
            constraints.push(where('searchableName', '<=', searchLower + '\uf8ff'));
        } else {
            constraints.push(orderBy('timestamp', 'desc'));
            constraints.push(limit(15));
        }

        const q = query(collection(db, 'students'), ...constraints);
        const querySnapshot = await getDocs(q);

        const studentData: Student[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            studentData.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate(),
            } as Student);
        });

        if (studentData.length === 0 && searchLower) {
          toast({ title: "No results", description: `No students found matching "${debouncedSearchTerm}".`});
        }
        
        setStudents(studentData);

    } catch (err: any) {
        console.error("Firestore Error:", err);
        let errorMessage = "Could not load your assigned students. Please check your connection or contact an admin.";
        if (err.code === 'failed-precondition') {
            errorMessage = "A required database index is missing. Please contact your administrator to create the necessary Firestore index for searching.";
        }
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  }, [counselorName, debouncedSearchTerm, toast]);


  useEffect(() => {
    // This effect triggers fetching when the component mounts or the search term changes
    fetchStudents();
  }, [fetchStudents]);


  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleDeselect = () => {
    setSelectedStudent(null);
  };
  
  const handleFormSubmitSuccess = () => {
      handleDeselect();
      // Refetch the data to show the latest changes
      fetchStudents();
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
                <DataTable
                    students={students}
                    onRowSelect={handleRowSelect}
                    selectedStudentId={selectedStudent?.id}
                    loading={loading}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search assigned students..."
                 />
              )}
            </Card>
          </div>
          <div className="lg:col-span-4 xl:col-span-2">
            {selectedStudent ? (
              <StudentForm
                student={selectedStudent}
                onFormClose={handleDeselect}
                onFormSubmitSuccess={handleFormSubmitSuccess}
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
