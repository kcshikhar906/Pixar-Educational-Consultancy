'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Users, CheckCircle, Clock, Globe, UserCheck, BookOpen, Languages } from 'lucide-react';

interface DashboardMetrics {
  totalStudents?: number;
  visaGranted?: number;
  pendingVisa?: number;
  byDestination?: { [key: string]: number };
  byCounselor?: { [key: string]: number };
  byEducation?: { [key: string]: number };
  byEnglishTest?: { [key: string]: number };
}

interface ChartData {
  name: string;
  count: number;
}

const sortData = (data: { [key: string]: number } | undefined): ChartData[] => {
    if (!data) return [];
    return Object.entries(data)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
};


export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, 'metrics', 'dashboard');
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setMetrics(docSnap.data() as DashboardMetrics);
        } else {
          setError("Dashboard data not found. Please ensure the aggregation function is working.");
        }
        setLoading(false);
      }, 
      (err) => {
        console.error("Error fetching dashboard metrics:", err);
        setError("Failed to load dashboard data. Please check the console for details.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const destinationData = sortData(metrics?.byDestination);
  const counselorData = sortData(metrics?.byCounselor);
  const educationData = sortData(metrics?.byEducation);
  const englishTestData = sortData(metrics?.byEnglishTest);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
            <Skeleton className="lg:col-span-4 h-80" />
            <Skeleton className="lg:col-span-3 h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
         <Alert variant="destructive">
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <SectionTitle
        title="Student Analytics Dashboard"
        subtitle="A real-time overview of student data and key metrics."
      />
      
      {/* Key Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Total student records in the database.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visas Granted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.visaGranted || 0}</div>
             <p className="text-xs text-muted-foreground">Students with 'Approved' visa status.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visas Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pendingVisa || 0}</div>
            <p className="text-xs text-muted-foreground">Students with 'Pending' visa status.</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center"><Globe className="mr-2 h-5 w-5"/>Student Distribution by Destination</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={destinationData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Students" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
           <CardHeader>
            <CardTitle className="flex items-center"><UserCheck className="mr-2 h-5 w-5"/>Student Assignments by Counselor</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={counselorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Students" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Text Summaries */}
       <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5"/>Breakdown by Last Education</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {educationData.length > 0 ? educationData.map(item => (
                  <li key={item.name} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold">{item.count}</span>
                  </li>
                )) : <p className="text-muted-foreground text-center">No data available.</p>}
              </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Languages className="mr-2 h-5 w-5"/>Breakdown by English Test</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm">
                    {englishTestData.length > 0 ? englishTestData.map(item => (
                    <li key={item.name} className="flex justify-between">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold">{item.count}</span>
                    </li>
                    )) : <p className="text-muted-foreground text-center">No data available.</p>}
                </ul>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
