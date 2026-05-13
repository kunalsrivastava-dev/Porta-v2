'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { CSVUpload } from '@/components/leads/CSVUpload';

export default function DataEntryUploadPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeType, setActiveType] = useState<'BRAND' | 'INFLUENCER'>('BRAND');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">Upload Data</h1>
          <p className="text-grey-600 mt-2">Import CSV files for leads, brands, or influencers.</p>
        </div>

        <div className="flex gap-2 p-1 bg-grey-100 rounded-lg w-fit">
          {(['BRAND', 'INFLUENCER'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-6 py-2 rounded-md text-xs font-bold transition-all ${
                activeType === type
                  ? 'bg-black text-white shadow-lg'
                  : 'text-grey-600 hover:text-black'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <CSVUpload type={activeType} />

        <Card>
          <CardHeader title="CSV Instructions" />
          <CardBody>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-black mb-2 uppercase text-xs">General Rules</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-grey-600 font-medium">
                  <li>Upload only .csv files.</li>
                  <li>The first row must contain column names.</li>
                  <li>Max file size: 10MB.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-black mb-2 uppercase text-xs">Mapping</h4>
                <p className="text-xs text-grey-600 font-medium leading-relaxed">
                  The system automatically detects columns. For **Brands**, include columns like 
                  *Brand, Category, Founder, Marketing Mail Id*. For **Influencers**, include 
                  *Channel Name, Emails, Subscribers*.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
