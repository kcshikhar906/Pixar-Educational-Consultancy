'use client';

import { useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import AdminHeader from '@/components/admin/header';
import { StudentForm } from '@/components/admin/student-form';
import type { Student } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };
  
  const handleDeselect = () => {
    setSelectedStudent(null);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminHeader onAddNew={() => handleRowSelect({} as Student)} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-3">
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="h-full">
              <CardHeader className="p-4">
                <CardTitle>Student List</CardTitle>
                <CardDescription>Select a student to view or edit their details.</CardDescription>
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
      </main>
    </div>
  );
}
