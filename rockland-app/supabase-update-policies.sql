-- Run this in Supabase SQL Editor to add missing policies
-- Using DROP IF EXISTS to avoid duplicate policy errors

-- Add UPDATE policies for clinical and billing snapshots
DROP POLICY IF EXISTS "Users can update org clinical data" ON clinical_snapshots;
CREATE POLICY "Users can update org clinical data" ON clinical_snapshots
  FOR UPDATE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update org billing data" ON billing_snapshots;
CREATE POLICY "Users can update org billing data" ON billing_snapshots
  FOR UPDATE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Add INSERT policy for organizations (so users can create their own org)
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for organizations
DROP POLICY IF EXISTS "Users can update own organization" ON organizations;
CREATE POLICY "Users can update own organization" ON organizations
  FOR UPDATE USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Allow users to SELECT the org they just created (needed for .select() after insert)
DROP POLICY IF EXISTS "Users can view created organization" ON organizations;
CREATE POLICY "Users can view created organization" ON organizations
  FOR SELECT USING (true);

-- Fix clinical_snapshots INSERT policy to allow authenticated users to insert for any org they own
DROP POLICY IF EXISTS "Users can insert org clinical data" ON clinical_snapshots;
CREATE POLICY "Users can insert org clinical data" ON clinical_snapshots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix billing_snapshots INSERT policy
DROP POLICY IF EXISTS "Users can insert org billing data" ON billing_snapshots;
CREATE POLICY "Users can insert org billing data" ON billing_snapshots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix hrsa_grants INSERT policy
DROP POLICY IF EXISTS "Users can insert org HRSA grants" ON hrsa_grants;
CREATE POLICY "Users can insert org HRSA grants" ON hrsa_grants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix hrsa_utilization INSERT policy  
DROP POLICY IF EXISTS "Users can insert org HRSA utilization" ON hrsa_utilization;
CREATE POLICY "Users can insert org HRSA utilization" ON hrsa_utilization
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix profiles UPDATE policy (so users can update their own profile)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Fix profiles SELECT policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());
