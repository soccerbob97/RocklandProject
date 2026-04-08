# Rockland Grant Management Platform

A grant discovery, qualification, and data management platform for FQHC (Federally Qualified Health Center) CFOs.

## Features

- **Dashboard** - Overview of patient demographics, revenue, HRSA utilization, and quality metrics
- **EMR Data Integration** - View clinical data (Epic) and billing data (Ocean EMR)
- **HRSA Funding Tracker** - Monitor grant utilization with under-spending alerts
- **UDS Report Preview** - Generate UDS reports with data validation and lineage
- **Grant Discovery** - Search Grants.gov for federal funding opportunities
- **Pipeline Management** - Track grant applications from discovery to award

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS
- **Auth & Database**: Supabase
- **External API**: Grants.gov REST API

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

Open Supabase Dashboard → SQL Editor → New Query, then paste and run the contents of `supabase-schema.sql`.

### 4. Link User to Organization

After signing up, run this SQL to link your user to the demo organization:

```sql
UPDATE profiles 
SET organization_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' 
WHERE email = 'your-email@example.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── auth/           # Sign in/up pages
│   ├── dashboard/      # Main dashboard
│   ├── data/           # EMR data sources
│   ├── hrsa/           # HRSA funding tracker
│   ├── uds/            # UDS report preview
│   ├── grants/         # Grant discovery
│   ├── pipeline/       # Grant pipeline
│   └── api/grants/     # Grants.gov API proxy
├── components/
│   └── Sidebar.tsx     # Navigation
├── contexts/
│   └── AuthContext.tsx # Auth state
└── lib/
    ├── supabase/       # Supabase clients
    └── dummy-data.ts   # Mock EMR/HRSA data
```

## Key Decisions

1. **Dummy data for MVP** - EMR data is pre-loaded rather than requiring CRUD forms
2. **Supabase for auth + DB** - Provides auth, database, and RLS out of the box
3. **Grants.gov only** - SAM.gov requires API key registration (weeks wait)
4. **Single org per user** - Simplifies data isolation for demo

## Production Improvements

- Real EMR integrations (Epic FHIR, eClinicalWorks API)
- Full UDS export to EHB format
- SAM.gov integration
- Multi-organization support
- Email alerts for deadlines
- AI-powered grant matching
