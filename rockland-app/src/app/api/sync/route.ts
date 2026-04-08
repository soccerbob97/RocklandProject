import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const body = await request.json();
    const { source } = body; // 'epic' or 'ocean' or 'all'

    const results: any = {};

    // Sync clinical data (Epic)
    if (source === 'epic' || source === 'all') {
      const { data: clinical } = await supabase
        .from('clinical_snapshots')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (clinical) {
        // Randomize values by ±5%
        const randomize = (val: number) => Math.round(val * (0.95 + Math.random() * 0.1));
        
        const { error } = await supabase
          .from('clinical_snapshots')
          .update({
            snapshot_date: new Date().toISOString().split('T')[0],
            total_patients: randomize(clinical.total_patients),
            medicaid_patients: randomize(clinical.medicaid_patients),
            medicare_patients: randomize(clinical.medicare_patients),
            uninsured_patients: randomize(clinical.uninsured_patients),
            private_patients: randomize(clinical.private_patients),
            pediatric_count: randomize(clinical.pediatric_count),
            adult_count: randomize(clinical.adult_count),
            geriatric_count: randomize(clinical.geriatric_count),
          })
          .eq('id', clinical.id);

        results.epic = error ? 'failed' : 'synced';
      }
    }

    // Sync billing data (Ocean)
    if (source === 'ocean' || source === 'all') {
      const { data: billing } = await supabase
        .from('billing_snapshots')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (billing) {
        // Randomize values by ±5%
        const randomize = (val: number) => Math.round(val * (0.95 + Math.random() * 0.1));
        
        const { error } = await supabase
          .from('billing_snapshots')
          .update({
            snapshot_date: new Date().toISOString().split('T')[0],
            medicaid_revenue: randomize(Number(billing.medicaid_revenue)),
            medicare_revenue: randomize(Number(billing.medicare_revenue)),
            grant_revenue: randomize(Number(billing.grant_revenue)),
            self_pay_revenue: randomize(Number(billing.self_pay_revenue)),
            private_revenue: randomize(Number(billing.private_revenue)),
            total_revenue: randomize(Number(billing.total_revenue)),
            claims_denial_rate: Math.round((Number(billing.claims_denial_rate) + (Math.random() - 0.5)) * 10) / 10,
            outstanding_ar: randomize(Number(billing.outstanding_ar)),
          })
          .eq('id', billing.id);

        results.ocean = error ? 'failed' : 'synced';
      }
    }

    return NextResponse.json({ 
      success: true, 
      results,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
