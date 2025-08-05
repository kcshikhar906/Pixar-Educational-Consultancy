
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

type SortKey = keyof Student | 'timestamp';

export function FullDataTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({
    key: 'timestamp',
    direction: 'descending',
  });

  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
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
      },
      (error) => {
        console.error("Error fetching students: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const sortedStudents = useMemo(() => {
    let sortableStudents = [...students];
    if (sortConfig.key) {
      sortableStudents.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        if (aValue instanceof Timestamp && bValue instanceof Timestamp) {
            comparison = aValue.toMillis() - bValue.toMillis();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableStudents;
  }, [students, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  }
  
  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (timestamp && timestamp.toDate) {
      return format(timestamp.toDate(), 'PPP, p');
    }
    return 'N/A';
  };
  
   const getVisaStatusBadgeVariant = (status?: Student['visaStatus']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getFeeStatusBadgeVariant = (status?: Student['serviceFeeStatus']) => {
    switch (status) {
        case 'Paid': return 'default';
        case 'Partial': return 'secondary';
        case 'Unpaid': return 'outline';
        default: return 'outline';
    }
  };

  const columns: { key: SortKey; label: string; render?: (item: Student) => React.ReactNode }[] = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobileNumber', label: 'Mobile Number' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'visaStatus', label: 'Visa Status', render: (item) => <Badge variant={getVisaStatusBadgeVariant(item.visaStatus)}>{item.visaStatus || 'N/A'}</Badge> },
    { key: 'serviceFeeStatus', label: 'Service Fee Status', render: (item) => <Badge variant={getFeeStatusBadgeVariant(item.serviceFeeStatus)}>{item.serviceFeeStatus || 'N/A'}</Badge> },
    { key: 'preferredStudyDestination', label: 'Destination' },
    { key: 'lastCompletedEducation', label: 'Last Education' },
    { key: 'englishProficiencyTest', label: 'English Test' },
    { key: 'collegeUniversityName', label: 'College/University' },
    { key: 'emergencyContact', label: 'Emergency Contact' },
    { key: 'additionalNotes', label: 'Additional Notes' },
    { key: 'timestamp', label: 'Date Added', render: (item) => formatDate(item.timestamp) },
    { key: 'visaStatusUpdateDate', label: 'Visa Status Date', render: (item) => formatDate(item.visaStatusUpdateDate) },
    { key: 'serviceFeePaidDate', label: 'Fee Paid Date', render: (item) => formatDate(item.serviceFeePaidDate) },
  ];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                 <TableHead key={col.key}>
                    <Button variant="ghost" onClick={() => requestSort(col.key as SortKey)} className="px-2 py-1 h-auto">
                        {col.label}
                        {getSortIndicator(col.key as SortKey)}
                    </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">Loading data...</TableCell>
              </TableRow>
            ) : sortedStudents.length > 0 ? (
              sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-xs">
                      {col.render ? col.render(student) : (student[col.key as keyof Student] as React.ReactNode || 'N/A')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
