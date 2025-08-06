
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import type { Student } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function StudentManagementPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [adminName, setAdminName] = useState('');
  const [isNamePromptOpen, setIsNamePromptOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showData, setShowData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the admin name has been set in the current session
    const sessionAdminName = sessionStorage.getItem('adminName');
    if (sessionAdminName) {
      setAdminName(sessionAdminName);
      setShowData(true);
    } else {
      // If no name, open the prompt
      setIsNamePromptOpen(true);
    }
  }, []);

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      const formattedName = nameInput.trim();
      setAdminName(formattedName);
      sessionStorage.setItem('adminName', formattedName); // Store in session storage
      setIsNamePromptOpen(false);
      setShowData(true);
      toast({
        title: `Welcome, ${formattedName}!`,
        description: "Please remember the usage guidelines for this page.",
      });
    }
  };
  
  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };
  
  const handleDeselect = () => {
    setSelectedStudent(null);
  }

  // Effect to handle the custom event for adding a new student
  useEffect(() => {
    const handleOpenNewStudentForm = () => {
      // Create a dummy new student object to put the form in "create" mode
      const newStudent: Student = {
        id: '', // No ID for a new student
        timestamp: null as any, // Timestamp will be set on save
        fullName: '',
        email: '',
        mobileNumber: '',
        visaStatus: 'Not Applied',
        serviceFeeStatus: 'Unpaid',
        assignedTo: 'Unassigned',
      };
      setSelectedStudent(newStudent);
    };

    window.addEventListener('openNewStudentForm', handleOpenNewStudentForm);

    return () => {
      window.removeEventListener('openNewStudentForm', handleOpenNewStudentForm);
    };
  }, []);

  // Show a loading/prompt state until the admin name is set
  if (!showData) {
    return (
       <AlertDialog open={isNamePromptOpen} onOpenChange={setIsNamePromptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to Student Management</AlertDialogTitle>
            <AlertDialogDescription>
              To begin your session, please enter your name.
            </AlertDialogDescription>
          </AlertDialogHeader>
           <Input 
              placeholder="Your Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSubmit();
              }}
           />
          <AlertDialogFooter>
            <Button onClick={handleNameSubmit} disabled={!nameInput.trim()}>
              Start Session
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Welcome and Warning Section */}
      <Card className="bg-destructive/10 border-destructive/50">
        <CardHeader>
           <CardTitle className="text-destructive flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2"/>
                Important Usage Warning
            </CardTitle>
          <CardDescription className="text-destructive/90">
             Welcome, <span className="font-bold">{adminName}</span>. This page loads all student data at once to enable searching.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-lg font-bold text-destructive">
               DO NOT REFRESH THIS PAGE UNNECESSARILY.
            </p>
            <p className="text-sm text-destructive/80">
              Each page load reads all student records from the database, which consumes a large part of our daily free quota. Please use the components on the page to search and manage students without reloading.
            </p>
        </CardContent>
      </Card>


      {/* Student Management Table and Form */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-3">
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="h-full">
              <CardHeader className="p-4">
                <CardTitle>Student List</CardTitle>
                <CardDescription>
                  Showing new, unassigned students first. Use search to find any student.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable onRowSelect={handleRowSelect} selectedStudentId={selectedStudent?.id} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4 xl:col-span-2">
            {selectedStudent ? (
              <StudentForm 
                student={selectedStudent.id ? selectedStudent : null} 
                onFormClose={handleDeselect} 
                onFormSubmitSuccess={handleDeselect}
              />
            ) : (
              <Card className="h-full flex items-center justify-center bg-background border-dashed shadow-none">
                <div className="text-center text-muted-foreground p-8">
                   <Users className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                  <p className="font-semibold text-lg">No Student Selected</p>
                  <p className="text-sm">Please select a student from the list on the left to view their details.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
}

