import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const response = await fetch('https://api.grants.gov/v1/api/search2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword: keyword,
        oppStatuses: 'forecasted|posted',
        fundingCategories: 'HL', // Health
        rows: 20,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grants.gov API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to a cleaner format
    // API returns data in data.oppHits array
    const oppHits = data.data?.oppHits || [];
    const opportunities = oppHits.map((opp: any) => ({
      id: opp.id,
      number: opp.number || '',
      title: opp.title || 'Untitled',
      agency: opp.agency || 'Unknown Agency',
      openDate: opp.openDate || '',
      closeDate: opp.closeDate || '',
      awardCeiling: opp.awardCeiling || 0,
      awardFloor: opp.awardFloor || 0,
      description: opp.synopsis || '',
      oppStatus: opp.oppStatus || '',
    }));

    return NextResponse.json({ 
      opportunities,
      totalCount: data.data?.hitCount || 0 
    });
  } catch (error) {
    console.error('Error fetching grants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grants from Grants.gov' },
      { status: 500 }
    );
  }
}
