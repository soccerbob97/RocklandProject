'use client';

import { useState } from 'react';
import { Search, Calendar, DollarSign, Building, Plus, Loader2, ExternalLink } from 'lucide-react';

interface GrantOpportunity {
  id: string;
  number: string;
  title: string;
  agency: string;
  openDate: string;
  closeDate: string;
  awardCeiling: number;
  awardFloor: number;
  description: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function GrantsPage() {
  const [searchQuery, setSearchQuery] = useState('community health center');
  const [isLoading, setIsLoading] = useState(false);
  const [grants, setGrants] = useState<GrantOpportunity[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const searchGrants = async () => {
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grants');
      }

      const data = await response.json();
      setGrants(data.opportunities || []);
    } catch (err) {
      console.error('Error searching grants:', err);
      setError('Failed to search grants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addToPipeline = (grant: GrantOpportunity) => {
    alert(`Added "${grant.title}" to your pipeline! (In production, this would save to the database)`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Grant Discovery</h1>
        <p className="text-gray-500">Search Grants.gov for funding opportunities</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchGrants()}
              placeholder="Search for grants (e.g., community health, behavioral health, dental)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button
            onClick={searchGrants}
            disabled={isLoading || !searchQuery.trim()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Search Grants.gov
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Quick searches:</span>
          {['FQHC', 'behavioral health', 'dental services', 'HIV/AIDS', 'maternal health'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term);
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isLoading && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Found {grants.length} opportunities for "{searchQuery}"
          </p>
        </div>
      )}

      {grants.length > 0 && (
        <div className="space-y-4">
          {grants.map((grant) => (
            <div key={grant.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{grant.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{grant.number}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Building className="h-4 w-4" />
                      {grant.agency}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Closes: {grant.closeDate || 'TBD'}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <DollarSign className="h-4 w-4" />
                      {grant.awardFloor > 0 && grant.awardCeiling > 0
                        ? `${formatCurrency(grant.awardFloor)} - ${formatCurrency(grant.awardCeiling)}`
                        : grant.awardCeiling > 0
                        ? `Up to ${formatCurrency(grant.awardCeiling)}`
                        : 'Amount varies'}
                    </span>
                  </div>

                  {grant.description && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{grant.description}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => addToPipeline(grant)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Pipeline
                  </button>
                  <a
                    href={`https://www.grants.gov/search-results-detail/${grant.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Grants.gov
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasSearched && !isLoading && grants.length === 0 && !error && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No grants found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search terms or browse different categories.</p>
        </div>
      )}

      {!hasSearched && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Search for Grant Opportunities</h3>
          <p className="text-gray-500 mt-1">
            Enter keywords above to search the Grants.gov database for federal funding opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
