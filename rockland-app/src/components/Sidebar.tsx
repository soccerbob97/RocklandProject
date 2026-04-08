'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  DollarSign, 
  FileText, 
  Search, 
  GitBranch,
  Building2
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'EMR Data', href: '/data', icon: Database },
  { name: 'HRSA Funding', href: '/hrsa', icon: DollarSign },
  { name: 'UDS Report', href: '/uds', icon: FileText },
  { name: 'Grant Discovery', href: '/grants', icon: Search },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
        <div className="bg-emerald-600 p-2 rounded-lg">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-emerald-600">Rockland</h1>
          <p className="text-xs text-gray-500">Grant Management</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500">Demo Mode</p>
          <p className="text-sm font-medium text-gray-900">Sample FQHC Data</p>
        </div>
      </div>
    </div>
  );
}
