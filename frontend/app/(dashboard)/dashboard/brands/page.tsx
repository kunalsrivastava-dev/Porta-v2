'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/leads/DataTable';
import { useAuthStore } from '@/store/authStore';

export default function BrandsPage() {
  const { user } = useAuthStore();

  if (user && user.role !== 'ADMIN' && !user.permissions?.bde?.read) {
    return (
      <DashboardLayout>
        <div className="flex flex-col h-full items-center justify-center">
          <h1 className="text-2xl font-black uppercase text-red-500 tracking-tighter">Not authorized to do this</h1>
          <p className="text-xs font-bold text-grey-500 uppercase mt-2">You lack the necessary security clearance.</p>
        </div>
      </DashboardLayout>
    );
  }

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
