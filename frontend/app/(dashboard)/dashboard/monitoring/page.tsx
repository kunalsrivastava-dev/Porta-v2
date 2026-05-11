'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { adminAPI } from '@/lib/api/endpoints';
import { formatDate } from '@/lib/utils/helpers';
import { Loader2, RefreshCw } from 'lucide-react';

interface Log {
  _id: string; action: string; resource: string; timestamp: string;
  user: { name: string; email: string; role: string; }; details?: any;
}

export default function MonitoringPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const fetchLogs = () => {
    setIsLoading(true);
    adminAPI.getMonitoringLogs(1, 100)
      .then(r => setLogs(r.data.data.logs || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { if (user?.role === 'ADMIN') fetchLogs(); }, [user]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Monitoring</h1>
            <p className="text-[11px] font-bold text-grey-500 uppercase tracking-widest mt-0.5">{logs.length} activity events</p>
          </div>
          <button onClick={fetchLogs} className="p-2 border-4 border-black hover:bg-black hover:text-white transition-all" title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Log table */}
        <div className="border-4 border-black flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1.5fr_1fr_80px_130px] bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5 shrink-0">
            <span>User</span><span>Action</span><span>Resource</span><span>Role</span><span>Time</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full gap-2 font-black uppercase text-sm">
                <Loader2 className="animate-spin w-5 h-5" /> Loading logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="flex items-center justify-center h-full font-black uppercase text-grey-400 text-sm">No activity yet</div>
            ) : logs.map(log => (
              <div key={log._id} className="grid grid-cols-[1.2fr_1.5fr_1fr_80px_130px] px-4 py-2.5 border-b-2 border-grey-100 items-center hover:bg-grey-50 text-xs">
                <span className="font-black truncate">{log.user?.name || 'System'}</span>
                <span className="font-mono text-[10px] uppercase font-black tracking-wider truncate">{log.action}</span>
                <span className="text-grey-600 truncate font-medium">{log.resource}</span>
                <span><Badge>{log.user?.role || '—'}</Badge></span>
                <span className="text-grey-500 font-medium text-[10px]">{log.timestamp ? formatDate(log.timestamp) : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
