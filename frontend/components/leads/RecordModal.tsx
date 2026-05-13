'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { dataAPI } from '@/lib/api/endpoints';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'LEAD' | 'BRAND' | 'INFLUENCER';
  record?: any; // If provided, we are viewing/editing
  onSuccess: () => void;
}

export const RecordModal = ({ isOpen, onClose, type, record, onSuccess }: RecordModalProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData(record.data || {});
    } else {
      setFormData({});
    }
  }, [record, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (record) {
        await dataAPI.updateData(record._id, { data: formData });
      } else {
        await dataAPI.createRecord(type, formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Operation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const OUTREACH_STATUSES = [
    'NEW', 'CONTACTED', 'ATTEMPTED_CONTACT', 'FOLLOW_UP_PENDING', 'REPLIED', 
    'INTERESTED', 'QUALIFIED', 'UNQUALIFIED', 'NEGOTIATION', 'PROPOSAL_SENT', 
    'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'ONBOARDING', 'CLOSED_WON', 'CLOSED_LOST', 
    'NO_RESPONSE', 'INVALID_CONTACT', 'BLOCKED', 'DO_NOT_CONTACT', 'FUTURE_POTENTIAL'
  ];

  const brandFields = [
    'brand_name', 'category', 'founded_year', 'brand_focus', 'founder', 
    'marketing_head', 'marketing_email', 'sales_head', 'sales_email', 
    'content_marketing_head', 'content_marketing_head_email', 'company_phone', 'linkedin',
    'revenue_cr', 'revenue_year', 'last_funding_amount', 'last_funding_round_data', 'last_funding_date',
    'influencer_marketing_outreach', 'existing_tool', 'city', 'extra_points', 'main_geography_outreach',
    'employees', 'main_influencer_platform', 'events_participated', 'feedback', 'script_for_email', 'business_case_study', 'outreach_status'
  ];

  const influencerFields = [
    'channel_name', 'channel_id', 'channel_url', 'category', 'keyword', 
    'subscribers', 'subscribers_fmt', 'total_views', 'total_videos', 
    'emails', 'phone_numbers', 'has_email', 'has_phone', 'country', 'outreach_status'
  ];

  const leadFields = ['name', 'email', 'phone', 'company', 'outreach_status'];

  const fields = type === 'BRAND' ? brandFields : type === 'INFLUENCER' ? influencerFields : leadFields;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl my-8 animate-in zoom-in duration-200 h-fit max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-black text-white shrink-0">
          <h2 className="text-xl font-bold uppercase tracking-tighter">
            {record ? `View/Edit ${type}` : `Add New ${type}`}
          </h2>
          <button type="button" onClick={onClose} className="hover:rotate-90 transition-transform">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map(field => (
              <div key={field}>
                <label className="block text-xs font-bold uppercase text-grey-600 mb-1">{field.replace(/_/g, ' ')}</label>
                {field === 'outreach_status' ? (
                  <select
                    className="w-full border-2 border-grey-200 px-3 py-2 outline-none focus:border-black font-medium bg-white"
                    value={formData[field] || 'NEW'}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                  >
                    <option value="" disabled>Select Status</option>
                    {OUTREACH_STATUSES.map(status => (
                      <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full border-2 border-grey-200 px-3 py-2 outline-none focus:border-black font-medium"
                    value={formData[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={`Enter ${field.replace(/_/g, ' ')}...`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Extra Fields */}
          {record && Object.entries(record.data).filter(([k]) => !fields.includes(k)).length > 0 && (
            <div className="mt-6 border-t-2 border-grey-100 pt-4">
              <h3 className="text-xs font-bold uppercase text-grey-400 mb-3">Additional Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(record.data).filter(([k]) => !fields.includes(k)).map(([k, v]) => (
                  <div key={k}>
                    <label className="block text-xs font-bold uppercase text-grey-600 mb-1">{k}</label>
                    <input
                      type="text"
                      className="w-full border-2 border-grey-200 px-3 py-2 outline-none focus:border-black bg-grey-50"
                      value={String(v)}
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : record ? 'Update Record' : 'Create Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
