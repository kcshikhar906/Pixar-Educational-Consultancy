
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

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Listener for the initial 20 newest students
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'students'), orderBy('timestamp', 'desc'), limit(20));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!searchTerm) { // Only update if not currently searching
          const studentsData: Student[] = [];
          querySnapshot.forEach((doc) => {
            studentsData.push({ id: doc.id, ...doc.data() } as Student);
          });
          setStudents(studentsData);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching initial students: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [searchTerm]);

  // Function to handle full database search
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      // If search term is cleared, the useEffect will handle reverting to the initial list
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    setLoading(true);

    try {
      // Query by lowercase searchableName for case-insensitive search
      const q = query(
        collection(db, 'students'), 
        where('searchableName', '>=', searchTerm.toLowerCase()),
        where('searchableName', '<=', searchTerm.toLowerCase() + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() } as Student);
      });
      setStudents(studentsData);
    } catch (error) {
      console.error("Error searching students: ", error);
      setSearchError("Failed to perform search. Please try again.");
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
        {searchError && <p className="text-destructive text-center p-4">{searchError}</p>}
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
