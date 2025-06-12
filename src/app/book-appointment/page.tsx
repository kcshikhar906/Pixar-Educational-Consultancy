
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';

export default function AppointmentBookingPage() {
  return (
    <div className="space-y-12">
      <SectionTitle
        title="Book Your Appointment"
        subtitle="Plan your session with our expert advisors."
      />
      <Card className="max-w-2xl mx-auto shadow-xl bg-card">
        <CardContent className="p-10 text-center">
          <p className="text-lg text-muted-foreground">
            This feature is currently being updated. Please check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
