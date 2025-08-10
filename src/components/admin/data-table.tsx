
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  where,
  getDocs
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
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listener for the initial 20 newest students
  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(collection(db, 'students'), orderBy('timestamp', 'desc'), limit(20));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!searchTerm) {
          const studentsData: Student[] = [];
          querySnapshot.forEach((doc) => {
            studentsData.push({ id: doc.id, ...doc.data() } as Student);
          });
          setStudents(studentsData);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching initial students: ", err);
        setError("Failed to load initial student list. Please check Firestore permissions.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [searchTerm]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setLoading(true);

    try {
      const q = query(
        collection(db, 'students'), 
        where('searchableName', '>=', searchTerm.toLowerCase()),
        where('searchableName', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        orderBy('searchableName', 'asc'), // Required for range filtering
        orderBy('timestamp', 'desc') // Sort results by newest
      );
      
      const querySnapshot = await getDocs(q);
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() } as Student);
      });
      setStudents(studentsData);
    } catch (err: any) {
      console.error("Error searching students: ", err);
      // Check for the specific Firestore index error
      if (err.code === 'failed-precondition') {
        // Extract the index creation link from the error message
        const urlMatch = err.message.match(/(https?:\/\/[^\s]+)/);
        const indexCreationUrl = urlMatch ? urlMatch[0] : null;
        
        const friendlyError = (
          <div>
            <p className="mb-2">The search feature requires a database index that hasn't been created yet.</p>
            {indexCreationUrl ? (
              <Button asChild>
                <Link href={indexCreationUrl} target="_blank" rel="noopener noreferrer">
                  Click here to create the index in a new tab
                </Link>
              </Button>
            ) : (
              <p>Please go to your Firestore indexes panel and create a composite index for the 'students' collection.</p>
            )}
            <p className="mt-2 text-xs">After creating the index, it may take a few minutes to build. Then, please refresh the page and try searching again.</p>
          </div>
        );
        setError(friendlyError as any);
      } else {
        setError("Failed to perform search. An unknown error occurred.");
      }
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  }, [searchTerm]);

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
              <Input
                  placeholder="Search full database by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="w-full"
              />
              <Button onClick={handleSearch} disabled={isSearching || !searchTerm}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground px-1">
              {searchTerm ? `Showing results for "${searchTerm}".` : 'Showing 20 newest students. Use search to find anyone.'}
            </p>
       </div>
       <div className="max-h-[calc(100vh-350px)] overflow-auto">
        {error && (
            <Alert variant="destructive" className="m-4">
                <AlertTitle>Action Required</AlertTitle>
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
                        {student.assignedTo === 'Unassigned' && <Badge className="py-0.5 px-1.5 text-xs bg-accent text-accent-foreground">New</Badge>}
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
            ) : (
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
