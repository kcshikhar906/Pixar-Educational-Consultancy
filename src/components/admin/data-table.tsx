
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Search, AlertTriangle, UserPlus, X, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNowStrict, isToday, format } from 'date-fns';

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
  students: Student[];
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
  loading: boolean;
}

export function DataTable({ students, onRowSelect, selectedStudentId, loading }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const getRelativeDate = (date: any) => {
    if (!date) return 'No date';
    const timestamp = date.toDate ? date.toDate() : new Date(date);
    if (isNaN(timestamp.getTime())) return 'Invalid date';

    if (isToday(timestamp)) {
      return "Today";
    }
    return `${formatDistanceToNowStrict(timestamp)} ago`;
  };
  
  const safeToDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    if (typeof dateValue.toDate === 'function') return dateValue.toDate();
    if (dateValue instanceof Date) return dateValue;
    const parsedDate = new Date(dateValue);
    if (!isNaN(parsedDate.getTime())) return parsedDate;
    return null;
  };

  const getInquiryTypeBadge = (student: Student) => {
    if (student.inquiryType === 'visit' && student.appointmentDate) {
        return <Badge variant="secondary" className="py-0.5 px-1.5 text-xs">Visit: {format(safeToDate(student.appointmentDate)!, 'dd MMM')}</Badge>;
    }
    if (student.inquiryType === 'phone') {
        return <Badge variant="secondary" className="py-0.5 px-1.5 text-xs">Phone Call</Badge>;
    }
     if (student.inquiryType === 'office_walk_in') {
        return <Badge variant="secondary" className="py-0.5 px-1.5 text-xs">Walk-In</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-4">
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
      <div className="max-h-[calc(100vh-250px)] overflow-auto">
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
