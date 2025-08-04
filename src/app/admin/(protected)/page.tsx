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
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader onAddNew={() => handleRowSelect({} as Student)} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
             <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Select a student to view or edit their details.</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
               <DataTable onRowSelect={handleRowSelect} selectedStudentId={selectedStudent?.id} />
            </CardContent>
          </Card>
          <div className="lg:col-span-3">
            {selectedStudent ? (
              <StudentForm 
                student={selectedStudent.id ? selectedStudent : null} 
                onFormClose={handleDeselect} 
                onFormSubmitSuccess={handleDeselect}
              />
            ) : (
              <Card className="h-full flex items-center justify-center bg-muted/40 border-dashed">
                <div className="text-center text-muted-foreground">
                   <Users className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-semibold">No Student Selected</p>
                  <p className="text-sm">Select a student from the list to see their details.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
