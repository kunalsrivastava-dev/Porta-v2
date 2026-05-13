'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function ActivityLogsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [authLoading, user, router]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Activity Logs</h1>
          <p className="text-grey-600 mt-2">System activity and user actions</p>
        </div>

        <Card>
          <CardHeader title="Recent Activity" />
          <CardBody>
            <div className="space-y-4">
              <div className="border-l-2 border-grey-300 pl-4 py-2">
                <p className="text-sm font-medium text-black">System Initialized</p>
                <p className="text-xs text-grey-600">Admin users created from admins.txt</p>
              </div>
              <div className="border-l-2 border-grey-300 pl-4 py-2">
                <p className="text-sm font-medium text-black">Welcome to PORTA</p>
                <p className="text-xs text-grey-600">Portal is ready to use</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
