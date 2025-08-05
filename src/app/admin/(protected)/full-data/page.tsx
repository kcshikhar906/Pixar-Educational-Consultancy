
'use client';

import { FullDataTable } from '@/components/admin/full-data-table';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';

export default function FullDataPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <SectionTitle 
        title="Full Student Data"
        subtitle="View all records and columns from the student database. This table is read-only."
      />
      <Card>
        <CardContent className="p-0">
          <FullDataTable />
        </CardContent>
      </Card>
    </div>
  );
}
