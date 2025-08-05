
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const studentsData: Student[] = [];
        querySnapshot.forEach((doc) => {
          studentsData.push({ id: doc.id, ...doc.data() } as Student);
        });
        setStudents(studentsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching students: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredStudents = useMemo(() => {
    let sorted = [...students].sort((a, b) => {
      // Prioritize "Unassigned"
      if (a.assignedTo === 'Unassigned' && b.assignedTo !== 'Unassigned') return -1;
      if (a.assignedTo !== 'Unassigned' && b.assignedTo === 'Unassigned') return 1;
      // Then sort by timestamp descending (newest first)
      const dateA = a.timestamp?.toDate() ?? new Date(0);
      const dateB = b.timestamp?.toDate() ?? new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return sorted.filter(student => {
      const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = assignedToFilter === 'all' || student.assignedTo === assignedToFilter;
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, assignedToFilter]);
  
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
            <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
            />
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Assigned:</label>
                <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by counselor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {counselorNames.map(name => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
       </div>
       <div className="max-h-[calc(100vh-350px)] overflow-auto">
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
