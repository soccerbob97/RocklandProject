'use client';

import { FileText, AlertCircle, CheckCircle, Info, Download } from 'lucide-react';
import { udsMetrics, epicClinicalData, oceanBillingData } from '@/lib/dummy-data';

function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function UDSPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UDS Report Preview</h1>
          <p className="text-gray-500">Uniform Data System report for {udsMetrics.reportingYear}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Download className="h-4 w-4" />
          Export for EHB
        </button>
      </div>

      {/* Data Sources */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800">Data Sources</h3>
            <p className="text-sm text-blue-700 mt-1">
              This report is generated from the following data snapshots:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• <strong>Epic EMR</strong> (Clinical): Snapshot from {epicClinicalData.snapshotDate}</li>
              <li>• <strong>Ocean EMR</strong> (Billing): Snapshot from {oceanBillingData.snapshotDate}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Warnings */}
      {udsMetrics.validationWarnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {udsMetrics.validationWarnings.map((warning, idx) => (
            <div 
              key={idx} 
              className={`rounded-lg p-4 flex items-start gap-3 ${
                warning.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              {warning.type === 'warning' ? (
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              ) : (
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${warning.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>
                  {warning.table}
                </p>
                <p className={`text-sm ${warning.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>
                  {warning.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table 3A - Patients by Age and Sex */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Table 3A: {udsMetrics.table3A.title}</h2>
              <p className="text-sm text-gray-500">Total Patients: {formatNumber(udsMetrics.table3A.totalPatients)}</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age Group</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Male</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Female</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {udsMetrics.table3A.data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{row.category}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 text-right">{formatNumber(row.male)}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 text-right">{formatNumber(row.female)}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">{formatNumber(row.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">Total</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">
                  {formatNumber(udsMetrics.table3A.data.reduce((sum, r) => sum + r.male, 0))}
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">
                  {formatNumber(udsMetrics.table3A.data.reduce((sum, r) => sum + r.female, 0))}
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">
                  {formatNumber(udsMetrics.table3A.totalPatients)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Table 4 - Patient Characteristics */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Table 4: {udsMetrics.table4.title}</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {udsMetrics.table4.data.map((row, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 flex-1">{row.category}</span>
                <div className="w-48 bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">{formatNumber(row.count)}</span>
                <span className="text-sm text-gray-500 w-16 text-right">{row.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table 6A - Quality Measures */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Table 6A: {udsMetrics.table6A.title}</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Measure</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Numerator</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Denominator</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Benchmark</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {udsMetrics.table6A.data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{row.measure}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 text-right">{formatNumber(row.numerator)}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 text-right">{formatNumber(row.denominator)}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">{row.rate}%</td>
                  <td className="px-6 py-3 text-sm text-gray-500 text-right">{row.benchmark}%</td>
                  <td className="px-6 py-3 text-center">
                    {row.status === 'met' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Met
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        <AlertCircle className="h-3 w-3" />
                        Not Met
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Lineage */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Lineage & Audit Trail</h3>
        <p className="text-sm text-gray-600">
          All data in this report can be traced back to source systems. Each metric includes:
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>• Source system (Epic EMR or Ocean EMR)</li>
          <li>• Snapshot date and time</li>
          <li>• Data validation checksum</li>
          <li>• User who generated the report</li>
        </ul>
        <p className="text-sm text-gray-500 mt-3">
          Report generated: {new Date().toISOString().split('T')[0]} | Checksum: sha256:a1b2c3d4...
        </p>
      </div>
    </div>
  );
}
