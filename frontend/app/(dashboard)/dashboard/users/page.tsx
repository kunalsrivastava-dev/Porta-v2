'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { userAPI } from '@/lib/api/endpoints';
import { Loader2, Search } from 'lucide-react';

interface User { _id: string; name: string; email: string; role: string; isActive: boolean; createdAt: string; }

export default function UsersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    userAPI.getAllUsers(1, 100)
      .then(r => setUsers(r.data.data.users))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (id: string, current: boolean) => {
    await userAPI.toggleUserStatus(id, !current).catch(console.error);
    setUsers(u => u.map(x => x._id === id ? { ...x, isActive: !current } : x));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await userAPI.deleteUser(id).catch(console.error);
    setUsers(u => u.filter(x => x._id !== id));
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Users</h1>
          <p className="text-[11px] font-bold uppercase text-grey-500 tracking-widest">{users.length} registered</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-4 py-2 border-4 border-black text-xs font-bold uppercase tracking-wider outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-48 md:w-64"
          />
        </div>
      </div>

      {/* Table fills remaining space */}
      <div className="border-4 border-black flex flex-col overflow-hidden" style={{ height: 'calc(100% - 72px)' }}>
        <div className="grid grid-cols-[1fr_1.5fr_80px_70px_160px] bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 shrink-0">
          <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span className="text-right">Actions</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full gap-2 font-black uppercase text-sm">
              <Loader2 className="animate-spin w-5 h-5" /> Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full font-black uppercase text-grey-400 text-sm">No users found</div>
          ) : filtered.map(u => (
            <div key={u._id} className="grid grid-cols-[1fr_1.5fr_80px_70px_160px] px-4 py-3 border-b-2 border-grey-100 items-center hover:bg-grey-50 text-xs">
              <span className="font-black truncate">{u.name}</span>
              <span className="text-grey-600 truncate font-medium">{u.email}</span>
              <span><Badge>{u.role}</Badge></span>
              <span><Badge variant={u.isActive ? 'success' : 'error'}>{u.isActive ? 'On' : 'Off'}</Badge></span>
              <div className="flex gap-1 justify-end">
                <Button size="sm" variant="outline" onClick={() => handleToggle(u._id, u.isActive)}>
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(u._id)}>Del</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
