'use client';

import { DataTable } from '@/components/admin/data-table';
import AdminHeader from '@/components/admin/header';

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <AdminHeader />
        <DataTable />
      </main>
    </div>
  );
}
