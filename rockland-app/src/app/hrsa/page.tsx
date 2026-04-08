'use client';

import { AlertTriangle, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { hrsaGrants } from '@/lib/dummy-data';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function HRSAPage() {
  const totalAwarded = hrsaGrants.reduce((sum, g) => sum + g.awardAmount, 0);
  const totalSpent = hrsaGrants.reduce((sum, g) => sum + g.totalSpent, 0);
  const overallUtilization = (totalSpent / totalAwarded) * 100;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">HRSA Funding Tracker</h1>
        <p className="text-gray-500">Monitor grant utilization to avoid under-spending</p>
      </div>

      {/* Alert Banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">Important: HRSA Funding Rules</h3>
            <p className="text-sm text-amber-700 mt-1">
              If you under-draw HRSA funds, future grant amounts may be reduced. Monitor utilization closely 
              and ensure spending aligns with the grant period timeline.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2.5 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Awarded</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAwarded)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${overallUtilization < 50 ? 'bg-amber-100' : 'bg-emerald-100'}`}>
              <TrendingUp className={`h-5 w-5 ${overallUtilization < 50 ? 'text-amber-600' : 'text-emerald-600'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{overallUtilization.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grant Details */}
      <div className="space-y-4">
        {hrsaGrants.map(grant => {
          const periodStart = new Date(grant.periodStart);
          const periodEnd = new Date(grant.periodEnd);
          const now = new Date();
          const totalDays = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
          const elapsedDays = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
          const timeElapsedPercent = Math.min(100, (elapsedDays / totalDays) * 100);
          const isUnderSpending = grant.percentUsed < timeElapsedPercent - 10;
          
          return (
            <div key={grant.id} className={`bg-white rounded-xl border ${isUnderSpending ? 'border-amber-300' : 'border-gray-200'} overflow-hidden`}>
              <div className={`px-6 py-4 ${isUnderSpending ? 'bg-amber-50' : 'bg-gray-50'} border-b ${isUnderSpending ? 'border-amber-200' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{grant.name}</h3>
                    <p className="text-sm text-gray-500">ALN: {grant.aln}</p>
                  </div>
                  {isUnderSpending && (
                    <span className="px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Under-spending Alert
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Award Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(grant.awardAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Spent</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(grant.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(grant.awardAmount - grant.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Utilization</p>
                    <p className={`text-xl font-bold ${isUnderSpending ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {grant.percentUsed.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Spending Progress</span>
                    <span className="text-gray-700">{grant.percentUsed.toFixed(1)}% of budget used</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3 relative">
                    <div 
                      className={`h-3 rounded-full ${isUnderSpending ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${grant.percentUsed}%` }}
                    />
                    {/* Time marker */}
                    <div 
                      className="absolute top-0 w-0.5 h-3 bg-gray-400"
                      style={{ left: `${timeElapsedPercent}%` }}
                      title={`${timeElapsedPercent.toFixed(0)}% of grant period elapsed`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span className="text-gray-600">↑ {timeElapsedPercent.toFixed(0)}% of time elapsed</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {grant.periodStart} to {grant.periodEnd}
                  </span>
                </div>

                {isUnderSpending && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>Action Required:</strong> Spending is at {grant.percentUsed.toFixed(1)}% while {timeElapsedPercent.toFixed(0)}% of the grant period has elapsed. 
                      Consider accelerating allowable expenditures to avoid under-drawing.
                    </p>
                  </div>
                )}

                {/* Monthly Utilization */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Monthly Spending</h4>
                  <div className="flex items-end gap-2 h-24">
                    {grant.utilization.map((month, idx) => {
                      const maxSpent = Math.max(...grant.utilization.map(m => m.spent));
                      const height = (month.spent / maxSpent) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-emerald-500 rounded-t"
                            style={{ height: `${height}%` }}
                            title={`${month.month}: ${formatCurrency(month.spent)}`}
                          />
                          <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                            {month.month.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
