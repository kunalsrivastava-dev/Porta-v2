'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/leads/DataTable';

export default function InternWorkPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && (user?.role !== 'BDA' && user?.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [authLoading, user, router]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">My Work</h1>
          <p className="text-grey-600 mt-2">Track and update the status of leads assigned to you.</p>
        </div>

        <DataTable type="LEAD" title="Lead Workflow" />
      </div>
    </DashboardLayout>
  );
}
