'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Trash2, Plus, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { dataAPI } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { RecordModal } from './RecordModal';
import { FilterSidebar } from './FilterSidebar';

interface DataRecord {
  _id: string;
  data: Record<string, any>;
  tags: string[];
  status: string;
  uploadedBy: { name: string };
  assignedTo?: { name: string };
  createdAt: string;
}

interface DataTableProps {
  type: 'LEAD' | 'BRAND' | 'INFLUENCER';
  title: string;
}

export const DataTable = ({ type, title }: DataTableProps) => {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | undefined>();
  const [showFilters, setShowFilters] = useState(true);
  
  const { user } = useAuthStore();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await dataAPI.getData({
        type,
        search,
        status: filters.status?.join(','),
        tags: filters.tags?.join(','),
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error(`Failed to fetch ${type}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRecords();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, filters, type]);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };



  const handleExport = () => {
    if (records.length === 0) return;
    const headers = Object.keys(records[0].data).join(',');
    const csv = [
      headers,
      ...records.map(r => Object.values(r.data).map(v => `"${v}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toLowerCase()}_intelligence_export.csv`;
    a.click();
  };

  const dynamicHeaders = type === 'BRAND' 
    ? ['brand_name', 'category', 'revenue', 'city'] 
    : type === 'INFLUENCER' 
      ? ['channel_name', 'category', 'subscribers', 'total_views']
      : ['name', 'email', 'company'];

  return (
    <div className="flex flex-col gap-6">

      <div className="flex gap-6 relative">
        {/* Filter Sidebar */}
        {showFilters && (
          <FilterSidebar 
            type={type} 
            activeFilters={filters} 
            onFilterChange={setFilters} 
          />
        )}

        {/* Table Content */}
        <Card className="flex-1 overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader 
            title={`${records.length} ${title}`} 
            subtitle="Real-time brand intelligence & outreach status"
            action={
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-1" /> Filters
                </Button>
                {selectedIds.length > 0 && user?.role === 'ADMIN' && (
                  <Button size="sm" variant="danger" onClick={() => {}}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete ({selectedIds.length})
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={handleExport}>
                  Export CSV
                </Button>
                <Button size="sm" onClick={() => { setSelectedRecord(undefined); setIsModalOpen(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Add {type}
                </Button>
              </div>
            }
          />
          <CardBody className="p-0">
            <div className="p-4 border-b-4 border-black bg-grey-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
                <input
                  type="text"
                  placeholder={`Search intelligence database...`}
                  className="w-full pl-12 pr-4 py-3 border-4 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-bold"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-[10px] uppercase font-black text-white tracking-widest">
                    <th className="px-6 py-4 w-10 text-center">#</th>
                    {dynamicHeaders.map(header => (
                      <th key={header} className="px-6 py-4">{header.replace('_', ' ')}</th>
                    ))}
                    <th className="px-6 py-4 text-right">Outreach</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={dynamicHeaders.length + 2} className="px-6 py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p className="font-bold uppercase tracking-widest text-xs">Syncing Database...</p>
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={dynamicHeaders.length + 2} className="px-6 py-20 text-center text-grey-500 font-bold uppercase">
                        No matches found in database
                      </td>
                    </tr>
                  ) : (
                    records.map((record, index) => (
                      <React.Fragment key={record._id}>
                        <tr className={`border-b-2 border-grey-100 hover:bg-grey-50 cursor-pointer transition-colors ${expandedId === record._id ? 'bg-grey-50' : ''}`} onClick={() => toggleRow(record._id)}>
                          <td className="px-6 py-4 font-bold text-grey-400">{(index + 1).toString().padStart(2, '0')}</td>
                          {dynamicHeaders.map(header => (
                            <td key={header} className="px-6 py-4 font-black uppercase tracking-tighter text-black">
                              {record.data[header] || '-'}
                            </td>
                          ))}
                          <td className="px-6 py-4 text-right">
                            <Badge variant={record.status === 'completed' ? 'success' : record.status === 'in_progress' ? 'warning' : 'default'}>
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                        {/* Expanded Row */}
                        {expandedId === record._id && (
                          <tr className="bg-white">
                            <td colSpan={dynamicHeaders.length + 2} className="p-6 border-b-4 border-black animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                  <h4 className="text-xs font-black uppercase tracking-widest text-grey-400 border-b border-grey-100 pb-2">Full Details</h4>
                                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                                    {Object.entries(record.data).slice(0, 10).map(([k, v]) => (
                                      <React.Fragment key={k}>
                                        <span className="font-bold text-grey-500 uppercase">{k.replace('_', ' ')}</span>
                                        <span className="font-black text-black">{String(v)}</span>
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="text-xs font-black uppercase tracking-widest text-grey-400 border-b border-grey-100 pb-2">Contacts & Growth</h4>
                                  <div className="space-y-3">
                                    {record.data.marketing_email && (
                                      <div className="flex items-center justify-between text-xs p-2 bg-grey-50 border border-grey-200">
                                        <span className="font-bold">Marketing Email</span>
                                        <button className="flex items-center gap-1 text-black font-black hover:underline">
                                          {record.data.marketing_email} <ExternalLink size={10} />
                                        </button>
                                      </div>
                                    )}
                                    {record.data.revenue && (
                                      <div className="flex items-center justify-between text-xs p-2 bg-black text-white">
                                        <span className="font-bold uppercase tracking-widest">Revenue (Cr)</span>
                                        <span className="font-black text-lg">₹{record.data.revenue}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      <RecordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={type} 
        record={selectedRecord}
        onSuccess={fetchRecords}
      />
    </div>
  );
};
