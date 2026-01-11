'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Calendar, CheckCircle, Clock, Globe, Loader2, Users, ShieldAlert, LineChart, PieChart as PieChartIcon, DollarSign, GraduationCap, Languages, FileCheck, FileX, CircleDollarSign, Activity, ArrowUpRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { Student } from '@/lib/data';
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

// Define colors for the charts - Professional Palette
const PIE_CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const BAR_CHART_COLOR_PRIMARY = '#0f172a'; // Slate 900
const BAR_CHART_COLOR_SECONDARY = '#64748b'; // Slate 500

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string; // We'll keep this for compatibility but might override styles
  description?: string;
  iconClassName?: string;
  trend?: string;
}

const StatCard = ({ title, value, icon: Icon, className, description, iconClassName }: StatCardProps) => (
  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2">
      <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{title}</CardTitle>
      <div className={cn("p-2 rounded-xl bg-slate-100 dark:bg-slate-800", iconClassName)}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent className="p-5 pt-2">
      <div className="flex items-baseline space-x-2">
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{value}</div>
      </div>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur px-3 py-2 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 text-xs">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        .sort((a, b) => (b[valueKey] as number) - (a[valueKey] as number));
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
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/50">
        <Loader2 className="h-10 w-10 animate-spin text-slate-800 dark:text-slate-200 mb-4" />
        <p className="text-sm text-slate-500 font-medium animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-10 bg-slate-50/30 min-h-screen">
        {error === 'permission-denied' ? (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Missing permissions to view dashboard metrics. Please check your Firestore security rules.
            </AlertDescription>
          </Alert>
        ) : error === 'no-summary-doc' ? (
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <LineChart className="h-4 w-4 text-amber-600" />
            <AlertTitle>Setup Required</AlertTitle>
            <AlertDescription>
              Dashboard data initialization needed. Run `npx tsx scripts/aggregate-stats.ts`.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>System Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col space-y-8 p-6 md:px-8 md:py-10 bg-slate-50/30 dark:bg-slate-950 min-h-screen font-sans">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of student admissions, visas, and performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Last updated {lastUpdated ? formatDistanceToNow(lastUpdated, { addSuffix: true }) : 'just now'}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Visas Approved"
          value={stats?.visaStatusCounts?.Approved || 0}
          icon={FileCheck}
          iconClassName="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Visas Pending"
          value={stats?.visaStatusCounts?.Pending || 0}
          icon={Clock}
          iconClassName="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Visas Rejected"
          value={stats?.visaStatusCounts?.Rejected || 0}
          icon={FileX}
          iconClassName="bg-red-100 text-red-600"
        />
        <StatCard
          title="Fees Paid"
          value={stats?.serviceFeeStatusCounts?.Paid || 0}
          icon={CircleDollarSign}
          iconClassName="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Unpaid/Pending"
          value={stats?.serviceFeeStatusCounts?.Unpaid || 0}
          icon={DollarSign}
          iconClassName="bg-slate-100 text-slate-600"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Monthly Admissions Chart */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-slate-500" />
              Monthly Registrations
            </CardTitle>
            <CardDescription>New student enrollment trends over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dataMappers.monthlyAdmissionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748B"
                  tickMargin={10}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  stroke="#64748B"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Bar
                  dataKey="students"
                  fill="#0F172A"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  name="Students"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visa Status Distribution */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-5 w-5 text-slate-500" />
              Visa Status
            </CardTitle>
            <CardDescription>Current distribution of visa applications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={dataMappers.visaStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {dataMappers.visaStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 dark:text-slate-400 text-sm ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* English Proficiency */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Languages className="h-5 w-5 text-slate-500" />
              English Proficiency
            </CardTitle>
            <CardDescription>Test types taken by students</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={dataMappers.englishTestData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => percent > 0.05 ? `${name}` : ''}
                  labelLine={false}
                >
                  {dataMappers.englishTestData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} opacity={0.8} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Counselor Stats */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-slate-500" />
              Counselor Portfolio
            </CardTitle>
            <CardDescription>Students assigned per counselor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dataMappers.counselorData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" fontSize={12} allowDecimals={false} stroke="#64748B" axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  fontSize={12}
                  width={100}
                  stroke="#64748B"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Bar
                  dataKey="students"
                  fill="#64748B"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  name="Assigned Students"
                >
                  {/* Gradient effect if desired, or simpler solid color */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Destination Distribution */}
        <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-slate-500" />
              Target Destinations
            </CardTitle>
            <CardDescription>Preferred countries for study</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataMappers.destinationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" fontSize={12} stroke="#64748B" axisLine={false} tickLine={false} />
                <YAxis fontSize={12} allowDecimals={false} stroke="#64748B" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Education Levels */}
        <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-slate-500" />
              Education Background
            </CardTitle>
            <CardDescription>Previous qualifications of applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataMappers.educationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" fontSize={11} stroke="#64748B" axisLine={false} tickLine={false} interval={0} />
                <YAxis fontSize={12} allowDecimals={false} stroke="#64748B" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="students" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}