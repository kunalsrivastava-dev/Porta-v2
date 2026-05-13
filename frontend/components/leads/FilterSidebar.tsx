'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';

interface FilterSidebarProps {
  type: 'LEAD' | 'BRAND' | 'INFLUENCER';
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

export const FilterSidebar = ({ type, onFilterChange, activeFilters }: FilterSidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['brand', 'growth', 'influencer', 'contact', 'outreach']);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleCheckboxChange = (category: string, value: string) => {
    const current = activeFilters[category] || [];
    const updated = current.includes(value) 
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    
    onFilterChange({ ...activeFilters, [category]: updated });
  };

  const FilterGroup = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <div className="border-b border-grey-100 last:border-0">
      <button 
        onClick={() => toggleGroup(id)}
        className="w-full flex items-center justify-between p-4 hover:bg-grey-50 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-black">{title}</span>
        {expandedGroups.includes(id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {expandedGroups.includes(id) && (
        <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxFilter = ({ category, label, value }: { category: string, label: string, value: string }) => (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input 
        type="checkbox" 
        className="w-4 h-4 accent-black rounded border-grey-300"
        checked={(activeFilters[category] || []).includes(value)}
        onChange={() => handleCheckboxChange(category, value)}
      />
      <span className="text-sm text-grey-600 group-hover:text-black transition-colors">{label}</span>
    </label>
  );

  const OUTREACH_STATUSES = [
    'NEW', 'CONTACTED', 'ATTEMPTED_CONTACT', 'FOLLOW_UP_PENDING', 'REPLIED', 
    'INTERESTED', 'QUALIFIED', 'UNQUALIFIED', 'NEGOTIATION', 'PROPOSAL_SENT', 
    'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'ONBOARDING', 'CLOSED_WON', 'CLOSED_LOST', 
    'NO_RESPONSE', 'INVALID_CONTACT', 'BLOCKED', 'DO_NOT_CONTACT', 'FUTURE_POTENTIAL'
  ];

  return (
    <div className="w-64 bg-white border-r border-grey-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden lg:block">
      <div className="p-4 border-b border-grey-200 flex items-center justify-between bg-grey-50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-bold uppercase tracking-tighter">Filters</span>
        </div>
        {Object.keys(activeFilters).length > 0 && (
          <button 
            onClick={() => onFilterChange({})}
            className="text-[10px] font-bold uppercase underline hover:text-red-600"
          >
            Clear All
          </button>
        )}
      </div>

      <FilterGroup id="outreach" title="Outreach Status">
        {OUTREACH_STATUSES.map(status => (
          <CheckboxFilter key={status} category="outreach_status" label={status.replace(/_/g, ' ')} value={status} />
        ))}
      </FilterGroup>

      <FilterGroup id="brand" title="Brand & Type">
        <CheckboxFilter category="tags" label="High Opportunity" value="High Opportunity" />
        <CheckboxFilter category="tags" label="Untapped Opportunity" value="Untapped Opportunity" />
        <CheckboxFilter category="tags" label="Scaling Fast" value="Scaling Fast" />
        <CheckboxFilter category="tags" label="D2C Heavy" value="D2C Heavy" />
      </FilterGroup>

      {type === 'BRAND' && (
        <>
          <FilterGroup id="growth" title="Growth & Revenue">
            <CheckboxFilter category="revenue" label="0-10Cr" value="0-10" />
            <CheckboxFilter category="revenue" label="10-50Cr" value="10-50" />
            <CheckboxFilter category="revenue" label="50-100Cr" value="50-100" />
            <CheckboxFilter category="revenue" label="100-500Cr" value="100-500" />
            <CheckboxFilter category="revenue" label="500Cr+" value="500+" />
          </FilterGroup>

          <FilterGroup id="influencer" title="Influencer Intel">
            <CheckboxFilter category="influencer_usage" label="Already Using" value="true" />
            <CheckboxFilter category="influencer_usage" label="Not Using" value="false" />
            <CheckboxFilter category="outreach" label="Outreach Done" value="true" />
            <CheckboxFilter category="outreach" label="Needs Outreach" value="false" />
          </FilterGroup>
        </>
      )}

      {type === 'INFLUENCER' && (
        <FilterGroup id="intel" title="Influencer Stats">
          <CheckboxFilter category="tags" label="Mega Influencer" value="Mega Influencer" />
          <CheckboxFilter category="tags" label="Macro Influencer" value="Macro Influencer" />
          <CheckboxFilter category="tags" label="Micro Influencer" value="Micro Influencer" />
          <CheckboxFilter category="tags" label="Viral Potential" value="Viral Potential" />
        </FilterGroup>
      )}

      <FilterGroup id="contact" title="Availability">
        <CheckboxFilter category="contact" label="Has Email" value="has_email" />
        <CheckboxFilter category="contact" label="Has Phone" value="has_phone" />
        <CheckboxFilter category="contact" label="Has LinkedIn" value="has_linkedin" />
      </FilterGroup>
    </div>
  );
};
