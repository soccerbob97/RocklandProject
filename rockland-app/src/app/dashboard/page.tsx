'use client';

import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  Calendar,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { 
  organizationData, 
  epicClinicalData, 
  oceanBillingData, 
  hrsaGrants,
  grantPipeline 
} from '@/lib/dummy-data';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function DashboardPage() {
  const underSpendingGrants = hrsaGrants.filter(g => g.status === 'under-spending');
  const totalHrsaAwarded = hrsaGrants.reduce((sum, g) => sum + g.awardAmount, 0);
  const totalHrsaSpent = hrsaGrants.reduce((sum, g) => sum + g.totalSpent, 0);
  const overallUtilization = (totalHrsaSpent / totalHrsaAwarded) * 100;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{organizationData.name}</h1>
        <p className="text-gray-500">HRSA Grantee ID: {organizationData.hrsa_grantee_id}</p>
      </div>

      {/* Alerts */}
      {underSpendingGrants.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">HRSA Funding Alert</h3>
              <p className="text-sm text-amber-700 mt-1">
                {underSpendingGrants.length} grant(s) showing under-spending. Under-drawing HRSA funds may reduce future allocations.
              </p>
              <ul className="mt-2 space-y-1">
                {underSpendingGrants.map(grant => (
                  <li key={grant.id} className="text-sm text-amber-700">
                    • <strong>{grant.name}</strong>: {grant.percentUsed.toFixed(1)}% utilized
                  </li>
                ))}
              </ul>
              <Link href="/hrsa" className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900 mt-2">
                View HRSA Funding <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(epicClinicalData.totalPatients)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">From Epic EMR • {epicClinicalData.snapshotDate}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2.5 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(oceanBillingData.totalRevenue)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">From Ocean EMR • {oceanBillingData.snapshotDate}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2.5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">HRSA Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{overallUtilization.toFixed(1)}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">{formatCurrency(totalHrsaSpent)} of {formatCurrency(totalHrsaAwarded)}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2.5 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Claims Denial Rate</p>
              <p className="text-2xl font-bold text-gray-900">{oceanBillingData.claimsDenialRate}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Avg. {oceanBillingData.avgReimbursementDays} days to reimburse</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Demographics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient Demographics</h2>
            <Link href="/data" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View Details →
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">By Insurance Type</p>
              <div className="space-y-2">
                {Object.entries(epicClinicalData.byInsurance).map(([key, value]) => {
                  const percent = (value / epicClinicalData.totalPatients) * 100;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20 capitalize">{key}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 w-16 text-right">{formatNumber(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* HRSA Grants Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">HRSA Grants</h2>
            <Link href="/hrsa" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {hrsaGrants.map(grant => (
              <div key={grant.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{grant.name}</p>
                    <p className="text-xs text-gray-500">ALN: {grant.aln}</p>
                  </div>
                  {grant.status === 'under-spending' && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                      Under-spending
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{formatCurrency(grant.totalSpent)} spent</span>
                    <span>{grant.percentUsed.toFixed(1)}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${grant.status === 'under-spending' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${grant.percentUsed}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quality Metrics</h2>
            <Link href="/uds" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View UDS Report →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(epicClinicalData.qualityMetrics).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-lg font-semibold text-gray-900">{value}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grant Pipeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Grant Pipeline</h2>
            <Link href="/pipeline" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {grantPipeline.slice(0, 3).map(grant => (
              <div key={grant.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{grant.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{grant.agency}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {grant.closeDate}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                  grant.status === 'applying' ? 'bg-blue-100 text-blue-700' :
                  grant.status === 'reviewing' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {grant.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
