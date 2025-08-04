'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function AdminFooter() {
  return (
    <div className="bg-gray-800 text-gray-400 text-xs text-center py-2">
      <div className="container mx-auto">
        <Link href="/admin/login" className="inline-flex items-center gap-1 hover:text-white transition-colors">
          <Lock size={12} />
          Admin Panel
        </Link>
      </div>
    </div>
  );
}
