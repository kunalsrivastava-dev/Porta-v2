'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { adminAPI } from '@/lib/api/endpoints';
import { Loader2, TrendingUp, Users, Target, Zap } from 'lucide-react';

interface AnalyticsProps {
  type: string;
}

const COLORS = ['#000000', '#404040', '#808080', '#BFBFBF', '#E5E5E5'];

export const IntelligenceAnalytics = ({ type }: AnalyticsProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getIntelligenceStats({ type });
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch intelligence stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [type]);

  if (loading) return (
    <div className="h-64 flex items-center justify-center bg-grey-50 border-4 border-black border-dashed">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard 
          title={type === 'BRAND' ? "High Opportunity" : "Mega Influencers"} 
          value={data.tags.find((t: any) => t._id === (type === 'BRAND' ? 'High Opportunity' : 'Mega Influencer'))?.count || 0} 
          icon={<Target />} 
          color="bg-black text-white" 
        />
        <KpiCard 
          title={type === 'BRAND' ? "Scaling Fast" : "Viral Potential"} 
          value={data.tags.find((t: any) => t._id === (type === 'BRAND' ? 'Scaling Fast' : 'Viral Potential'))?.count || 0} 
          icon={<TrendingUp />} 
        />
        <KpiCard 
          title="Top Segment" 
          value={data.categories[0]?._id || 'N/A'} 
          subValue={`${data.categories[0]?.count || 0} ${type.toLowerCase()}s`} 
          icon={<Zap />} 
        />
        <KpiCard 
          title={`Total ${type.toLowerCase()}s`} 
          value={data.categories.reduce((acc: number, c: any) => acc + c.count, 0)} 
          icon={<Users />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="h-[350px]">
          <CardHeader title="Top Segments" subtitle={`Distribution by ${type === 'BRAND' ? 'industry' : 'content'} segment`} />
          <CardBody className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="_id" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Opportunity Distribution */}
        <Card className="h-[350px]">
          <CardHeader title="Opportunity Intelligence" subtitle="System-generated potential tags" />
          <CardBody className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.tags}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {data.tags.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 pr-8">
              {data.tags.slice(0, 4).map((tag: any, index: number) => (
                <div key={tag._id} className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-black" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] font-bold uppercase">{tag._id}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, subValue, icon, color = "bg-white" }: any) => (
  <div className={`${color} border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 border-2 border-current rounded-none">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
    </div>
    <div className="text-3xl font-black tracking-tighter">{value}</div>
    {subValue && <div className="text-[10px] uppercase font-bold opacity-70 mt-1">{subValue}</div>}
  </div>
);
