'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Database } from 'lucide-react';

export default function ConnectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Database className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo Mode</h1>
        <p className="text-gray-500 mb-6">
          This application uses pre-loaded sample data to demonstrate FQHC grant management capabilities.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 text-left">
          <h3 className="font-medium text-gray-900 mb-2">Sample Data Includes:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              8,547 patients from Epic EMR
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              $7.2M revenue from Ocean Billing
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              3 active HRSA grants
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              UDS quality metrics
            </li>
          </ul>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Continue to Dashboard
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
