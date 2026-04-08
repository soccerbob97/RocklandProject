-- Rockland Grant Management Platform - Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================
-- 1. PROFILES TABLE (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  organization_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ein TEXT,
  address TEXT,
  hrsa_grantee_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Organizations policies (users can only see their org)
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- 3. CLINICAL SNAPSHOTS (Epic EMR mock data)
-- ============================================
CREATE TABLE IF NOT EXISTS clinical_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_patients INTEGER,
  medicaid_patients INTEGER,
  medicare_patients INTEGER,
  uninsured_patients INTEGER,
  private_patients INTEGER,
  pediatric_count INTEGER,
  adult_count INTEGER,
  geriatric_count INTEGER,
  services JSONB DEFAULT '[]',
  quality_metrics JSONB DEFAULT '{}',
  source TEXT DEFAULT 'Epic EMR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE clinical_snapshots ENABLE ROW LEVEL SECURITY;

-- Clinical snapshots policies
CREATE POLICY "Users can view org clinical data" ON clinical_snapshots
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert org clinical data" ON clinical_snapshots
  FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- 4. BILLING SNAPSHOTS (Ocean EMR mock data)
-- ============================================
CREATE TABLE IF NOT EXISTS billing_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  medicaid_revenue DECIMAL(12,2),
  medicare_revenue DECIMAL(12,2),
  grant_revenue DECIMAL(12,2),
  self_pay_revenue DECIMAL(12,2),
  private_revenue DECIMAL(12,2),
  total_revenue DECIMAL(12,2),
  claims_denial_rate DECIMAL(5,2),
  avg_reimbursement_days INTEGER,
  outstanding_ar DECIMAL(12,2),
  collections_rate DECIMAL(5,2),
  source TEXT DEFAULT 'Ocean EMR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE billing_snapshots ENABLE ROW LEVEL SECURITY;

-- Billing snapshots policies
CREATE POLICY "Users can view org billing data" ON billing_snapshots
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert org billing data" ON billing_snapshots
  FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- 5. HRSA GRANTS
-- ============================================
CREATE TABLE IF NOT EXISTS hrsa_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  grant_name TEXT NOT NULL,
  aln TEXT, -- Assistance Listing Number (e.g., 93.224)
  award_amount DECIMAL(12,2),
  period_start DATE,
  period_end DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hrsa_grants ENABLE ROW LEVEL SECURITY;

-- HRSA grants policies
CREATE POLICY "Users can view org HRSA grants" ON hrsa_grants
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage org HRSA grants" ON hrsa_grants
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- 6. HRSA UTILIZATION RECORDS
-- ============================================
CREATE TABLE IF NOT EXISTS hrsa_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id UUID REFERENCES hrsa_grants(id) ON DELETE CASCADE,
  reporting_month DATE NOT NULL,
  amount_spent DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE hrsa_utilization ENABLE ROW LEVEL SECURITY;

-- HRSA utilization policies
CREATE POLICY "Users can view org HRSA utilization" ON hrsa_utilization
  FOR SELECT USING (
    grant_id IN (
      SELECT id FROM hrsa_grants WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert org HRSA utilization" ON hrsa_utilization
  FOR INSERT WITH CHECK (
    grant_id IN (
      SELECT id FROM hrsa_grants WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================
-- 7. GRANT PIPELINE
-- ============================================
CREATE TABLE IF NOT EXISTS grant_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  grants_gov_id TEXT,
  title TEXT NOT NULL,
  agency TEXT,
  award_ceiling DECIMAL(12,2),
  award_floor DECIMAL(12,2),
  close_date DATE,
  status TEXT DEFAULT 'discovered' CHECK (status IN ('discovered', 'reviewing', 'applying', 'submitted', 'awarded', 'rejected')),
  fit_score INTEGER,
  notes TEXT,
  added_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE grant_pipeline ENABLE ROW LEVEL SECURITY;

-- Grant pipeline policies
CREATE POLICY "Users can view org pipeline" ON grant_pipeline
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage org pipeline" ON grant_pipeline
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- 8. AUDIT LOG (immutable)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (read-only for users)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org audit log" ON audit_log
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- 9. HELPER FUNCTIONS
-- ============================================

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrsa_grants_updated_at
  BEFORE UPDATE ON hrsa_grants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grant_pipeline_updated_at
  BEFORE UPDATE ON grant_pipeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. SEED DATA (Demo Organization)
-- ============================================

-- Insert demo organization
INSERT INTO organizations (id, name, ein, address, hrsa_grantee_id)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Bay Area Community Health Center',
  '94-1234567',
  '1234 Mission Street, San Francisco, CA 94110',
  'H80CS12345'
) ON CONFLICT DO NOTHING;

-- Note: After a user signs up, you'll need to manually update their profile
-- to link them to the organization:
-- UPDATE profiles SET organization_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' WHERE email = 'your-email@example.com';
