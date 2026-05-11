'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Check, ArrowRight } from 'lucide-react';

interface ColumnMapperProps {
  headers: string[];
  type: 'LEAD' | 'BRAND' | 'INFLUENCER';
  onConfirm: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

const BRAND_FIELDS = [
  'brand_name', 'category', 'founded_year', 'brand_focus', 'founder', 
  'marketing_head', 'marketing_email', 'sales_head', 'sales_email', 
  'content_marketing_head', 'content_marketing_email', 'company_phone', 
  'linkedin', 'instagram', 'youtube', 'twitter', 'revenue', 'funding_amount', 
  'outreach_status', 'city', 'employees'
];

const INFLUENCER_FIELDS = [
  'channel_name', 'has_email', 'has_phone', 'emails', 'phones', 
  'category', 'subscribers', 'total_views', 'total_videos'
];

export const ColumnMapper = ({ headers, type, onConfirm, onCancel }: ColumnMapperProps) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  const targetFields = type === 'BRAND' ? BRAND_FIELDS : 
                      type === 'INFLUENCER' ? INFLUENCER_FIELDS : 
                      headers.map(h => h.toLowerCase().replace(/\s+/g, '_'));

  useEffect(() => {
    // Auto-map based on similarity
    const initialMapping: Record<string, string> = {};
    headers.forEach(header => {
      const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = targetFields.find(field => 
        field.replace(/[^a-z0-9]/g, '').includes(normalized) || 
        normalized.includes(field.replace(/[^a-z0-9]/g, ''))
      );
      if (match) initialMapping[header] = match;
    });
    setMapping(initialMapping);
  }, [headers, type, targetFields]);

  const handleMapChange = (csvHeader: string, targetField: string) => {
    setMapping(prev => ({ ...prev, [csvHeader]: targetField }));
  };

  return (
    <Card className="animate-in fade-in zoom-in duration-300">
      <CardHeader title="Map CSV Columns" subtitle={`Match your CSV headers to system fields for ${type}`} />
      <CardBody>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {headers.map(header => (
            <div key={header} className="flex items-center gap-4 p-3 bg-grey-50 rounded-lg border border-grey-200">
              <div className="flex-1">
                <p className="text-xs font-bold text-grey-500 uppercase">CSV Header</p>
                <p className="font-medium text-black">{header}</p>
              </div>
              <ArrowRight className="text-grey-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-grey-500 uppercase">System Field</p>
                <select 
                  className="w-full bg-white border border-grey-300 rounded px-2 py-1 text-sm outline-none focus:border-black"
                  value={mapping[header] || ''}
                  onChange={(e) => handleMapChange(header, e.target.value)}
                >
                  <option value="">Skip Column</option>
                  {targetFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                  <option value="custom">Custom: {header.toLowerCase().replace(/\s+/g, '_')}</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-grey-100">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onConfirm(mapping)}>
            <Check className="w-4 h-4 mr-2" />
            Finalize & Upload
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
