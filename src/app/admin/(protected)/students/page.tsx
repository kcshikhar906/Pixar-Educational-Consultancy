'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import type { Student } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Users, Phone, FileSpreadsheet, UserPlus, Search, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
    if (debouncedSearchTerm) return allRecentStudents; // Show all search results
    const remoteStudentIds = new Set(remoteStudents.map(s => s.id));
    return allRecentStudents.filter(s => !remoteStudentIds.has(s.id));
  }, [allRecentStudents, remoteStudents, debouncedSearchTerm]);

  useEffect(() => {
    if (activeTab === null) return; // Prevent running queries before tab is set

    setLoading(true);
    const searchLower = debouncedSearchTerm.toLowerCase();

    // Setup listener for remote inquiries (always active)
    const remoteQuery = query(
      collection(db, 'students'),
      where('assignedTo', '==', 'Unassigned'),
      where('inquiryType', 'in', ['visit', 'phone']),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const unsubRemote = onSnapshot(remoteQuery, (querySnapshot) => {
      const studentData: Student[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() } as Student));
      setRemoteStudents(studentData);
    }, (error) => {
      console.error("Error fetching remote students:", error);
      toast({ title: "Error", description: "Could not fetch remote inquiries.", variant: "destructive" });
    });

    let unsubRecent: () => void = () => { };

    // Logic for recent/walk-in tab or search results
    if (searchLower) {
      const searchQuery = query(
        collection(db, 'students'),
        orderBy('searchableName'),
        where('searchableName', '>=', searchLower),
        where('searchableName', '<=', searchLower + '\uf8ff')
      );

      // Use getDocs for one-time search fetch
      getDocs(searchQuery).then(querySnapshot => {
        const studentData: Student[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() } as Student));
        setAllRecentStudents(studentData);
        if (activeTab !== 'recent') setActiveTab('recent'); // Switch to recent tab to show results
        setLoading(false);
      }).catch(error => {
        console.error("Error during search:", error);
        toast({ title: "Search Error", description: "Could not perform search.", variant: "destructive" });
        setLoading(false);
      });
    } else {
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
      unsubRecent();
      unsubRemote();
    };

  }, [debouncedSearchTerm, toast, activeTab]);

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
    <div className="flex h-[calc(100vh-60px)] w-full overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">

      {/* LEFT SIDEBAR: List View */}
      <div className="w-[450px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">

        {/* Sidebar Header */}
        <div className="flex flex-col gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              Students
            </h2>
            <Button
              size="sm"
              variant="default"
              className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              onClick={() => window.dispatchEvent(new Event('openNewStudentForm'))}
            >
              <UserPlus className="h-3.5 w-3.5 mr-2" /> New Student
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger value="recent" className="text-xs font-medium">Recent / Walk-ins</TabsTrigger>
              <TabsTrigger value="remote" className="text-xs font-medium">Remote Inquiries</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Sidebar List Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'recent' && (
            <div className="h-full">
              {/* Assuming DataTable has internal scrolling or fits within this container. 
                        We pass 'searchTerm' to it, but also handled the input above for visual hierarchy. 
                        Ideally DataTable should be purely presentation here. */}
              <DataTable
                students={recentStudentsToDisplay}
                loading={loading}
                onRowSelect={handleRowSelect}
                selectedStudentId={selectedStudent?.id}
                searchTerm={searchTerm}
                // We might want to suppress the DataTable's internal search input if we have one above, 
                // but sticking to your API:
                onSearchChange={setSearchTerm}
                searchPlaceholder="Filter list..."
              />
            </div>
          )}
          {activeTab === 'remote' && (
            <div className="h-full">
              <DataTable
                students={remoteStudents}
                loading={loading}
                onRowSelect={handleRowSelect}
                selectedStudentId={selectedStudent?.id}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Filter disabled"
              />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT MAIN PANEL: Detail View */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900">
        {selectedStudent ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Detail Toolbar */}
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={handleDeselect}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.fullName || 'New Student'}</span>
                  {selectedStudent.visaStatus && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {selectedStudent.visaStatus}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleDeselect}>
                  Close
                </Button>
              </div>
            </div>

            {/* Detail Content (Scrollable) */}
            <div className="flex-1 overflow-auto p-6 md:p-10">
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                <StudentForm
                  student={selectedStudent?.id ? selectedStudent : null}
                  onFormClose={handleDeselect}
                  onFormSubmitSuccess={handleDeselect}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-md space-y-6">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <FileSpreadsheet className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Managing Students</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select a student from the sidebar to view their full application details, update visa status, or manage assignments.
                </p>
              </div>
              <div className="pt-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                  onClick={() => window.dispatchEvent(new Event('openNewStudentForm'))}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Register New Student
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
