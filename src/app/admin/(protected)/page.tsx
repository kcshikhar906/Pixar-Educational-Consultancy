
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionTitle from '@/components/ui/section-title';
import { BarChart } from 'lucide-react';

export default function AdminAnalyticsPage() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
         <SectionTitle title="Analytics Dashboard" subtitle="An overview of your consultancy's performance and student data." />
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BarChart className="mr-2 h-6 w-6" />
                        Dashboard Coming Soon
                    </CardTitle>
                    <CardDescription>
                        Our new and improved analytics dashboard is currently under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>We are working on a more efficient dashboard to provide you with valuable insights without impacting performance. This feature will be available shortly.</p>
                    <p className="mt-4">In the meantime, please use the **Student Management** page to view and manage all student records.</p>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
