'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/leads/DataTable';

export default function LeadsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'DATA_ENTRY')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        <div className="shrink-0">
          <h1 className="text-2xl font-black text-black uppercase tracking-tighter">Leads</h1>
          <p className="text-[11px] font-bold text-grey-500 uppercase tracking-widest mt-0.5">Outreach pipeline</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <DataTable type="LEAD" title="Lead Management" />
        </div>
      </div>
    </DashboardLayout>
  );
}
