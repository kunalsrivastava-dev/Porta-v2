'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { adminAPI } from '@/lib/api/endpoints';
import { formatDate } from '@/lib/utils/helpers';
import { Loader2, Search } from 'lucide-react';

interface AccessRequest { _id: string; email: string; status: string; requestedAt: string; }

export default function RequestsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roles, setRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') router.push('/dashboard');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    adminAPI.getAllRequests(1, 100)
      .then(r => setRequests(r.data.data.requests || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  const filtered = requests.filter(r => r.email.toLowerCase().includes(search.toLowerCase()));
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const approve = async (id: string) => {
    await adminAPI.approveRequest(id, roles[id] || 'INTERN').catch(console.error);
    setRequests(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x));
  };

  const reject = async (id: string) => {
    await adminAPI.rejectRequest(id, 'Rejected by admin').catch(console.error);
    setRequests(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Requests</h1>
            <p className="text-[11px] font-bold text-grey-500 uppercase tracking-widest mt-0.5">
              {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email..."
              className="pl-9 pr-4 py-2 border-4 border-black text-xs font-bold uppercase tracking-wider outline-none w-48 md:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border-4 border-black flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-[1.5fr_80px_100px_130px_180px] bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5 shrink-0">
            <span>Email</span><span>Status</span><span>Assign Role</span><span>Requested</span><span className="text-right">Actions</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full gap-2 font-black uppercase text-sm">
                <Loader2 className="animate-spin w-5 h-5" /> Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full font-black uppercase text-grey-400 text-sm">No requests</div>
            ) : filtered.map(req => (
              <div key={req._id} className="grid grid-cols-[1.5fr_80px_100px_130px_180px] px-4 py-3 border-b-2 border-grey-100 items-center hover:bg-grey-50 text-xs">
                <span className="font-black truncate">{req.email}</span>
                <span>
                  <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}>
                    {req.status}
                  </Badge>
                </span>
                <span>
                  {req.status === 'pending' ? (
                    <select
                      className="border-2 border-black px-2 py-1 text-[10px] font-black uppercase outline-none bg-white"
                      value={roles[req._id] || 'INTERN'}
                      onChange={e => setRoles(r => ({ ...r, [req._id]: e.target.value }))}
                    >
                      <option value="INTERN">Intern</option>
                      <option value="DATA_ENTRY">Data Entry</option>
                    </select>
                  ) : <span className="text-grey-400">—</span>}
                </span>
                <span className="text-grey-500 font-medium text-[10px]">{req.requestedAt ? formatDate(req.requestedAt) : '—'}</span>
                <div className="flex gap-1 justify-end">
                  {req.status === 'pending' ? (
                    <>
                      <Button size="sm" onClick={() => approve(req._id)}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => reject(req._id)}>Reject</Button>
                    </>
                  ) : <span className="text-grey-400">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
