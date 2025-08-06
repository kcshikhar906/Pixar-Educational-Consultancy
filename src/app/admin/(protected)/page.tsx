
'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { DashboardMetrics } from '@/lib/dashboard-metrics';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, CheckCircle, Clock, XCircle, DollarSign, HandCoins } from 'lucide-react';
import SectionTitle from '@/components/ui/section-title';

const COLORS = ['#3F51B5', '#9575CD', '#E8EAF6', '#6573C3', '#B39DDB'];
const STATUS_COLORS: { [key: string]: string } = {
  'Approved': '#22c55e', // green-500
  'Pending': '#f97316', // orange-500
  'Rejected': '#ef4444', // red-500
  'Not Applied': '#64748b', // slate-500
};
const FEE_COLORS: { [key: string]: string } = {
    'Paid': '#22c55e',
    'Partial': '#f97316',
    'Unpaid': '#ef4444',
};


export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const metricsRef = doc(db, 'metrics', 'dashboard');
    const unsubscribe = onSnapshot(metricsRef, (doc) => {
      if (doc.exists()) {
        setMetrics(doc.data() as DashboardMetrics);
      } else {
        // Handle case where metrics doc doesn't exist yet
        console.log("Metrics document does not exist. Please create or update a student to generate it.");
        setMetrics(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching metrics: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const studentsByDestination = metrics ? Object.entries(metrics.studentsByDestination || {}).map(([name, count]) => ({ name, count })).filter(item => item.count > 0) : [];

  const studentsByCounselor = metrics ? Object.entries(metrics.studentsByCounselor || {}).map(([name, count]) => ({ name, count })).filter(item => item.count > 0 && item.name !== 'Unassigned') : [];

  const visaStatusData = metrics ? Object.entries(metrics.visaStatusCounts || {}).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || '#ccc' })) : [];
  
  const feeStatusData = metrics ? Object.entries(metrics.feeStatusCounts || {}).map(([name, value]) => ({ name, value, fill: FEE_COLORS[name] || '#ccc' })) : [];


  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }
  
  if (!metrics) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
             <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <SectionTitle title="Analytics Dashboard" subtitle="An overview of your consultancy's performance and student data." />
                <Card>
                    <CardHeader>
                        <CardTitle>Metrics Not Available</CardTitle>
                        <CardDescription>The dashboard analytics data has not been generated yet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Please add, edit, or delete a student record to trigger the initial data aggregation. This will create the necessary summary document for the dashboard.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
         <SectionTitle title="Analytics Dashboard" subtitle="An overview of your consultancy's performance and student data." />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalStudents || 0}</div>
                    <p className="text-xs text-muted-foreground">Total student records in the system</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unassigned Students</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.studentsByCounselor?.Unassigned || 0}</div>
                    <p className="text-xs text-muted-foreground">New leads waiting for assignment</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Visas Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{metrics.visaStatusCounts?.Approved || 0}</div>
                     <p className="text-xs text-muted-foreground">Successfully approved student visas</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fees Fully Paid</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{metrics.feeStatusCounts?.Paid || 0}</div>
                    <p className="text-xs text-muted-foreground">Students who have fully paid service fees</p>
                </CardContent>
            </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Students by Preferred Destination</CardTitle>
                    <CardDescription>Distribution of students based on their desired country of study.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studentsByDestination}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="hsl(var(--primary))" name="Student Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Counselor Workload</CardTitle>
                    <CardDescription>Number of students assigned to each counselor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={studentsByCounselor} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {studentsByCounselor.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Visa Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={visaStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                               {visaStatusData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Service Fee Status</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={250}>
                         <BarChart data={feeStatusData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={60} />
                            <Tooltip />
                            <Bar dataKey="value" name="Student Count">
                                {feeStatusData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        </main>
    </div>
  );
}
