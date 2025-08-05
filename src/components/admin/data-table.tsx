
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student, counselorNames } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { ListFilter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  
  useEffect(() => {
    const savedFilter = localStorage.getItem('assignedToFilter');
    if (savedFilter) {
      setAssignedToFilter(savedFilter);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('assignedToFilter', assignedToFilter);
  }, [assignedToFilter]);

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
      // Explicitly sort here to ensure order is always correct after any update
      const sortedStudents = studentsData.sort((a, b) => {
        const timestampA = a.timestamp?.toDate()?.getTime() || 0;
        const timestampB = b.timestamp?.toDate()?.getTime() || 0;
        return timestampB - timestampA;
      });
      setStudents(sortedStudents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.fullName || '';
      const email = student.email || '';
      const matchesText =
        name.toLowerCase().includes(filter.toLowerCase()) ||
        email.toLowerCase().includes(filter.toLowerCase());

      const matchesAssignedTo =
        assignedToFilter === 'all' || student.assignedTo === assignedToFilter;

      return matchesText && matchesAssignedTo;
    });
  }, [students, filter, assignedToFilter]);

  const getVisaStatusBadgeVariant = (status: Student['visaStatus']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'Not Applied': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-4 pt-2 flex items-center gap-4">
        <Input
          placeholder="Filter by name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 flex-grow"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuLabel>Assigned To</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuCheckboxItem checked={assignedToFilter === 'all'} onCheckedChange={() => setAssignedToFilter('all')}>All</DropdownMenuCheckboxItem>
             {counselorNames.map(counselor => (
                <DropdownMenuCheckboxItem key={counselor} checked={assignedToFilter === counselor} onCheckedChange={() => setAssignedToFilter(counselor)}>{counselor}</DropdownMenuCheckboxItem>
             ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="max-h-[calc(100vh-220px)] overflow-auto">
        <Table>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
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
                       <Badge variant={getVisaStatusBadgeVariant(student.visaStatus)} className="py-0.5 px-1.5 text-xs">
                          {student.visaStatus}
                       </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
