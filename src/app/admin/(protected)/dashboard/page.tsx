
'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, BarChart3, Calendar, CheckCircle, Clock, Globe, Loader2, Users } from 'lucide-react';
import type { Student } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the structure for the summary stats document
interface DashboardStats {
  totalStudents: number;
  studentsByCountry: { [country: string]: number };
  visaStatusCounts: { [status: string]: number };
  monthlyAdmissions: { [month: string]: number };
}

// Define colors for the charts
const PIE_CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const BAR_CHART_COLOR = 'hsl(var(--chart-1))';

// --- Data Processing Functions ---
// These functions are used as a fallback if the /dashboard/stats document doesn't exist.
const processStudentDataForStats = (students: Student[]): DashboardStats => {
  const studentsByCountry: { [country: string]: number } = {};
  const visaStatusCounts: { [status: string]: number } = { 'Approved': 0, 'Rejected': 0, 'Pending': 0, 'Not Applied': 0 };
  const monthlyAdmissions: { [month: string]: number } = {};

  students.forEach(student => {
    // Country count
    const country = student.preferredStudyDestination || 'N/A';
    studentsByCountry[country] = (studentsByCountry[country] || 0) + 1;

    // Visa status count
    const visaStatus = student.visaStatus || 'Not Applied';
    if (visaStatusCounts.hasOwnProperty(visaStatus)) {
        visaStatusCounts[visaStatus]++;
    }

    // Monthly admissions count (for the last 12 months)
    if (student.timestamp) {
      const date = student.timestamp.toDate();
      const now = new Date();
      if (now.getTime() - date.getTime() < 365 * 24 * 60 * 60 * 1000) {
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyAdmissions[monthYear] = (monthlyAdmissions[monthYear] || 0) + 1;
      }
    }
  });

  return {
    totalStudents: students.length,
    studentsByCountry,
    visaStatusCounts,
    monthlyAdmissions,
  };
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    // First, try to listen to the efficient summary document
    const statsDocRef = doc(db, 'dashboard', 'stats');
    const unsubscribe = onSnapshot(statsDocRef, (doc) => {
      if (doc.exists()) {
        setIsUsingFallback(false);
        setStats(doc.data() as DashboardStats);
        setLoading(false);
      } else {
        // If the summary doc doesn't exist, use the fallback method
        setIsUsingFallback(true);
        fetchAllStudentsAndCalculateStats();
      }
    }, (err) => {
      console.error("Error listening to stats document:", err);
      setError("Could not load dashboard data. Please check Firestore permissions.");
      setLoading(false);
    });

    const fetchAllStudentsAndCalculateStats = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'students'));
            const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
            const calculatedStats = processStudentDataForStats(studentsData);
            setStats(calculatedStats);
        } catch (err) {
            console.error("Error fetching all students:", err);
            setError("Failed to calculate stats from student data.");
        } finally {
            setLoading(false);
        }
    };
    
    return () => unsubscribe();
  }, []);

  const countryChartData = useMemo(() => {
    if (!stats?.studentsByCountry) return [];
    return Object.entries(stats.studentsByCountry).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [stats]);

  const visaStatusChartData = useMemo(() => {
    if (!stats?.visaStatusCounts) return [];
    return Object.entries(stats.visaStatusCounts).map(([name, value]) => ({ name, value }));
  }, [stats]);
  
  const monthlyAdmissionsChartData = useMemo(() => {
    if (!stats?.monthlyAdmissions) return [];
    const sortedData = Object.entries(stats.monthlyAdmissions)
      .map(([month, value]) => ({ name: month, students: value }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return sortedData;
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
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </main>
     )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {isUsingFallback && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Performance Warning: Using Fallback Data</AlertTitle>
                <AlertDescription>
                The dashboard is currently calculating stats by reading ALL student records, which can be slow and costly. For optimal performance, a developer should set up a Cloud Function to aggregate data into a `/dashboard/stats` document.
                </AlertDescription>
            </Alert>
        )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Total registered students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.visaStatusCounts?.Approved || 0}</div>
            <p className="text-xs text-muted-foreground">Total visas approved</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Destination</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countryChartData[0]?.name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Most popular country</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.visaStatusCounts?.Pending || 0}</div>
            <p className="text-xs text-muted-foreground">Applications currently pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center"><Calendar className="mr-2 h-5 w-5" />Monthly New Students</CardTitle>
                <CardDescription>New student registrations over the last 12 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyAdmissionsChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill={BAR_CHART_COLOR} radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
             <CardHeader>
                <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" />Students by Destination</CardTitle>
                <CardDescription>Distribution of students across preferred study destinations.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={countryChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                        {countryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                        </Pie>
                         <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
