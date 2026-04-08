'use client';

import { Database, Activity, Users, DollarSign } from 'lucide-react';
import { epicClinicalData, oceanBillingData } from '@/lib/dummy-data';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function DataPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">EMR Data Sources</h1>
        <p className="text-gray-500">Clinical and billing data from your integrated systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Epic Clinical Data */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Epic EMR</h2>
                <p className="text-sm text-gray-500">Clinical Data Snapshot</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">Snapshot Date</span>
              <span className="font-medium text-gray-900">{epicClinicalData.snapshotDate}</span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" /> Patient Counts
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Patients</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(epicClinicalData.totalPatients)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Medicaid</p>
                  <p className="text-xl font-bold text-emerald-600">{formatNumber(epicClinicalData.byInsurance.medicaid)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Medicare</p>
                  <p className="text-xl font-bold text-blue-600">{formatNumber(epicClinicalData.byInsurance.medicare)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Uninsured</p>
                  <p className="text-xl font-bold text-orange-600">{formatNumber(epicClinicalData.byInsurance.uninsured)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Age Distribution</h3>
              <div className="space-y-2">
                {Object.entries(epicClinicalData.byAge).map(([key, value]) => {
                  const percent = (value / epicClinicalData.totalPatients) * 100;
                  const labels: Record<string, string> = {
                    pediatric: 'Pediatric (0-17)',
                    adult: 'Adult (18-64)',
                    geriatric: 'Geriatric (65+)'
                  };
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-32">{labels[key]}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-sm text-gray-900 w-16 text-right">{formatNumber(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Services Provided</h3>
              <div className="flex flex-wrap gap-2">
                {epicClinicalData.servicesProvided.map(service => (
                  <span key={service} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Quality Metrics
              </h3>
              <div className="space-y-2">
                {Object.entries(epicClinicalData.qualityMetrics).map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm font-semibold text-gray-900">{value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ocean Billing Data */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ocean EMR</h2>
                <p className="text-sm text-gray-500">Billing Data Snapshot</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">Snapshot Date</span>
              <span className="font-medium text-gray-900">{oceanBillingData.snapshotDate}</span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Revenue Summary</h3>
              <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-emerald-700">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-700">{formatCurrency(oceanBillingData.totalRevenue)}</p>
              </div>
              
              <div className="space-y-2">
                {Object.entries(oceanBillingData.revenueByPayer).map(([key, value]) => {
                  const percent = (value / oceanBillingData.totalRevenue) * 100;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20 capitalize">{key}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-sm text-gray-900 w-24 text-right">{formatCurrency(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Claims Denial Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{oceanBillingData.claimsDenialRate}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Avg. Reimbursement</p>
                  <p className="text-2xl font-bold text-gray-900">{oceanBillingData.avgReimbursementDays} days</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Outstanding A/R</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(oceanBillingData.outstandingAR)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Collections Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">{oceanBillingData.collectionsRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Data Integrity Note:</strong> This billing data is synced from Ocean EMR. 
                Last sync completed successfully on {oceanBillingData.snapshotDate}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
