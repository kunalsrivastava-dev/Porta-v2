'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/leads/DataTable';

export default function BrandsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        <div className="shrink-0">
          <h1 className="text-2xl font-black text-black uppercase tracking-tighter">Brands</h1>
          <p className="text-[11px] font-bold text-grey-500 uppercase tracking-widest mt-0.5">Intelligence database</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <DataTable type="BRAND" title="Brand Ecosystem" />
        </div>
      </div>
    </DashboardLayout>
  );
}
