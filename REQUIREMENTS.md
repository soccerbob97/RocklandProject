# Rockland Grant Management Platform - Requirements Document

## Overview

A grant discovery, qualification, and data management platform for FQHC (Federally Qualified Health Center) CFOs. The platform integrates EMR data from multiple sources (Epic, Ocean EMR) to enable intelligent grant matching, UDS report generation, and HRSA funding utilization tracking.

---

## Target User

**Primary User**: CFO / Finance Director at an FQHC
- 50-300 staff across 2-5 clinic sites
- 5-15 active grants at any time
- Finance team of 2-4 people managing grants manually
- Current tools: QuickBooks, Excel, email
- **Has ~10 minutes/week** to evaluate new tools

**Key Pain Points** (from customer transcript):
1. Data integrity issues between systems (Azara vs Epic discrepancies)
2. Manual data entry from Excel to HRSA EHB system
3. Compliance anxiety - errors lead to probation, corrective action plans
4. Fragmented grant information across platforms
5. Cannot under-draw HRSA funding (reduces future allocations)

---

## Core Features (MVP Scope)

### 1. Authentication & User Management
- Email/password authentication via Supabase
- Google OAuth (optional - requires setup in Supabase dashboard)
- Organization-based access (users belong to an FQHC)

### 2. EMR Data (Simplified for MVP)
- **Pre-loaded dummy data** representing Epic clinical and Ocean billing snapshots
- Read-only display on dashboard (no CRUD forms to save time)
- Realistic sample data for a typical FQHC

**Epic Clinical Data** (dummy):
- Total patient counts by insurance type (Medicaid, Medicare, Uninsured, Private)
- Patient demographics (age groups, ethnicity)
- Services provided (primary care, dental, mental health, pediatrics)
- Quality metrics (diabetes control %, hypertension control %, screening rates)

**Ocean EMR Billing Data** (dummy):
- Revenue by payer type
- Claims denial rate
- Average reimbursement time

### 3. HRSA Funding Tracker
- Track active HRSA grants (Section 330, etc.)
- Monitor utilization percentage
- **Alert when under-spending** (risk of reduced future funding)
- Show burn rate and projected end-of-period status

### 4. UDS Report Preview
- Pull data from clinical/billing snapshots
- Map to UDS table format
- **Validation layer** - flag discrepancies, missing data
- Show data lineage (which source contributed each number)
- Export-ready format for HRSA EHB

### 5. Grant Discovery (Grants.gov API)
- Search federal grants matching org profile
- Filter by: funding category (Health), agency (HHS), eligibility
- Show: award amounts, deadlines, requirements
- Match grants to organization's clinical capabilities

### 6. Grant Pipeline Tracking
- Track opportunities: Discovered → Reviewing → Applying → Submitted → Awarded/Rejected
- Add notes, assign team members, set deadlines
- Fit score based on org profile match

### 7. Audit & Compliance
- Immutable audit log of all data changes
- Data validation on import
- Checksums for data integrity verification
- Row-level security (org isolation)

---

## User Stories

### Authentication
- [ ] As a user, I can sign up with email/password
- [ ] As a user, I can sign in with Google OAuth
- [ ] As a user, I can sign out
- [ ] As a user, I am redirected to dashboard after login

### EMR Data Management
- [ ] As a CFO, I can add a new clinical data snapshot (Epic mock)
- [ ] As a CFO, I can add a new billing data snapshot (Ocean mock)
- [ ] As a CFO, I can view historical snapshots
- [ ] As a CFO, I see validation warnings if data looks inconsistent

### HRSA Utilization
- [ ] As a CFO, I can add/edit HRSA grant information
- [ ] As a CFO, I can record spending against grants
- [ ] As a CFO, I see utilization % and alerts on dashboard
- [ ] As a CFO, I get warned if I'm under-spending HRSA funds

### UDS Reporting
- [ ] As a CFO, I can generate a UDS report preview from my data
- [ ] As a CFO, I can see which data sources contributed to each metric
- [ ] As a CFO, I see validation errors/warnings before export
- [ ] As a CFO, I can export UDS data in EHB-compatible format

### Grant Discovery
- [ ] As a CFO, I can search Grants.gov for opportunities
- [ ] As a CFO, I see grants matched to my org's capabilities
- [ ] As a CFO, I can add a grant to my pipeline
- [ ] As a CFO, I can view grant details (amount, deadline, requirements)

### Pipeline Management
- [ ] As a CFO, I can view all grants in my pipeline
- [ ] As a CFO, I can update grant status
- [ ] As a CFO, I can add notes to pipeline items
- [ ] As a CFO, I can filter pipeline by status

---

## Technical Architecture

### Stack
- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: TailwindCSS (Rockland UI patterns)
- **Backend**: Supabase (Auth, Database, RLS)
- **External API**: Grants.gov REST API (no auth required)
- **Deployment**: Vercel

### Database Schema (Supabase)

```sql
-- Users (managed by Supabase Auth, extended with profiles)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  full_name TEXT,
  organization_id UUID REFERENCES organizations,
  created_at TIMESTAMPTZ
)

-- Organizations (FQHCs)
organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  ein TEXT,
  address TEXT,
  hrsa_grantee_id TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Clinical Data Snapshots (Epic mock)
clinical_snapshots (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  snapshot_date DATE NOT NULL,
  total_patients INTEGER,
  medicaid_patients INTEGER,
  medicare_patients INTEGER,
  uninsured_patients INTEGER,
  private_patients INTEGER,
  pediatric_count INTEGER,
  adult_count INTEGER,
  geriatric_count INTEGER,
  services JSONB, -- ["dental", "mental_health", etc.]
  quality_metrics JSONB,
  created_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles
)

-- Billing Data Snapshots (Ocean mock)
billing_snapshots (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  snapshot_date DATE NOT NULL,
  medicaid_revenue DECIMAL,
  medicare_revenue DECIMAL,
  grant_revenue DECIMAL,
  self_pay_revenue DECIMAL,
  claims_denial_rate DECIMAL,
  avg_reimbursement_days INTEGER,
  created_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles
)

-- HRSA Grants
hrsa_grants (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  grant_name TEXT NOT NULL,
  aln TEXT, -- Assistance Listing Number (e.g., 93.224)
  award_amount DECIMAL,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ
)

-- HRSA Utilization Records
hrsa_utilization (
  id UUID PRIMARY KEY,
  grant_id UUID REFERENCES hrsa_grants,
  reporting_month DATE,
  amount_spent DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles
)

-- Grant Pipeline
grant_pipeline (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  grants_gov_id TEXT,
  title TEXT NOT NULL,
  agency TEXT,
  award_ceiling DECIMAL,
  award_floor DECIMAL,
  close_date DATE,
  status TEXT CHECK (status IN ('discovered', 'reviewing', 'applying', 'submitted', 'awarded', 'rejected')),
  fit_score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Audit Log (immutable)
audit_log (
  id UUID PRIMARY KEY,
  organization_id UUID,
  user_id UUID,
  action TEXT,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Row-Level Security (RLS)
All tables enforce organization isolation:
```sql
CREATE POLICY "org_isolation" ON clinical_snapshots
  FOR ALL USING (
    organization_id = (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid()
    )
  );
```

---

## API Integrations

### Grants.gov Search API
- **Endpoint**: `POST https://api.grants.gov/v1/api/search2`
- **Auth**: None required
- **Request**:
```json
{
  "keyword": "community health",
  "fundingCategories": "HL",
  "agencies": "HHS",
  "oppStatuses": "forecasted|posted"
}
```

---

## UI/UX Guidelines

### Rockland Design Patterns
- Clean, minimal interface
- White/light gray backgrounds
- Primary accent color for CTAs
- Clear data hierarchy
- Dashboard-first approach
- Mobile-responsive

### Key Screens
1. **Dashboard** - HRSA utilization, recent activity, alerts
2. **Data Sources** - Add/view Epic & Ocean snapshots
3. **UDS Report** - Generate and preview UDS data
4. **Grant Discovery** - Search and browse opportunities
5. **Pipeline** - Track grant applications

---

## Data Integrity Features

### Validation Rules
- Patient counts must sum correctly (medicaid + medicare + uninsured + private = total)
- Revenue figures must be positive
- Denial rate must be 0-100%
- Quality metrics must be 0-100%

### Audit Trail
- Every create/update/delete logged
- User, timestamp, old/new values captured
- Cannot be modified or deleted

### Data Lineage
- UDS reports link to source snapshots
- Can trace any metric back to its origin

---

## MVP Simplifications

### What We're Building
- Mock data entry (not real EMR integration)
- Single organization per user (no multi-org)
- Basic UDS preview (not full EHB export)
- Grants.gov only (no SAM.gov - requires API key)

### What We're NOT Building
- Real EMR API integrations
- Full compliance reporting engine
- Multi-organization management
- Role-based permissions (admin vs viewer)
- Email notifications

---

## Success Metrics

The prototype succeeds if a CFO can:
1. Sign in and see their dashboard in < 30 seconds
2. Add mock EMR data and see it reflected immediately
3. View HRSA utilization status at a glance
4. Search for relevant grants and add to pipeline
5. Generate a UDS report preview with validation

---

## Build Timeline (75 minutes)

| Time | Task |
|------|------|
| 0-10 min | Set up Next.js project, Supabase schema |
| 10-25 min | Auth flow (signup, signin, middleware) |
| 25-40 min | Dashboard + EMR data input forms |
| 40-55 min | HRSA tracker + UDS preview |
| 55-70 min | Grant discovery (Grants.gov API) |
| 70-75 min | Deploy to Netlify, final testing |

---

## File Structure (Actual)

```
rockland-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Redirect to /dashboard
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   ├── globals.css           # Tailwind styles
│   │   ├── auth/
│   │   │   ├── signin/page.tsx   # Sign in/up page
│   │   │   └── callback/route.ts # OAuth callback
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Dashboard layout with Sidebar
│   │   │   └── page.tsx          # Main dashboard
│   │   ├── data/
│   │   │   ├── layout.tsx        # Shared layout
│   │   │   └── page.tsx          # EMR data sources (Epic + Ocean)
│   │   ├── hrsa/
│   │   │   ├── layout.tsx        # Shared layout
│   │   │   └── page.tsx          # HRSA utilization tracker
│   │   ├── uds/
│   │   │   ├── layout.tsx        # Shared layout
│   │   │   └── page.tsx          # UDS report preview
│   │   ├── grants/
│   │   │   ├── layout.tsx        # Shared layout
│   │   │   └── page.tsx          # Grant discovery (Grants.gov API)
│   │   ├── pipeline/
│   │   │   ├── layout.tsx        # Shared layout
│   │   │   └── page.tsx          # Grant pipeline tracker
│   │   └── api/
│   │       └── grants/route.ts   # Proxy for Grants.gov API
│   ├── components/
│   │   └── Sidebar.tsx           # Navigation sidebar
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   └── server.ts         # Server Supabase client
│   │   └── dummy-data.ts         # Mock EMR/HRSA/Pipeline data
│   └── contexts/
│       └── AuthContext.tsx       # Auth state management
├── middleware.ts                 # Auth middleware (redirect logic)
├── supabase-schema.sql           # Database schema script
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://iyugotqkoluoqlsdwqgo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dWdvdHFrb2x1b3Fsc2R3cWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzcyNTksImV4cCI6MjA5MTIxMzI1OX0.JxTOwzgSQisITpuARk5QJuN5TN67z6M-tiPK6IKH0_0
```

---

## Key Decisions & Tradeoffs

1. **Mock EMR data vs real integration**: Chose mock for MVP speed; real integration would require FHIR/HL7 expertise
2. **Supabase vs custom backend**: Supabase provides auth + DB + RLS out of the box
3. **Grants.gov only**: SAM.gov requires API key registration (weeks); Grants.gov is free
4. **Single org per user**: Simplifies RLS and data model for MVP
5. **Client-side grant search**: Could cache in DB, but direct API is simpler for demo

---

## Production Improvements (Post-MVP)

1. Real EMR integrations (Epic FHIR, eClinicalWorks API)
2. Full UDS export to EHB format
3. SAM.gov integration for broader grant coverage
4. Multi-organization support with role-based access
5. Email alerts for grant deadlines and HRSA utilization warnings
6. AI-powered grant matching and eligibility assessment
7. Document storage for grant applications
