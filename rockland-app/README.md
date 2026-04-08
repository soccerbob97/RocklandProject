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
- **Auth**: Supabase Auth
- **External API**: Grants.gov REST API
- **Deployment**: Vercel

## Architecture Decisions

### Demo Mode with Static Data
This MVP uses **pre-loaded sample data** to demonstrate the platform's capabilities:
- Realistic FQHC patient demographics (8,547 patients)
- Revenue breakdown by payer type ($7.2M total)
- 3 active HRSA grants with utilization tracking
- UDS quality metrics with benchmarks

This approach was chosen because:
- Target user (CFO) needs to see the value proposition immediately
- Real EMR integrations require enterprise agreements
- Demonstrates all features without complex setup

### Why Grants.gov Only?
- SAM.gov requires API key registration (weeks-long process)
- Grants.gov has a free, public REST API
- Covers federal health grants most relevant to FQHCs

### Data Structure
All sample data is defined in `src/lib/dummy-data.ts`:
- **Organization** - FQHC with HRSA grantee ID
- **Clinical Data** - Patient counts, demographics, quality metrics
- **Billing Data** - Revenue by payer, denial rates, A/R
- **HRSA Grants** - Active grants with monthly utilization
- **Grant Pipeline** - Discovered opportunities with status

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase (for Auth only)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run `supabase-schema.sql` in Supabase SQL Editor (creates auth tables)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── auth/           # Sign in/up pages
│   ├── connect/        # Demo mode landing
│   ├── dashboard/      # Main dashboard
│   ├── data/           # EMR data sources view
│   ├── hrsa/           # HRSA funding tracker
│   ├── uds/            # UDS report preview
│   ├── grants/         # Grant discovery (Grants.gov API)
│   ├── pipeline/       # Grant pipeline management
│   └── api/grants/     # Grants.gov API proxy
├── components/
│   └── Sidebar.tsx     # Navigation
├── contexts/
│   └── AuthContext.tsx # Auth state management
├── lib/
│   ├── supabase/       # Supabase client (browser + server)
│   └── dummy-data.ts   # Sample FQHC data
└── middleware.ts       # Auth middleware
```

## Sample Data

The demo includes realistic FQHC data:

| Metric | Value |
|--------|-------|
| Total Patients | 8,547 |
| Medicaid Patients | 6,238 (73%) |
| Total Revenue | $7,252,000 |
| HRSA Grants | 3 active |
| Grant Utilization | 56% average |

## Production Improvements

- **Real EMR Integrations** - Epic FHIR API, eClinicalWorks, Athenahealth
- **Live Data Sync** - Webhook-based updates from EMR systems
- **Full UDS Export** - Generate EHB-compatible XML files
- **SAM.gov Integration** - Broader grant coverage (requires API key)
- **Multi-Organization** - Support for health center networks
- **Email Alerts** - Deadline reminders, under-spending warnings
- **AI Grant Matching** - Score opportunities based on org capabilities

## Demo Script

1. **Sign in** at `/auth/signin`
2. **View dashboard** - See patient counts, revenue, HRSA utilization
3. **Check HRSA page** - See under-spending alerts for Ryan White grant
4. **Search grants** - Try "FQHC" or "behavioral health"
5. **View UDS report** - See data lineage and quality metrics
6. **Explore pipeline** - See grant opportunities in progress
