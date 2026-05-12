'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { userAPI, adminAPI } from '@/lib/api/endpoints';
import { Loader2, Search, UserPlus, Mail, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface User { _id: string; name: string; email: string; role: string; isActive: boolean; createdAt: string; }
interface Invitation { _id: string; email: string; assignedRole: string; status: string; createdAt: string; }

export default function UsersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'DATA_ENTRY' | 'INTERN'>('INTERN');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users') {
        const r = await userAPI.getAllUsers(1, 100);
        setUsers(r.data.data.users);
      } else {
        const r = await adminAPI.getAllRequests(1, 100);
        // Filter only approved ones as they are the "Invitations"
        setInvitations(r.data.data.requests.filter((req: any) => req.status === 'approved'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchData();
  }, [user, activeTab]);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredInvitations = invitations.filter(i =>
    i.email.toLowerCase().includes(search.toLowerCase())
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

  const handleRevoke = async (email: string) => {
    if (!confirm(`Revoke access for ${email}?`)) return;
    try {
      await adminAPI.revokeAccess(email);
      setInvitations(prev => prev.filter(i => i.email !== email));
      // If user exists, they will be deactivated via backend logic
      if (activeTab === 'users') fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      await adminAPI.inviteUser(inviteEmail, inviteRole);
      setShowInviteModal(false);
      setInviteEmail('');
      if (activeTab === 'invitations') fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to invite user');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex items-end justify-between mb-6 shrink-0">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Identity Control</h1>
            <p className="text-[10px] font-black uppercase text-grey-400 tracking-[0.2em]">User & Access Management Console</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all ${activeTab === 'users' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-grey-50'}`}
            >
              Registered Users ({users.length})
            </button>
            <button 
              onClick={() => setActiveTab('invitations')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all ${activeTab === 'invitations' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-grey-50'}`}
            >
              Approved Emails ({invitations.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search database..."
              className="pl-9 pr-4 py-3 border-4 border-black text-[10px] font-black uppercase tracking-wider outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-48 md:w-64 transition-all"
            />
          </div>
          <Button 
            className="h-12 bg-black text-white px-6 rounded-none text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus size={14} className="mr-2" /> Invite User
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="border-4 border-black flex flex-col bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ height: 'calc(100% - 140px)' }}>
        {activeTab === 'users' ? (
          <>
            <div className="grid grid-cols-[1.5fr_2fr_100px_100px_200px] bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 shrink-0">
              <span>Identity</span><span>Email</span><span>Role</span><span>Status</span><span className="text-right">Management</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full gap-2 font-black uppercase text-xs">
                  <Loader2 className="animate-spin w-5 h-5" /> Syncing with grid...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center h-full font-black uppercase text-grey-400 text-xs">No active identities found</div>
              ) : filteredUsers.map(u => (
                <div key={u._id} className="grid grid-cols-[1.5fr_2fr_100px_100px_200px] px-6 py-4 border-b-2 border-grey-100 items-center hover:bg-grey-50 text-[11px] group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs uppercase">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-black uppercase truncate">{u.name}</span>
                  </div>
                  <span className="text-grey-600 truncate font-bold">{u.email}</span>
                  <span><Badge className="rounded-none border-black font-black">{u.role}</Badge></span>
                  <span><Badge variant={u.isActive ? 'success' : 'error'} className="rounded-none font-black">{u.isActive ? 'ACTIVE' : 'LOCKED'}</Badge></span>
                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="text-[9px] font-black h-8 rounded-none border-2 border-black" onClick={() => handleToggle(u._id, u.isActive)}>
                      {u.isActive ? 'LOCK' : 'UNLOCK'}
                    </Button>
                    <Button size="sm" variant="danger" className="text-[9px] font-black h-8 rounded-none border-2 border-black" onClick={() => handleDelete(u._id)}>DELETE</Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-[2fr_1fr_1.5fr_150px] bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 shrink-0">
              <span>Approved Email</span><span>Assigned Role</span><span>Approved Date</span><span className="text-right">Management</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full gap-2 font-black uppercase text-xs">
                  <Loader2 className="animate-spin w-5 h-5" /> Scanning approved list...
                </div>
              ) : filteredInvitations.length === 0 ? (
                <div className="flex items-center justify-center h-full font-black uppercase text-grey-400 text-xs">No pending invitations</div>
              ) : filteredInvitations.map(i => (
                <div key={i._id} className="grid grid-cols-[2fr_1fr_1.5fr_150px] px-6 py-4 border-b-2 border-grey-100 items-center hover:bg-grey-50 text-[11px] group transition-colors">
                  <span className="font-black text-black flex items-center gap-2">
                    <Mail size={14} className="text-grey-400" /> {i.email}
                  </span>
                  <span><Badge className="rounded-none border-black font-black">{i.assignedRole}</Badge></span>
                  <span className="text-grey-500 font-bold uppercase tracking-tight">{new Date(i.createdAt).toLocaleDateString()}</span>
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="danger" className="text-[9px] font-black h-8 rounded-none border-2 border-black" onClick={() => handleRevoke(i.email)}>REVOKE ACCESS</Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-grey-400 hover:text-black transition-colors"
            >
              <XCircle size={24} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-3xl font-black uppercase tracking-tight">Authorize Identity</h2>
              <p className="text-[10px] font-bold text-grey-500 uppercase tracking-widest mt-1">Add email to approved whitelist</p>
            </div>

            <form onSubmit={handleInvite} className="space-y-6">
              <Input
                label="Identity Email"
                type="email"
                placeholder="name@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
                className="h-14 border-4 border-black font-black uppercase text-xs tracking-wider"
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-grey-400">Security Clearance (Role)</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteRole('DATA_ENTRY')}
                    className={`h-12 border-4 border-black text-[10px] font-black uppercase tracking-widest transition-all ${inviteRole === 'DATA_ENTRY' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black'}`}
                  >
                    Data Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteRole('INTERN')}
                    className={`h-12 border-4 border-black text-[10px] font-black uppercase tracking-widest transition-all ${inviteRole === 'INTERN' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black'}`}
                  >
                    Intern
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-16 bg-black text-white text-xs font-black uppercase tracking-widest rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  isLoading={isInviting}
                >
                  Confirm Authorization
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
