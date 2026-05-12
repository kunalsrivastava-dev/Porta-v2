'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import api from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export const LeadVisualization = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/leads/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const COLORS = ['#000000', '#666666', '#999999', '#CCCCCC'];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <Card key={i} className="h-80 flex items-center justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-grey-400" />
          </Card>
        ))}
      </div>
    );
  }

  const pieData = stats?.statusDistribution.map((item: any) => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    value: item.count
  })) || [];

  const barData = stats?.timeline.map((item: any) => ({
    date: item._id,
    count: item.count
  })) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Lead Distribution" subtitle="By Status" />
        <CardBody className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Upload Activity" subtitle="Last 30 Days" />
        <CardBody className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="date" tick={{fontSize: 10}} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};
