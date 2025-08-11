
'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  endBefore,
  limitToLast,
  Query,
  DocumentData,
  QueryDocumentSnapshot,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StudentsAllTable } from '@/components/admin/students-all-table';
import { Loader2, Database, AlertTriangle, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { counselorNames } from '@/lib/data.tsx';

const PAGE_SIZE = 50;

export default function StudentsAllPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for filters
  const [visaStatusFilter, setVisaStatusFilter] = useState('all');
  const [feeStatusFilter, setFeeStatusFilter] = useState('all');
  const [counselorFilter, setCounselorFilter] = useState('all');

  const { toast } = useToast();
  
  const filters = useMemo(() => ({
    visaStatus: visaStatusFilter,
    serviceFeeStatus: feeStatusFilter,
    assignedTo: counselorFilter,
  }), [visaStatusFilter, feeStatusFilter, counselorFilter]);

  const fetchStudents = useCallback(async (pageDirection: 'next' | 'prev' | 'first' = 'first', newFilters = filters) => {
    setIsLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = [orderBy('timestamp', 'desc')];
      
      if (newFilters.visaStatus !== 'all') {
        constraints.push(where('visaStatus', '==', newFilters.visaStatus));
      }
      if (newFilters.serviceFeeStatus !== 'all') {
        constraints.push(where('serviceFeeStatus', '==', newFilters.serviceFeeStatus));
      }
      if (newFilters.assignedTo !== 'all') {
        constraints.push(where('assignedTo', '==', newFilters.assignedTo));
      }

      let q: Query<DocumentData>;

      if (pageDirection === 'next' && lastVisible) {
        q = query(collection(db, 'students'), ...constraints, startAfter(lastVisible), limit(PAGE_SIZE));
      } else if (pageDirection === 'prev' && firstVisible) {
        q = query(collection(db, 'students'), ...constraints, endBefore(firstVisible), limitToLast(PAGE_SIZE));
      } else {
        q = query(collection(db, 'students'), ...constraints, limit(PAGE_SIZE));
        setCurrentPage(1);
      }

      const documentSnapshots = await getDocs(q);
      const studentData: Student[] = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        serviceFeePaidDate: doc.data().serviceFeePaidDate?.toDate(),
        visaStatusUpdateDate: doc.data().visaStatusUpdateDate?.toDate(),
      })) as Student[];

      if (studentData.length === 0 && pageDirection !== 'first' && isDataLoaded) {
        toast({ title: "No more students", description: `You have reached the ${pageDirection === 'next' ? 'end' : 'beginning'} of the list.` });
        setIsLoading(false);
        return;
      }

      if (pageDirection === 'next') setCurrentPage(p => p + 1);
      if (pageDirection === 'prev' && currentPage > 1) setCurrentPage(p => p - 1);
      
      setStudents(studentData);
      setFirstVisible(documentSnapshots.docs[0] || null);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
      if (!isDataLoaded) setIsDataLoaded(true);

    } catch (err: any) {
      console.error(err);
      let errorMessage = 'Failed to fetch students. An error occurred.';
      if (err.code === 'failed-precondition') {
        errorMessage = 'This query requires a custom index. Please check the Firestore console for an index creation link in the error logs.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [lastVisible, firstVisible, isDataLoaded, currentPage, toast, filters]);
  
  const handleFilterChange = () => {
    fetchStudents('first', {
        visaStatus: visaStatusFilter,
        serviceFeeStatus: feeStatusFilter,
        assignedTo: counselorFilter,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Database className="mr-2" /> All Student Records</CardTitle>
          <CardDescription>
            Filter and view all student data. Click 'Load Students' to begin or 'Apply Filters' to refine your search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 space-y-1">
                <Label htmlFor="visaStatus">Visa Status</Label>
                <Select value={visaStatusFilter} onValueChange={setVisaStatusFilter}>
                    <SelectTrigger id="visaStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Not Applied">Not Applied</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1 space-y-1">
                <Label htmlFor="feeStatus">Fee Status</Label>
                <Select value={feeStatusFilter} onValueChange={setFeeStatusFilter}>
                    <SelectTrigger id="feeStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1 space-y-1">
                <Label htmlFor="counselor">Assigned To</Label>
                <Select value={counselorFilter} onValueChange={setCounselorFilter}>
                    <SelectTrigger id="counselor"><SelectValue /></SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">All</SelectItem>
                        {counselorNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-end">
                <Button onClick={handleFilterChange} disabled={isLoading || !isDataLoaded}>
                    <Search className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
            </div>
          </div>
          
          {!isDataLoaded ? (
            <div className="text-center py-12">
              <Button onClick={() => fetchStudents('first')} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Load Recent 50 Students
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {isLoading ? (
                 <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : (
                <StudentsAllTable data={students} />
              )}
              <div className="flex items-center justify-between space-x-2 py-4">
                <span className="text-sm text-muted-foreground">Page {currentPage}</span>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchStudents('prev')}
                        disabled={isLoading || currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchStudents('next')}
                        disabled={isLoading || students.length < PAGE_SIZE}
                    >
                        Next
                    </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

    