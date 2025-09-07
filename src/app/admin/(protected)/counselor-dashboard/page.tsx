
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
import { teamMembers } from '@/lib/data';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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

  const counselorDetails = useMemo(
    () => teamMembers.find(member => member.name === counselorName),
    [counselorName]
  );

  useEffect(() => {
    if (!counselorName) return;

    setLoading(true);
    setError(null);
    
    // This function will be returned by useEffect to unsubscribe from the listener
    let unsubscribe: () => void = () => {};

    if (debouncedSearchTerm) {
      // One-time search query
      const searchStudents = async () => {
          try {
              const searchLower = debouncedSearchTerm.toLowerCase();
              const constraints: QueryConstraint[] = [
                  where('assignedTo', '==', counselorName),
                  orderBy('searchableName'),
                  where('searchableName', '>=', searchLower),
                  where('searchableName', '<=', searchLower + '\uf8ff')
              ];

              const q = query(collection(db, 'students'), ...constraints);
              const querySnapshot = await getDocs(q);
              const studentData: Student[] = querySnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                  timestamp: doc.data().timestamp?.toDate(),
              } as Student));

              if (studentData.length === 0) {
                  toast({ title: "No results", description: `No students found matching "${debouncedSearchTerm}".` });
              }
              setStudents(studentData);
          } catch (err: any) {
              console.error("Firestore Search Error:", err);
              let errorMessage = "Could not perform search. Please check your connection or contact an admin.";
              if (err.code === 'failed-precondition') {
                  errorMessage = "A required database index is missing for search. Please contact your administrator.";
              }
              setError(errorMessage);
          } finally {
              setLoading(false);
          }
      };
      searchStudents();
    } else {
      // Real-time listener for the default view
      const q = query(
        collection(db, 'students'),
        where('assignedTo', '==', counselorName),
        orderBy('timestamp', 'desc'),
        limit(15)
      );

      unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      }, (err: any) => {
        console.error("Firestore Snapshot Error:", err);
        let errorMessage = "Could not load your assigned students. Please check your connection or contact an admin.";
        if (err.code === 'permission-denied') {
          errorMessage = "You do not have permission to view this data. Please contact an admin.";
        }
        setError(errorMessage);
        setLoading(false);
      });
    }

    // Cleanup function to unsubscribe from the listener when the component unmounts or dependencies change
    return () => unsubscribe();
  }, [counselorName, debouncedSearchTerm, toast]);


  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleDeselect = () => {
    setSelectedStudent(null);
  };
  
  const handleFormSubmitSuccess = () => {
      handleDeselect();
  };

  return (
    <div className="bg-muted/40 min-h-screen">
      <header className="sticky top-0 z-30 flex h-auto items-center justify-between border-b bg-background px-4 sm:px-6 py-2">
        <div className="flex items-center space-x-4">
          <Image src="/navbar.png" alt="Pixar Edu Logo" width={48} height={48} />
          <div>
            <h1 className="text-xl font-bold">Counselor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Pixar Educational Consultancy</p>
          </div>
        </div>
         <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold">{counselorName}</p>
            <p className="text-xs text-muted-foreground">{counselorDetails?.role || 'Counselor'}</p>
          </div>
           {counselorDetails && (
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={counselorDetails.imageUrl} alt={counselorDetails.name} />
              <AvatarFallback>{counselorName.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <Button variant="outline" onClick={onLogout} size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
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
