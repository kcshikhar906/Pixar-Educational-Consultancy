

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, onSnapshot, query, Timestamp, FirestoreError, getDocs, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, BarChart3, Calendar, CheckCircle, Clock, Globe, Loader2, Users, ShieldAlert, LineChart, PieChart as PieChartIcon, DollarSign, GraduationCap, Languages, FileCheck, FileX, CircleDollarSign, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { Student } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

// Define the structure for the stats object that we'll compute on the client-side
interface DashboardStats {
  totalStudents: number;
  studentsByDestination: { [country: string]: number };
  visaStatusCounts: { [status: string]: number };
  monthlyAdmissions: { [month: string]: number };
  studentsByCounselor: { [counselor: string]: number };
  serviceFeeStatusCounts: { [status: string]: number };
  studentsByEducation: { [education: string]: number };
  studentsByEnglishTest: { [test: string]: number };
}

interface CachedStats {
    stats: DashboardStats;
    timestamp: number;
}

const CACHE_KEY = 'dashboardStatsCache';
const CACHE_DURATION_MINUTES = 15;

// Define colors for the charts
const PIE_CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const BAR_CHART_COLOR_PRIMARY = 'hsl(var(--chart-1))';
const BAR_CHART_COLOR_SECONDARY = 'hsl(var(--chart-2))';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
  description?: string;
}

const StatCard = ({ title, value, icon: Icon, className, description }: StatCardProps) => (
  <Card className={cn("transform transition-transform duration-300 hover:scale-105 shadow-lg", className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
      <CardTitle className="text-xs font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4" />
    </CardHeader>
    <CardContent className="p-3 pt-0">
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs opacity-80">{description}</p>}
    </CardContent>
  </Card>
);

// Name mapping to consolidate old names to new full names for metrics
const counselorNameMapping: {[oldName: string]: string} = {
  "Pawan Sir": "Pawan Acharya",
  "Mujal Sir": "Mujal Amatya",
  "Sabina Mam": "Sabina Thapa",
  "Shyam Sir": "Shyam Babu Ojha",
  "Mamta Miss": "Mamata Chapagain",
  "Pradeep Sir": "Pradeep Khadka",
};

// Helper to normalize and map counselor names
const getNormalizedCounselorName = (name: string | undefined | null): string => {
    if (!name) return "Unassigned";
    const trimmedName = name.trim();
    // Return the new full name if the input is an old name, otherwise return the name as is.
    return counselorNameMapping[trimmedName] || toTitleCase(trimmedName);
};

// Helper to normalize strings to Title Case for consistency
const toTitleCase = (str: string | undefined | null): string => {
    if (!str) return "N/A";
    return str
        .trim() // Trim leading/trailing whitespace
        .replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        });
};


const processStudentDocs = (studentDocs: Student[]): DashboardStats => {
    const newStats: DashboardStats = {
        totalStudents: 0,
        studentsByDestination: {},
        visaStatusCounts: {},
        monthlyAdmissions: {},
        studentsByCounselor: {},
        serviceFeeStatusCounts: {},
        studentsByEducation: {},
        studentsByEnglishTest: {},
    };

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    studentDocs.forEach(student => {
        newStats.totalStudents++;

        const dest = toTitleCase(student.preferredStudyDestination);
        newStats.studentsByDestination[dest] = (newStats.studentsByDestination[dest] || 0) + 1;

        const visa = toTitleCase(student.visaStatus);
        newStats.visaStatusCounts[visa] = (newStats.visaStatusCounts[visa] || 0) + 1;

        const coun = getNormalizedCounselorName(student.assignedTo);
        newStats.studentsByCounselor[coun] = (newStats.studentsByCounselor[coun] || 0) + 1;
        
        const fee = toTitleCase(student.serviceFeeStatus);
        newStats.serviceFeeStatusCounts[fee] = (newStats.serviceFeeStatusCounts[fee] || 0) + 1;

        const edu = toTitleCase(student.lastCompletedEducation);
        newStats.studentsByEducation[edu] = (newStats.studentsByEducation[edu] || 0) + 1;

        const test = toTitleCase(student.englishProficiencyTest);
        newStats.studentsByEnglishTest[test] = (newStats.studentsByEnglishTest[test] || 0) + 1;

        if (student.timestamp && (student.timestamp as Timestamp).toDate) {
            const date = (student.timestamp as Timestamp).toDate();
            if (date > twelveMonthsAgo) {
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                newStats.monthlyAdmissions[monthYear] = (newStats.monthlyAdmissions[monthYear] || 0) + 1;
            }
        }
    });
    return newStats;
};


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCachedData, setIsCachedData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
      // Use a real-time listener for the metrics document
      const metricsDocRef = doc(db, 'metrics', 'dashboard');
      const unsubscribe = onSnapshot(metricsDocRef, (docSnap) => {
          if (docSnap.exists()) {
              const data = docSnap.data() as DashboardStats;
              setStats(data);
              setLastUpdated(Date.now());
              setError(null);
          } else {
              setError('no-summary-doc');
              setStats(null);
          }
          setLoading(false);
      }, (err: any) => {
          if (err.code === 'permission-denied') {
              setError('permission-denied');
          } else {
              console.error("Error with metrics snapshot:", err);
              setError("An unknown error occurred while loading dashboard data.");
          }
          setLoading(false);
      });

      // Cleanup listener on component unmount
      return () => unsubscribe();
  }, []);

  const dataMappers = useMemo(() => {
    if (!stats) return {};

    const sortAndMap = (data: { [key: string]: number } | undefined, nameKey: string, valueKey: string) => {
        if (!data) return [];
        return Object.entries(data)
            .map(([name, value]) => ({ [nameKey]: name, [valueKey]: value }))
            .sort((a, b) => b[valueKey] - a[valueKey]);
    };
    
    return {
        destinationData: sortAndMap(stats.studentsByDestination, 'name', 'students'),
        visaStatusData: sortAndMap(stats.visaStatusCounts, 'name', 'value'),
        monthlyAdmissionsData: stats.monthlyAdmissions ? Object.entries(stats.monthlyAdmissions)
            .map(([month, value]) => ({ name: month, students: value }))
            .sort((a, b) => a.name.localeCompare(b.name)) : [],
        counselorData: sortAndMap(stats.studentsByCounselor, 'name', 'students'),
        educationData: sortAndMap(stats.studentsByEducation, 'name', 'students'),
        englishTestData: sortAndMap(stats.studentsByEnglishTest, 'name', 'value'),
    };
  }, [stats]);


  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
     return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             {error === 'permission-denied' ? (
                <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Action Required: Firestore Permissions</AlertTitle>
                    <AlertDescription>
                        The dashboard failed to load due to missing Firestore security rules. Please go to your Firebase Console, navigate to **Firestore Database &gt; Rules**, and ensure your rules allow authenticated admin users to read the `metrics/dashboard` document. A common rule for development is `allow read, write: if request.auth != null;`.
                    </AlertDescription>
                </Alert>
             ) : error === 'no-summary-doc' ? (
                <Alert>
                    <LineChart className="h-4 w-4" />
                    <AlertTitle>Dashboard Data Not Found</AlertTitle>
                    <AlertDescription>
                        The pre-calculated dashboard summary document ('metrics/dashboard') could not be found. Please run the aggregation script (`npx tsx scripts/aggregate-stats.ts`) in your project's terminal to generate it. This script calculates all stats and creates the necessary document for the dashboard to display.
                    </AlertDescription>
                </Alert>
             ) : (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
             )}
        </main>
     );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <Alert variant="default" className="bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
            <Clock className="h-4 w-4" />
            <AlertTitle>Live Dashboard</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
                <span>
                This dashboard is updated in real-time. Last data update detected {lastUpdated ? formatDistanceToNow(lastUpdated, { addSuffix: true }) : 'a moment'} ago.
                </span>
            </AlertDescription>
        </Alert>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
         <StatCard 
            title="Total Students" 
            value={stats?.totalStudents || 0}
            icon={Users}
            className="bg-primary text-primary-foreground"
          />
          <StatCard 
            title="Visas Approved" 
            value={stats?.visaStatusCounts?.Approved || 0}
            icon={FileCheck}
            className="bg-green-600 text-white"
          />
          <StatCard 
            title="Visas Rejected" 
            value={stats?.visaStatusCounts?.Rejected || 0}
            icon={FileX}
            className="bg-red-600 text-white"
          />
          <StatCard 
            title="Visas Pending" 
            value={stats?.visaStatusCounts?.Pending || 0}
            icon={Clock}
            className="bg-amber-500 text-white"
          />
          <StatCard 
            title="Fees Paid" 
            value={stats?.serviceFeeStatusCounts?.Paid || 0}
            icon={CircleDollarSign}
            className="bg-chart-3 text-white"
          />
           <StatCard 
            title="Fees Unpaid" 
            value={stats?.serviceFeeStatusCounts?.Unpaid || 0}
            icon={DollarSign}
            className="bg-chart-5 text-white"
          />
          <StatCard 
            title="Unassigned" 
            value={stats?.studentsByCounselor?.Unassigned || 0}
            icon={Users}
            className="bg-accent text-accent-foreground"
            description="New Leads"
          />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center"><Calendar className="mr-2 h-5 w-5" />Monthly New Students</CardTitle>
                <CardDescription>New student registrations over the last 12 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataMappers.monthlyAdmissionsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill={BAR_CHART_COLOR_PRIMARY} radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
             <CardHeader>
                <CardTitle className="flex items-center"><PieChartIcon className="mr-2 h-5 w-5" />Visa Status Distribution</CardTitle>
                <CardDescription>Breakdown of current student visa statuses.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={dataMappers.visaStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                        {dataMappers.visaStatusData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                        </Pie>
                         <Tooltip />
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3">
             <CardHeader>
                <CardTitle className="flex items-center"><Languages className="mr-2 h-5 w-5" />English Proficiency Status</CardTitle>
                <CardDescription>Breakdown of students by English test taken.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={dataMappers.englishTestData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                        {dataMappers.englishTestData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                        </Pie>
                         <Tooltip />
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" />Student Distribution by Counselor</CardTitle>
                <CardDescription>Number of students assigned to each counselor.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataMappers.counselorData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" fontSize={12} allowDecimals={false}/>
                        <YAxis type="category" dataKey="name" fontSize={12} width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill={BAR_CHART_COLOR_SECONDARY} radius={[0, 4, 4, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
         <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center"><Globe className="mr-2 h-5 w-5" />Student Distribution by Destination</CardTitle>
                <CardDescription>Number of students aspiring for each country.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataMappers.destinationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} allowDecimals={false}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill={BAR_CHART_COLOR_PRIMARY} radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </CardContent>
        </Card>
         <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center"><GraduationCap className="mr-2 h-5 w-5" />Student Distribution by Education</CardTitle>
                <CardDescription>Breakdown by last completed education level.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataMappers.educationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} allowDecimals={false}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill={BAR_CHART_COLOR_SECONDARY} radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
