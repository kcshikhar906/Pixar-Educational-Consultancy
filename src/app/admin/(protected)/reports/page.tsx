
'use client';

import { useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { counselorNames, Student } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Calendar as CalendarIcon, ClipboardList, Printer, CheckCircle, FileX, CircleDollarSign, UserPlus, TrendingUp, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SectionTitle from '@/components/ui/section-title';

interface ReportData {
  newlyAssigned: Student[];
  visasApproved: Student[];
  visasRejected: Student[];
  feesPaidInPeriod: Student[];
  totalFeesPaidCount: number;
}

const ReportStatCard = ({ title, value, icon: Icon, className }: { title: string, value: number, icon: React.ElementType, className?: string }) => (
    <Card className={cn("text-center shadow-lg", className)}>
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium flex items-center justify-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
);

const ReportDetailTable = ({ title, data, dateField, dateLabel = "Date" }: { title: string, data: Student[], dateField?: keyof Student, dateLabel?: string }) => (
  <div>
    <h3 className="text-lg font-semibold text-primary mb-2">{title} ({data.length})</h3>
    {data.length > 0 ? (
      <div className="overflow-hidden border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>{dateLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(student => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.fullName}</TableCell>
                <TableCell>{student.preferredStudyDestination || 'N/A'}</TableCell>
                <TableCell>{format((student[dateField || 'timestamp'] as Timestamp)?.toDate() || new Date(), 'dd MMM, yyyy')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ) : <p className="text-muted-foreground text-sm py-4">No records found for this period.</p>}
  </div>
);

export default function ReportsPage() {
  const [counselor, setCounselor] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: addDays(new Date(), -30), to: new Date() });
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = useCallback(async () => {
    if (!counselor || !dateRange?.from || !dateRange?.to) {
      toast({ title: 'Missing Information', description: 'Please select a counselor and a valid date range.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setReportData(null);

    try {
      const fromTimestamp = Timestamp.fromDate(dateRange.from);
      const toTimestamp = Timestamp.fromDate(new Date(dateRange.to.setHours(23, 59, 59, 999))); // Include end of day

      const studentsRef = collection(db, 'students');

      const newlyAssignedQuery = query(studentsRef, where('assignedTo', '==', counselor), where('timestamp', '>=', fromTimestamp), where('timestamp', '<=', toTimestamp), orderBy('timestamp', 'desc'));
      const visasApprovedQuery = query(studentsRef, where('assignedTo', '==', counselor), where('visaStatus', '==', 'Approved'), where('visaStatusUpdateDate', '>=', fromTimestamp), where('visaStatusUpdateDate', '<=', toTimestamp), orderBy('visaStatusUpdateDate', 'desc'));
      const visasRejectedQuery = query(studentsRef, where('assignedTo', '==', counselor), where('visaStatus', '==', 'Rejected'), where('visaStatusUpdateDate', '>=', fromTimestamp), where('visaStatusUpdateDate', '<=', toTimestamp), orderBy('visaStatusUpdateDate', 'desc'));
      const feesPaidInPeriodQuery = query(studentsRef, where('assignedTo', '==', counselor), where('serviceFeeStatus', '==', 'Paid'), where('serviceFeePaidDate', '>=', fromTimestamp), where('serviceFeePaidDate', '<=', toTimestamp), orderBy('serviceFeePaidDate', 'desc'));
      const totalFeesPaidQuery = query(studentsRef, where('assignedTo', '==', counselor), where('serviceFeeStatus', '==', 'Paid'));

      const [newlyAssignedSnap, visasApprovedSnap, visasRejectedSnap, feesPaidInPeriodSnap, totalFeesPaidSnap] = await Promise.all([
        getDocs(newlyAssignedQuery),
        getDocs(visasApprovedQuery),
        getDocs(visasRejectedQuery),
        getDocs(feesPaidInPeriodQuery),
        getDocs(totalFeesPaidQuery),
      ]);

      const data: ReportData = {
        newlyAssigned: newlyAssignedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)),
        visasApproved: visasApprovedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)),
        visasRejected: visasRejectedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)),
        feesPaidInPeriod: feesPaidInPeriodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)),
        totalFeesPaidCount: totalFeesPaidSnap.size,
      };

      setReportData(data);
    } catch (error: any) {
        console.error("Error generating report:", error);
        let errorMessage = "An error occurred while generating the report. Please try again.";
        if (error.code === 'failed-precondition') {
            errorMessage = "The query requires a custom index. Please check the Firestore console for an index creation link in the error logs. You may need to create composite indexes for queries involving multiple 'where' and 'orderBy' clauses.";
        }
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [counselor, dateRange, toast]);

  const visaApprovalRate = reportData ?
    (reportData.visasApproved.length + reportData.visasRejected.length > 0 ?
      ((reportData.visasApproved.length / (reportData.visasApproved.length + reportData.visasRejected.length)) * 100).toFixed(1) : '0.0')
    : '0.0';

  const totalPaidInNewCohort = reportData?.newlyAssigned.filter(s => s.serviceFeeStatus === 'Paid').length || 0;

  const feeConversionRate = reportData ?
    (reportData.newlyAssigned.length > 0 ?
      ((totalPaidInNewCohort / reportData.newlyAssigned.length) * 100).toFixed(1) : '0.0')
    : '0.0';

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          #report-section, #report-section * { visibility: visible; }
          #report-section { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
          .page-break { page-break-after: always; }
        }
      `}</style>

      <div className="no-print">
        <SectionTitle title="Counselor Reports" subtitle="Generate performance reports for counselors based on a selected date range." />
      </div>

      <Card className="no-print">
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
          <CardDescription>Select a counselor and date range to generate a new report.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={counselor} onValueChange={setCounselor}>
            <SelectTrigger><SelectValue placeholder="Select a Counselor" /></SelectTrigger>
            <SelectContent>
              {counselorNames.filter(c => c !== 'Unassigned').map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex">
                  <div className="flex flex-col space-y-2 border-r p-2">
                      <Button variant="ghost" className="justify-start" onClick={() => setDateRange({ from: addDays(new Date(), -7), to: new Date() })}>Last 7 Days</Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setDateRange({ from: addDays(new Date(), -30), to: new Date() })}>Last 30 Days</Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })}>This Month</Button>
                      <Button variant="ghost" className="justify-start" onClick={() => setDateRange({ from: startOfMonth(addDays(new Date(), -30)), to: endOfMonth(addDays(new Date(), -30)) })}>Last Month</Button>
                  </div>
                  <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={1} />
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleGenerateReport} disabled={isLoading || !counselor}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardList className="mr-2 h-4 w-4" />}
            Generate Report
          </Button>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3">Generating report...</p>
        </div>
      )}

      {reportData && (
        <div id="report-section">
          <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold text-primary">Performance Report: {counselor}</CardTitle>
                        <CardDescription className="text-md">
                        For period: {dateRange?.from ? format(dateRange.from, 'PPP') : ''} - {dateRange?.to ? format(dateRange.to, 'PPP') : ''}
                        </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => window.print()} className="no-print">
                        <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ReportStatCard title="New Students" value={reportData.newlyAssigned.length} icon={UserPlus} className="bg-blue-100 dark:bg-blue-900/50 border-blue-300" />
                <ReportStatCard title="Visas Approved" value={reportData.visasApproved.length} icon={CheckCircle} className="bg-green-100 dark:bg-green-900/50 border-green-300" />
                <ReportStatCard title="Visas Rejected" value={reportData.visasRejected.length} icon={FileX} className="bg-red-100 dark:bg-red-900/50 border-red-300" />
                <ReportStatCard title="Total Fees Paid" value={reportData.totalFeesPaidCount} icon={CircleDollarSign} className="bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Performance Snapshot (During Period)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Visa Approval Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{visaApprovalRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Based on {reportData.visasApproved.length + reportData.visasRejected.length} total visa decisions in this period.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Student to Paid Conversion</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{feeConversionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Of the {reportData.newlyAssigned.length} new students in this period, {totalPaidInNewCohort} have paid their fees.
                            </p>
                        </CardContent>
                    </Card>
                </div>
              </div>

              <div className="space-y-6">
                 <ReportDetailTable title="Newly Assigned Students" data={reportData.newlyAssigned} dateField="timestamp" dateLabel="Date Assigned" />
                 <ReportDetailTable title="Visa Approvals" data={reportData.visasApproved} dateField="visaStatusUpdateDate" dateLabel="Approval Date" />
                 <ReportDetailTable title="Visa Rejections" data={reportData.visasRejected} dateField="visaStatusUpdateDate" dateLabel="Rejection Date" />
                 <ReportDetailTable title="Service Fees Paid in Period" data={reportData.feesPaidInPeriod} dateField="serviceFeePaidDate" dateLabel="Date Paid" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

       {!isLoading && !reportData && (
         <Alert className="text-center no-print">
            <ClipboardList className="h-4 w-4" />
            <AlertTitle>Ready to Generate Reports</AlertTitle>
            <AlertDescription>
                Select a counselor and date range above to view a performance report.
            </AlertDescription>
         </Alert>
      )}
    </main>
  );
}

    