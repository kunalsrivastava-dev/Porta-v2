'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { userAPI } from '@/lib/api/endpoints';
import { Loader2, Users, UserCog, UserCheck, ShieldCheck, BarChart3 } from 'lucide-react';

interface Stats {
  totalUsers: number;
  adminCount: number;
  dataEntryCount: number;
  internCount: number;
  activeUsers: number;
}

const StatCard = ({ title, value, sub, icon, inverted = false }: any) => (
  <div className={`flex flex-col justify-between border-4 border-black p-4 ${inverted ? 'bg-black text-white' : 'bg-white text-black'} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</span>
      <div className={`p-1.5 border-2 ${inverted ? 'border-white' : 'border-black'}`}>
        {icon}
      </div>
    </div>
    <div className="text-4xl font-black tracking-tighter">{value}</div>
    {sub && <p className="text-[10px] uppercase font-bold opacity-60 mt-1">{sub}</p>}
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { setIsLoading(false); return; }
    userAPI.getDashboardStats()
      .then(r => setStats(r.data.stats))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

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

        {/* Admin Stats */}
        {user?.role === 'ADMIN' && (
          isLoading ? (
            <div className="flex items-center gap-3 text-sm font-bold uppercase">
              <Loader2 className="animate-spin w-4 h-4" /> Loading stats...
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
              <StatCard title="Total Users" value={stats.totalUsers} sub="Registered" icon={<Users size={14} />} inverted />
              <StatCard title="Admins" value={stats.adminCount} sub="Administrators" icon={<ShieldCheck size={14} />} />
              <StatCard title="Data Entry" value={stats.dataEntryCount} sub="Operators" icon={<UserCog size={14} />} />
              <StatCard title="Interns" value={stats.internCount} sub="Team members" icon={<UserCheck size={14} />} />
              <StatCard title="Active" value={stats.activeUsers} sub="This period" icon={<BarChart3 size={14} />} />
            </div>
          ) : null
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
          {user?.role === 'ADMIN' && (
            <>
              <QuickAction href="/dashboard/brands" label="Brands" desc="Manage brand intelligence" />
              <QuickAction href="/dashboard/influencers" label="Influencers" desc="Influencer discovery" />
              <QuickAction href="/dashboard/users" label="Users" desc="Manage team access" />
              <QuickAction href="/dashboard/requests" label="Requests" desc="Pending access approvals" />
              <QuickAction href="/dashboard/monitoring" label="Monitoring" desc="Activity logs & audit" />
              <QuickAction href="/dashboard/data" label="Leads" desc="Lead management" />
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
              <QuickAction href="/dashboard/upload" label="Upload Data" desc="Import CSV files" />
              <QuickAction href="/dashboard/data" label="View Data" desc="Browse all records" />
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
