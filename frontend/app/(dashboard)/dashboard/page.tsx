'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';



export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    </DashboardLayout>
  );

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="shrink-0">
          <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter leading-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-grey-500 text-sm font-bold uppercase tracking-widest mt-1">
            {user?.role === 'ADMIN' ? 'System Administrator'
              : user?.role === 'DATA_ENTRY' ? 'Data Entry Operator'
              : 'Intern Dashboard'}
          </p>
        </div>

        {/* Admin Section Removed Stats */}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
          {user?.role === 'ADMIN' && (
            <>
              <QuickAction href="/dashboard/brands" label="Brands" desc="Manage brand intelligence" />
              <QuickAction href="/dashboard/influencers" label="Influencers" desc="Influencer discovery" />
              <QuickAction href="/dashboard/users" label="Users" desc="Manage team access" />
              <QuickAction href="/dashboard/requests" label="Requests" desc="Pending access approvals" />
              <QuickAction href="/dashboard/monitoring" label="Monitoring" desc="Activity logs & audit" />
            </>
          )}
          {user?.role === 'INTERN' && (
            <>
              <QuickAction href="/dashboard/brands" label="Brands" desc="Explore brand data" />
              <QuickAction href="/dashboard/influencers" label="Influencers" desc="Influencer discovery" />
              <QuickAction href="/dashboard/work" label="My Work" desc="Track your tasks" />
            </>
          )}
          {user?.role === 'DATA_ENTRY' && (
            <>
              <QuickAction href="/dashboard/brands" label="Brands" desc="Brand intelligence ecosystem" />
              <QuickAction href="/dashboard/influencers" label="Influencers" desc="Influencer discovery database" />
              <QuickAction href="/dashboard/upload" label="Upload Data" desc="Import CSV files" />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const QuickAction = ({ href, label, desc }: { href: string; label: string; desc: string }) => (
  <a
    href={href}
    className="block border-4 border-black p-4 hover:bg-black hover:text-white transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
  >
    <div className="text-sm font-black uppercase tracking-widest">{label}</div>
    <div className="text-xs font-bold opacity-60 mt-1 group-hover:opacity-90">{desc}</div>
  </a>
);
