
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import type { Student } from '@/lib/data';
import { Card, CardHeader } from '@/components/ui/card';
import { Users, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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


export default function StudentManagementPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('recent');
  
  const [allRecentStudents, setAllRecentStudents] = useState<Student[]>([]);
  const [remoteStudents, setRemoteStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const { toast } = useToast();

  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };
  
  const handleDeselect = () => {
    setSelectedStudent(null);
  }

  // This logic correctly filters the recent list AFTER fetching.
  const recentStudentsToDisplay = useMemo(() => {
    const remoteStudentIds = new Set(remoteStudents.map(s => s.id));
    return allRecentStudents.filter(s => !remoteStudentIds.has(s.id));
  }, [allRecentStudents, remoteStudents]);


  useEffect(() => {
    setLoading(true);
    const searchLower = debouncedSearchTerm.toLowerCase();

    let unsubRecent: () => void;
    let unsubRemote: () => void;

    // This query is for the "Remote Inquiries" tab. It correctly fetches unassigned remote leads.
    const remoteQuery = query(
        collection(db, 'students'), 
        where('assignedTo', '==', 'Unassigned'), 
        where('inquiryType', 'in', ['visit', 'phone']), 
        orderBy('timestamp', 'desc'), 
        limit(20)
    );
    unsubRemote = onSnapshot(remoteQuery, (querySnapshot) => {
        const studentData: Student[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() } as Student));
        setRemoteStudents(studentData);
    }, (error) => {
        console.error("Error fetching remote students:", error);
        toast({ title: "Error", description: "Could not fetch remote inquiries.", variant: "destructive" });
    });


    // This logic handles searching vs. default view.
    if (searchLower) {
        // If searching, query all students by name.
        const searchQuery = query(
            collection(db, 'students'),
            orderBy('searchableName'),
            where('searchableName', '>=', searchLower),
            where('searchableName', '<=', searchLower + '\uf8ff')
        );
      
        unsubRecent = onSnapshot(searchQuery, (querySnapshot) => {
            const studentData: Student[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() } as Student));
            setAllRecentStudents(studentData);
            setActiveTab('recent'); // Switch to recent tab to show search results
            setLoading(false);
        }, (error) => {
            console.error("Error during search:", error);
            toast({ title: "Search Error", description: "Could not perform search.", variant: "destructive" });
            setLoading(false);
        });
    } else {
        // If not searching, fetch the 20 newest students for the "Recent / Walk-ins" list.
        const recentQuery = query(collection(db, 'students'), orderBy('timestamp', 'desc'), limit(20));
        unsubRecent = onSnapshot(recentQuery, (querySnapshot) => {
            const studentData: Student[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() } as Student));
            setAllRecentStudents(studentData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching recent students:", error);
            toast({ title: "Error", description: "Could not fetch recent students.", variant: "destructive" });
            setLoading(false);
        });
    }
    
    // Cleanup function
    return () => {
      if (unsubRecent) unsubRecent();
      if (unsubRemote) unsubRemote();
    };

  }, [debouncedSearchTerm, toast]);

  useEffect(() => {
    const handleOpenNewStudentForm = () => {
      const newStudent: Student = {
        id: '', 
        timestamp: null as any, 
        fullName: '',
        email: '',
        mobileNumber: '',
        visaStatus: 'Not Applied',
        serviceFeeStatus: 'Unpaid',
        assignedTo: 'Unassigned',
        inquiryType: 'office_walk_in',
      };
      setSelectedStudent(newStudent);
      setActiveTab('recent'); // Switch to recent tab when adding a new student
    };

    window.addEventListener('openNewStudentForm', handleOpenNewStudentForm);

    return () => {
      window.removeEventListener('openNewStudentForm', handleOpenNewStudentForm);
    };
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-3">
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="h-full">
              <CardHeader className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 rounded-t-lg rounded-b-none">
                          <TabsTrigger value="recent"><Users className="mr-2 h-4 w-4" />Recent / Walk-ins</TabsTrigger>
                          <TabsTrigger value="remote"><Phone className="mr-2 h-4 w-4" />Remote Inquiries</TabsTrigger>
                      </TabsList>
                      <TabsContent value="recent" className="m-0">
                          <DataTable 
                            students={recentStudentsToDisplay} 
                            loading={loading}
                            onRowSelect={handleRowSelect} 
                            selectedStudentId={selectedStudent?.id}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder="Search all students..."
                          />
                      </TabsContent>
                      <TabsContent value="remote" className="m-0">
                           <DataTable 
                            students={remoteStudents} 
                            loading={loading}
                            onRowSelect={handleRowSelect} 
                            selectedStudentId={selectedStudent?.id}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder="Search is disabled for this view"
                           />
                      </TabsContent>
                  </Tabs>
              </CardHeader>
            </Card>
          </div>
          <div className="lg:col-span-4 xl:col-span-2">
            {selectedStudent ? (
              <StudentForm 
                student={selectedStudent?.id ? selectedStudent : null} 
                onFormClose={handleDeselect} 
                onFormSubmitSuccess={handleDeselect}
              />
            ) : (
              <Card className="h-full flex items-center justify-center bg-background border-dashed shadow-none">
                <div className="text-center text-muted-foreground p-8">
                   <Users className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                  <p className="font-semibold text-lg">No Student Selected</p>
                  <p className="text-sm">Please select a student from the list on the left to view their details or add a new student.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
  );
}
