
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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
import { Loader2, Database, AlertTriangle, Search, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { counselorNames, studyDestinationOptions } from '@/lib/data.tsx';
import { formatDistanceToNow } from 'date-fns';

const PAGE_SIZE = 50;

interface FilterState {
  visaStatus: string;
  serviceFeeStatus: string;
  assignedTo: string;
  preferredStudyDestination: string;
}

interface FilterHistoryItem {
  timestamp: number;
  filters: FilterState;
}

const FILTER_HISTORY_KEY = 'filterHistory';

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


export default function StudentsAllPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [history, setHistory] = useState<FilterHistoryItem[]>([]);
  
  // State for filters
  const [visaStatusFilter, setVisaStatusFilter] = useState('all');
  const [feeStatusFilter, setFeeStatusFilter] = useState('all');
  const [counselorFilter, setCounselorFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');

  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(FILTER_HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
        console.error("Could not load filter history from localStorage", error);
    }
  }, []);

  const addHistoryItem = (filters: FilterState) => {
    const newItem = { filters, timestamp: Date.now() };
    const newHistory = [newItem, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
     try {
        localStorage.setItem(FILTER_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
        console.error("Could not save filter history to localStorage", error);
    }
  };
  
  const filters = useMemo(() => ({
    visaStatus: visaStatusFilter,
    serviceFeeStatus: feeStatusFilter,
    assignedTo: counselorFilter,
    preferredStudyDestination: destinationFilter,
  }), [visaStatusFilter, feeStatusFilter, counselorFilter, destinationFilter]);

  const fetchStudents = useCallback(async (pageDirection: 'next' | 'prev' | 'first' = 'first', currentFilters = filters, currentSearchTerm = debouncedSearchTerm) => {
    setIsLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = [];
      
      const searchLower = currentSearchTerm.toLowerCase();
      if (searchLower) {
        constraints.push(orderBy('searchableName'));
        constraints.push(where('searchableName', '>=', searchLower));
        constraints.push(where('searchableName', '<=', searchLower + '\uf8ff'));
      } else {
        constraints.push(orderBy('timestamp', 'desc'));
      }
      
      if (currentFilters.visaStatus !== 'all') {
        constraints.push(where('visaStatus', '==', currentFilters.visaStatus));
      }
      if (currentFilters.serviceFeeStatus !== 'all') {
        constraints.push(where('serviceFeeStatus', '==', currentFilters.serviceFeeStatus));
      }
      if (currentFilters.assignedTo !== 'all') {
        constraints.push(where('assignedTo', '==', currentFilters.assignedTo));
      }
      if (currentFilters.preferredStudyDestination !== 'all') {
        constraints.push(where('preferredStudyDestination', '==', currentFilters.preferredStudyDestination));
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
      
      if(pageDirection === 'first') {
        addHistoryItem(currentFilters);
      }

      const studentData: Student[] = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        serviceFeePaidDate: doc.data().serviceFeePaidDate?.toDate(),
        visaStatusUpdateDate: doc.data().visaStatusUpdateDate?.toDate(),
      })) as Student[];

      if (studentData.length === 0 && (pageDirection !== 'first' || searchLower) && isDataLoaded) {
         toast({ title: "No more students", description: `You have reached the end of the list for this query.` });
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
  }, [lastVisible, firstVisible, isDataLoaded, currentPage, toast, filters, debouncedSearchTerm]);
  
  const handleFilterChange = () => {
    setSearchTerm(''); // Reset search term when applying new filters
    fetchStudents('first', filters, '');
  };

  // Effect to handle searching
  useEffect(() => {
    // Only trigger search if data has been loaded at least once or if search term is cleared
    if (isDataLoaded) {
      fetchStudents('first', filters, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, isDataLoaded, filters]); // removed fetchStudents from dependency array

  const renderFilterHistory = () => {
    if (history.length === 0) {
      return <p className="text-sm text-muted-foreground text-center py-4">No filter history found.</p>;
    }
    return (
      <ul className="space-y-2 text-sm text-muted-foreground">
        {history.map((item, index) => {
          const appliedFilters = Object.entries(item.filters)
            .filter(([, value]) => value !== 'all')
            .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`)
            .join(', ');
          return (
            <li key={index} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
              <span>{appliedFilters || 'No filters applied'}</span>
              <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Database className="mr-2" /> All Student Records</CardTitle>
          <CardDescription>
            Filter and search all student data. Click 'Load Students' to begin or 'Apply Filters' to refine your search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-1">
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
            <div className="space-y-1">
                <Label htmlFor="feeStatus">Fee Status</Label>
                <Select value={feeStatusFilter} onValueChange={setFeeStatusFilter}>
                    <SelectTrigger id="feeStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="counselor">Assigned To</Label>
                <Select value={counselorFilter} onValueChange={setCounselorFilter}>
                    <SelectTrigger id="counselor"><SelectValue /></SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">All</SelectItem>
                        {counselorNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="destination">Destination</Label>
                <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                    <SelectTrigger id="destination"><SelectValue /></SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">All</SelectItem>
                        {studyDestinationOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-end">
                <Button onClick={handleFilterChange} disabled={isLoading || !isDataLoaded} className="w-full">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-sm pl-10"
                />
              </div>

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

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5" /> Filter History</CardTitle>
                <CardDescription>History of the last 5 filters applied on this browser.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderFilterHistory()}
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
