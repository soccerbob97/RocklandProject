import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface OnboardingData {
  organization: {
    name: string;
    hrsa_grantee_id?: string;
  };
  clinical: {
    snapshot_date: string;
    total_patients: number;
    medicaid_patients: number;
    medicare_patients: number;
    uninsured_patients: number;
    private_patients: number;
    pediatric_count: number;
    adult_count: number;
    geriatric_count: number;
    services: string[];
    quality_metrics: Record<string, number>;
  };
  billing: {
    snapshot_date: string;
    medicaid_revenue: number;
    medicare_revenue: number;
    grant_revenue: number;
    self_pay_revenue: number;
    private_revenue: number;
    total_revenue: number;
    claims_denial_rate: number;
    avg_reimbursement_days: number;
    outstanding_ar: number;
    collections_rate: number;
  };
  grants: Array<{
    grant_name: string;
    aln: string;
    award_amount: number;
    period_start: string;
    period_end: string;
    status: string;
    utilization?: Array<{
      month: string;
      amount_spent: number;
    }>;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: OnboardingData = await request.json();

    // Validate required fields
    if (!data.organization?.name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    // 1. Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: data.organization.name,
        hrsa_grantee_id: data.organization.hrsa_grantee_id || `H80CS${Math.floor(10000 + Math.random() * 90000)}`,
      })
      .select()
      .single();

    if (orgError) {
      console.error('Organization error:', orgError);
      return NextResponse.json({ error: `Failed to create organization: ${orgError.message}` }, { status: 500 });
    }

    // 2. Link user to organization
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ organization_id: org.id })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json({ error: `Failed to link profile: ${profileError.message}` }, { status: 500 });
    }

    // 3. Insert clinical snapshot
    if (data.clinical) {
      const { error: clinicalError } = await supabase.from('clinical_snapshots').insert({
        organization_id: org.id,
        snapshot_date: data.clinical.snapshot_date,
        total_patients: data.clinical.total_patients,
        medicaid_patients: data.clinical.medicaid_patients,
        medicare_patients: data.clinical.medicare_patients,
        uninsured_patients: data.clinical.uninsured_patients,
        private_patients: data.clinical.private_patients,
        pediatric_count: data.clinical.pediatric_count,
        adult_count: data.clinical.adult_count,
        geriatric_count: data.clinical.geriatric_count,
        services: JSON.stringify(data.clinical.services),
        quality_metrics: JSON.stringify(data.clinical.quality_metrics),
        source: 'JSON Import',
      });

      if (clinicalError) {
        console.error('Clinical error:', clinicalError);
        return NextResponse.json({ error: `Failed to insert clinical data: ${clinicalError.message}` }, { status: 500 });
      }
    }

    // 4. Insert billing snapshot
    if (data.billing) {
      const { error: billingError } = await supabase.from('billing_snapshots').insert({
        organization_id: org.id,
        snapshot_date: data.billing.snapshot_date,
        medicaid_revenue: data.billing.medicaid_revenue,
        medicare_revenue: data.billing.medicare_revenue,
        grant_revenue: data.billing.grant_revenue,
        self_pay_revenue: data.billing.self_pay_revenue,
        private_revenue: data.billing.private_revenue,
        total_revenue: data.billing.total_revenue,
        claims_denial_rate: data.billing.claims_denial_rate,
        avg_reimbursement_days: data.billing.avg_reimbursement_days,
        outstanding_ar: data.billing.outstanding_ar,
        collections_rate: data.billing.collections_rate,
        source: 'JSON Import',
      });

      if (billingError) {
        console.error('Billing error:', billingError);
        return NextResponse.json({ error: `Failed to insert billing data: ${billingError.message}` }, { status: 500 });
      }
    }

    // 5. Insert grants and utilization
    if (data.grants && data.grants.length > 0) {
      for (const grant of data.grants) {
        const { data: insertedGrant, error: grantError } = await supabase
          .from('hrsa_grants')
          .insert({
            organization_id: org.id,
            grant_name: grant.grant_name,
            aln: grant.aln,
            award_amount: grant.award_amount,
            period_start: grant.period_start,
            period_end: grant.period_end,
            status: grant.status,
          })
          .select()
          .single();

        if (grantError) {
          console.error('Grant error:', grantError);
          continue;
        }

        // Insert utilization records
        if (grant.utilization && grant.utilization.length > 0) {
          const utilizationRecords = grant.utilization.map(u => ({
            grant_id: insertedGrant.id,
            reporting_month: u.month,
            amount_spent: u.amount_spent,
          }));

          const { error: utilError } = await supabase
            .from('hrsa_utilization')
            .insert(utilizationRecords);

          if (utilError) {
            console.error('Utilization error:', utilError);
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      organization_id: org.id,
      message: 'Data imported successfully' 
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
