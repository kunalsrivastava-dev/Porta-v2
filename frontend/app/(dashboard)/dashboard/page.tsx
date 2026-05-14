'use client';

import { useAuthStore } from '@/store/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';



export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

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
              : 'BDA Dashboard'}
          </p>
        </div>

        {/* Access Overview */}
        {user?.permissions && (
          <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-2">Your Access Capabilities</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-grey-500 mb-2">Influencer Data</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-[9px] font-black uppercase ${user.permissions.influencer?.read ? 'bg-black text-white' : 'border-2 border-black text-black'}`}>Read: {user.permissions.influencer?.read ? 'YES' : 'NO'}</span>
                  <span className={`px-2 py-1 text-[9px] font-black uppercase ${user.permissions.influencer?.write ? 'bg-black text-white' : 'border-2 border-black text-black'}`}>Write: {user.permissions.influencer?.write ? 'YES' : 'NO'}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-grey-500 mb-2">Brands/BDE Data</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-[9px] font-black uppercase ${user.permissions.bde?.read ? 'bg-black text-white' : 'border-2 border-black text-black'}`}>Read: {user.permissions.bde?.read ? 'YES' : 'NO'}</span>
                  <span className={`px-2 py-1 text-[9px] font-black uppercase ${user.permissions.bde?.write ? 'bg-black text-white' : 'border-2 border-black text-black'}`}>Write: {user.permissions.bde?.write ? 'YES' : 'NO'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
          {(user?.role === 'ADMIN' || user?.permissions?.bde?.read) && (
            <QuickAction href="/dashboard/brands" label="Brands" desc="Explore brand intelligence" />
          )}
          {(user?.role === 'ADMIN' || user?.permissions?.influencer?.read) && (
            <QuickAction href="/dashboard/influencers" label="Influencers" desc="Influencer discovery" />
          )}
          {user?.role === 'ADMIN' && (
            <QuickAction href="/dashboard/users" label="Users" desc="Manage team access" />
          )}
          {user?.role === 'BDA' && (
            <QuickAction href="/dashboard/work" label="My Work" desc="Track your tasks" />
          )}
          {user?.role === 'DATA_ENTRY' && (
            <QuickAction href="/dashboard/upload" label="Upload Data" desc="Import CSV files" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const QuickAction = ({ href, label, desc }: { href: string; label: string; desc: string }) => (
  <Link
    href={href}
    className="block border-4 border-black p-4 hover:bg-black hover:text-white transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
  >
    <div className="text-sm font-black uppercase tracking-widest">{label}</div>
    <div className="text-xs font-bold opacity-60 mt-1 group-hover:opacity-90">{desc}</div>
  </Link>
);
