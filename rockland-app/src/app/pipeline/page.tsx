'use client';

import { useState } from 'react';
import { Calendar, DollarSign, Star, MoreVertical, Plus } from 'lucide-react';
import { grantPipeline } from '@/lib/dummy-data';
import Link from 'next/link';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

const statusColors: Record<string, string> = {
  discovered: 'bg-gray-100 text-gray-700',
  reviewing: 'bg-purple-100 text-purple-700',
  applying: 'bg-blue-100 text-blue-700',
  submitted: 'bg-amber-100 text-amber-700',
  awarded: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  discovered: 'Discovered',
  reviewing: 'Reviewing',
  applying: 'Applying',
  submitted: 'Submitted',
  awarded: 'Awarded',
  rejected: 'Rejected',
};

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState(grantPipeline);
  const [filter, setFilter] = useState<string>('all');

  const filteredPipeline = filter === 'all' 
    ? pipeline 
    : pipeline.filter(g => g.status === filter);

  const updateStatus = (id: string, newStatus: string) => {
    setPipeline(prev => prev.map(g => 
      g.id === id ? { ...g, status: newStatus } : g
    ));
  };

  const statusCounts = pipeline.reduce((acc, g) => {
    acc[g.status] = (acc[g.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grant Pipeline</h1>
          <p className="text-gray-500">Track your grant applications from discovery to award</p>
        </div>
        <Link
          href="/grants"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Find New Grants
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({pipeline.length})
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key 
                ? 'bg-gray-900 text-white' 
                : `${statusColors[key]} hover:opacity-80`
            }`}
          >
            {label} ({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-4">
        {filteredPipeline.map((grant) => (
          <div key={grant.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[grant.status]}`}>
                    {statusLabels[grant.status]}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-amber-600">
                    <Star className="h-4 w-4 fill-amber-400" />
                    {grant.fitScore}% fit
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">{grant.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{grant.grantsGovId}</p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    {grant.agency}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Deadline: {grant.closeDate}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(grant.awardFloor)} - {formatCurrency(grant.awardCeiling)}
                  </span>
                </div>

                {grant.notes && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">{grant.notes}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">Added: {grant.addedDate}</p>
              </div>

              <div className="flex flex-col gap-2">
                <select
                  value={grant.status}
                  onChange={(e) => updateStatus(grant.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPipeline.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No grants in this status</h3>
          <p className="text-gray-500 mt-1">
            {filter === 'all' 
              ? 'Start by discovering new grants to add to your pipeline.'
              : `No grants are currently in "${statusLabels[filter]}" status.`}
          </p>
          <Link
            href="/grants"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Find New Grants
          </Link>
        </div>
      )}
    </div>
  );
}
