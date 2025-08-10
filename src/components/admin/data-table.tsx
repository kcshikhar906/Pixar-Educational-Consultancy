
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  where,
  getDocs,
  Query,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/lib/data';
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
import { Loader2, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/use-debounce'; // A simple debounce hook

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

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


export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300); // 300ms delay

  // Real-time listener for the 20 newest students
  useEffect(() => {
    // Only run this listener if there is no search term
    if (!debouncedSearchTerm) {
      setLoading(true);
      setError(null);
      const q = query(
        collection(db, 'students'), 
        orderBy('timestamp', 'desc'), 
        limit(20)
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const studentsData: Student[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            studentsData.push({ 
              id: doc.id,
              ...data,
              // Convert Firestore Timestamp to JS Date for consistent handling
              timestamp: data.timestamp?.toDate() 
            } as Student);
          });
          setStudents(studentsData);
          setLoading(false);
        },
        (err) => {
          console.error("Error with real-time listener: ", err);
          setError("Failed to load real-time student data. Check Firestore permissions and connectivity.");
          setLoading(false);
        }
      );

      // Cleanup subscription on component unmount or when search term changes
      return () => unsubscribe();
    }
  }, [debouncedSearchTerm]);


  // Effect for handling search queries
  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        // If search term is cleared, the other useEffect will kick in to show latest students.
        // We just need to clear the current list to avoid showing stale search results.
        setStudents([]); 
        return;
      }

      setLoading(true);
      setError(null);
      setStudents([]); // Clear previous results

      try {
        // We search on the `searchableName` field, which should be a lowercase version of fullName
        const searchQuery = query(
          collection(db, 'students'),
          where('searchableName', '>=', debouncedSearchTerm.toLowerCase()),
          where('searchableName', '<=', debouncedSearchTerm.toLowerCase() + '\uf8ff'),
          orderBy('searchableName', 'asc'),
          orderBy('timestamp', 'desc') // Also sort search results by newest
        );
        
        const querySnapshot = await getDocs(searchQuery);
        const studentsData: Student[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          studentsData.push({ 
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate()
           } as Student);
        });
        setStudents(studentsData);

        if (studentsData.length === 0) {
            setError("No students found matching your search.");
        }

      } catch (err: any) {
        console.error("Error searching students: ", err);
        setError("Failed to perform search. The necessary database index might be missing.");
      } finally {
        setLoading(false);
      }
    };
    
    handleSearch();

  }, [debouncedSearchTerm]);

  const getFeeStatusBadgeVariant = (status: Student['serviceFeeStatus']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Partial': return 'secondary';
      case 'Unpaid': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-4 pt-2 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground px-1">
          {debouncedSearchTerm ? `Showing results for "${debouncedSearchTerm}"` : 'Showing 20 newest students.'}
        </p>
      </div>
      <div className="max-h-[calc(100vh-350px)] overflow-auto">
        {error && !loading && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
                      {student.assignedTo === 'Unassigned' && (
                        <Badge className="py-0.5 px-1.5 text-xs bg-accent text-accent-foreground">New</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{student.assignedTo || 'Unassigned'}</span>
                      <Badge variant={getFeeStatusBadgeVariant(student.serviceFeeStatus)} className="py-0.5 px-1.5 text-xs">
                        {student.serviceFeeStatus || 'N/A'}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : !error && (
              <TableRow>
                <TableCell className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
