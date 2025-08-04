
'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
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
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  PlusCircle,
  ListFilter,
  FileDown,
  Trash2,
  FilePenLine,
  Eye,
  BookUser,
  Mail,
  Phone,
  GraduationCap,
  Languages,
  Target,
  StickyNote,
  Users,
  CalendarDays,
  CircleDollarSign,
  Briefcase,
  ShieldQuestion,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

type SortConfig = {
  key: keyof Student;
  direction: 'ascending' | 'descending';
};

// Detail Item component for the View Dialog
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
    <div className="flex-grow">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-md text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);


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

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [studentToView, setStudentToView] = useState<Student | null>(null);

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
          timestamp: data.timestamp as Timestamp,
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
      const name = student.fullName || '';
      const email = student.email || '';
      const matchesText =
        name.toLowerCase().includes(filter.toLowerCase()) ||
        email.toLowerCase().includes(filter.toLowerCase());
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

  const handleView = (student: Student) => {
    setStudentToView(student);
    setIsViewOpen(true);
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

  const getVisaStatusBadgeVariant = (status: Student['visaStatus']) => {
    switch (status) {
      case 'Approved': return 'default'; // Or a custom 'success' variant
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'Not Applied': return 'outline';
      default: return 'outline';
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
                    Student
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead onClick={() => handleSort('assignedTo')}>
                 <Button variant="ghost" className="pl-0">
                    Assigned To
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead onClick={() => handleSort('visaStatus')}>
                <Button variant="ghost" className="pl-0">Visa Status<ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('serviceFeeStatus')}>
                <Button variant="ghost" className="pl-0">Fee Status<ArrowUpDown className="ml-2 h-4 w-4" /></Button>
              </TableHead>
              <TableHead onClick={() => handleSort('timestamp')}>
                 <Button variant="ghost" className="pl-0">
                    Date Added
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredAndSortedStudents.length > 0 ? (
              filteredAndSortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div>{student.fullName}</div>
                    <div className="text-xs text-muted-foreground">{student.email}</div>
                  </TableCell>
                  <TableCell>{student.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={getVisaStatusBadgeVariant(student.visaStatus)}>
                      {student.visaStatus}
                    </Badge>
                  </TableCell>
                   <TableCell>
                     <Badge variant={student.serviceFeeStatus === 'Paid' ? 'default' : student.serviceFeeStatus === 'Partial' ? 'secondary' : 'outline'}>
                        {student.serviceFeeStatus}
                     </Badge>
                   </TableCell>
                  <TableCell>
                    {student.timestamp ? format(student.timestamp.toDate(), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(student)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                        <FilePenLine className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteAlert(student)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Student View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center"><BookUser className="mr-2 h-6 w-6"/>Student Details</DialogTitle>
            <DialogDescription>
              A complete overview of {studentToView?.fullName}'s record.
            </DialogDescription>
          </DialogHeader>
          {studentToView && (
            <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary">Personal & Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem icon={Mail} label="Email" value={studentToView.email} />
                  <DetailItem icon={Phone} label="Mobile Number" value={studentToView.mobileNumber} />
                  <DetailItem icon={Phone} label="Emergency Contact" value={studentToView.emergencyContact} />
                  <DetailItem icon={Briefcase} label="College/University" value={studentToView.collegeUniversityName} />
                </div>
              </div>
              <Separator />
              {/* Academic & Study Preferences */}
              <div className="space-y-4">
                 <h3 className="font-semibold text-lg text-primary">Academic & Study Preferences</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={GraduationCap} label="Last Completed Education" value={studentToView.lastCompletedEducation} />
                    <DetailItem icon={Languages} label="English Proficiency Test" value={studentToView.englishProficiencyTest} />
                    <DetailItem icon={Target} label="Preferred Study Destination" value={studentToView.preferredStudyDestination} />
                 </div>
                 <DetailItem icon={StickyNote} label="Additional Notes" value={studentToView.additionalNotes ? <p className="whitespace-pre-wrap">{studentToView.additionalNotes}</p> : 'N/A'} />
              </div>
               <Separator />
              {/* Internal Records */}
               <div className="space-y-4">
                 <h3 className="font-semibold text-lg text-primary">Internal Records</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={Users} label="Assigned To" value={studentToView.assignedTo} />
                    <DetailItem icon={ShieldQuestion} label="Visa Status" value={<Badge variant={getVisaStatusBadgeVariant(studentToView.visaStatus)}>{studentToView.visaStatus}</Badge>} />
                    {studentToView.visaStatusUpdateDate && <DetailItem icon={CalendarDays} label="Visa Status Date" value={format(studentToView.visaStatusUpdateDate.toDate(), 'PPP')} />}
                    <DetailItem icon={CircleDollarSign} label="Service Fee Status" value={<Badge variant={studentToView.serviceFeeStatus === 'Paid' ? 'default' : studentToView.serviceFeeStatus === 'Partial' ? 'secondary' : 'outline'}>{studentToView.serviceFeeStatus}</Badge>} />
                    {studentToView.serviceFeePaidDate && <DetailItem icon={CalendarDays} label="Fee Paid Date" value={format(studentToView.serviceFeePaidDate.toDate(), 'PPP')} />}
                    <DetailItem icon={CalendarDays} label="Date Added" value={studentToView.timestamp ? format(studentToView.timestamp.toDate(), 'PPP, p') : 'N/A'} />
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Student Edit Form Dialog */}
      <StudentForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        student={selectedStudent} 
      />

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: "destructive" }))}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
