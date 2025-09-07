
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAt,
  endAt,
  Query,
  DocumentData,
  where,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/lib/data.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Search, AlertTriangle, UserPlus, CalendarDays, X, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNowStrict, isToday } from 'date-fns';

// A simple debounce hook to prevent firing search queries on every keystroke
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


interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
  filterMode: 'recent' | 'remote';
}

export function DataTable({ onRowSelect, selectedStudentId, filterMode }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Ref to track if it's the initial data load
  const isInitialLoad = useRef(true);
  // Ref to store previous student IDs to detect new students
  const previousStudentIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setError(null);

    const constraints: QueryConstraint[] = [];

    if (debouncedSearchTerm.trim()) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        constraints.push(orderBy('searchableName'));
        constraints.push(startAt(searchLower));
        constraints.push(endAt(searchLower + '\uf8ff'));
    } else {
        constraints.push(orderBy('timestamp', 'desc'));
    }

    if (filterMode === 'remote') {
        constraints.push(where('assignedTo', '==', 'Unassigned'));
        constraints.push(where('inquiryType', 'in', ['visit', 'phone']));
    } else {
        constraints.push(limit(20));
    }


    const q = query(collection(db, 'students'), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const currentStudents: Student[] = [];
        const currentStudentIds = new Set<string>();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          currentStudents.push({ 
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() 
          } as Student);
          currentStudentIds.add(doc.id);
        });

        // Check for new students only after the initial load and when in 'recent' mode
        if (!isInitialLoad.current && !debouncedSearchTerm && filterMode === 'recent') {
          const newStudents = currentStudents.filter(s => !previousStudentIds.current.has(s.id) && s.assignedTo === 'Unassigned');
          if (newStudents.length > 0) {
            newStudents.forEach(newStudent => {
              toast({
                title: (
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5 text-primary" />
                    New Student Inquiry
                  </div>
                ),
                description: `${newStudent.fullName} has been added to the list.`,
              });
              audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
            });
          }
        }
        
        isInitialLoad.current = false;

        setStudents(currentStudents);
        // Only update previous IDs when in default view to correctly detect new arrivals
        if (!debouncedSearchTerm && filterMode === 'recent') {
             previousStudentIds.current = currentStudentIds;
        }
        
        if (querySnapshot.empty && (debouncedSearchTerm.trim() || filterMode === 'remote')) {
            setError(`No students found matching your criteria.`);
        } else {
            setError(null);
        }
        setLoading(false);
      },
      (err: any) => {
        console.error("Error with real-time listener: ", err);
        let userFriendlyError = "Failed to load student data. Please check your internet connection and Firestore permissions.";
        if (err.code === 'failed-precondition' || (err.message && err.message.includes("index"))) {
            userFriendlyError = `A required database index is missing. Please check the Firestore console for an index creation link in the error logs. You may need to create composite indexes.`;
        }
        setError(userFriendlyError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    
  }, [debouncedSearchTerm, toast, filterMode]);

  const getRelativeDate = (date: any) => {
    if (!date) return 'No date';
    const timestamp = date.toDate ? date.toDate() : new Date(date);
    if (isNaN(timestamp.getTime())) return 'Invalid date';

    if (isToday(timestamp)) {
      return "Today";
    }
    return `${formatDistanceToNowStrict(timestamp)} ago`;
  };

  const getInquiryTypeBadge = (student: Student) => {
    if (student.inquiryType === 'visit' && student.appointmentDate) {
        return <Badge variant="secondary" className="py-0.5 px-1.5 text-xs">Visit: {format(safeToDate(student.appointmentDate)!, 'dd MMM')}</Badge>;
    }
    if (student.inquiryType === 'phone') {
        return <Badge variant="secondary" className="py-0.5 px-1.5 text-xs">Phone Call</Badge>;
    }
    return null;
  };

  const safeToDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    if (typeof dateValue.toDate === 'function') return dateValue.toDate();
    if (dateValue instanceof Date) return dateValue;
    const parsedDate = new Date(dateValue);
    if (!isNaN(parsedDate.getTime())) return parsedDate;
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto"></audio>

      <div className="px-4 pt-2 space-y-2">
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10"
            />
            {searchTerm && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                    onClick={() => setSearchTerm('')}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
      </div>
      <div className="max-h-[calc(100vh-350px)] overflow-auto">
        {error && !loading && (
          <Alert variant="destructive" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription dangerouslySetInnerHTML={{ __html: error }} />
          </Alert>
        )}
        <Table>
          <TableBody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4 mt-2" />
                  </TableCell>
                </TableRow>
              ))
            ) : students.length > 0 ? (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => onRowSelect(student)}
                  className="cursor-pointer"
                  data-state={selectedStudentId === student.id ? 'selected' : 'unselected'}
                >
                  <TableCell className="font-medium p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{student.fullName}</span>
                      {getInquiryTypeBadge(student) || (student.assignedTo === 'Unassigned' && <Badge className="py-0.5 px-1.5 text-xs bg-accent text-accent-foreground">New</Badge>)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                       <div className="flex items-center">
                         <UserPlus className="mr-1 h-3 w-3" />
                        <span>{getRelativeDate(student.timestamp)}</span>
                      </div>
                      <div className="flex items-center">
                        {student.assignedTo !== 'Unassigned' && (
                            <>
                                <Users className="mr-1 h-3 w-3" />
                                <span>{student.assignedTo || 'N/A'}</span>
                            </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : !error ? (
              <TableRow>
                <TableCell className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
