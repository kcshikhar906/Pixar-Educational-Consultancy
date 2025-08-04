'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StudentForm } from './student-form';
import {
  ArrowUpDown,
  MoreHorizontal,
  PlusCircle,
  ListFilter,
  FileDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type SortConfig = {
  key: keyof Student;
  direction: 'ascending' | 'descending';
};

export function DataTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [visaStatusFilter, setVisaStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'timestamp', direction: 'descending' });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentsData.push({ 
          id: doc.id,
          ...data,
          timestamp: data.timestamp as Timestamp, // Cast to Timestamp
        } as Student);
      });
      setStudents(studentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedStudents = useMemo(() => {
    let sortableStudents = [...students];

    // Filtering logic
    sortableStudents = sortableStudents.filter((student) => {
      const matchesText =
        student.fullName.toLowerCase().includes(filter.toLowerCase()) ||
        student.email.toLowerCase().includes(filter.toLowerCase());
      const matchesVisaStatus =
        visaStatusFilter === 'all' || student.visaStatus === visaStatusFilter;
      return matchesText && matchesVisaStatus;
    });

    // Sorting logic
    if (sortConfig !== null) {
      sortableStudents.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        // Handle Timestamp objects specifically
        if (aValue instanceof Timestamp && bValue instanceof Timestamp) {
            if (aValue.toMillis() < bValue.toMillis()) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue.toMillis() > bValue.toMillis()) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableStudents;
  }, [students, filter, visaStatusFilter, sortConfig]);
  
  const handleAddNew = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const openDeleteAlert = (student: Student) => {
    setStudentToDelete(student);
    setIsAlertOpen(true);
  };
  
  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteDoc(doc(db, 'students', studentToDelete.id));
      toast({
        title: 'Student Deleted',
        description: `${studentToDelete.fullName} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete student.',
        variant: 'destructive',
      });
    } finally {
      setIsAlertOpen(false);
      setStudentToDelete(null);
    }
  };


  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Filter by name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter by Visa Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuLabel>Visa Status</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuCheckboxItem
               checked={visaStatusFilter === 'all'}
               onCheckedChange={() => setVisaStatusFilter('all')}
             >
               All
             </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
               checked={visaStatusFilter === 'Not Applied'}
               onCheckedChange={() => setVisaStatusFilter('Not Applied')}
             >
               Not Applied
             </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
               checked={visaStatusFilter === 'Pending'}
               onCheckedChange={() => setVisaStatusFilter('Pending')}
             >
               Pending
             </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
               checked={visaStatusFilter === 'Approved'}
               onCheckedChange={() => setVisaStatusFilter('Approved')}
             >
               Approved
             </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
               checked={visaStatusFilter === 'Rejected'}
               onCheckedChange={() => setVisaStatusFilter('Rejected')}
             >
               Rejected
             </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
         <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
        </Button>
        <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
        </Button>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('fullName')}>
                <Button variant="ghost" className="pl-0">
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead onClick={() => handleSort('email')}>
                 <Button variant="ghost" className="pl-0">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead onClick={() => handleSort('visaStatus')}>
                 <Button variant="ghost" className="pl-0">
                    Visa Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead onClick={() => handleSort('serviceFeeStatus')}>
                 <Button variant="ghost" className="pl-0">
                    Fee Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead onClick={() => handleSort('assignedTo')}>
                 <Button variant="ghost" className="pl-0">
                    Assigned To
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead onClick={() => handleSort('timestamp')}>
                 <Button variant="ghost" className="pl-0">
                    Date Added
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredAndSortedStudents.length > 0 ? (
              filteredAndSortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobileNumber}</TableCell>
                  <TableCell>{student.visaStatus}</TableCell>
                  <TableCell>{student.serviceFeeStatus}</TableCell>
                  <TableCell>{student.assignedTo}</TableCell>
                  <TableCell>
                    {student.timestamp ? format(student.timestamp.toDate(), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(student)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteAlert(student)} className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <StudentForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        student={selectedStudent} 
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student record for {studentToDelete?.fullName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
