# Design Decisions & Development Log

This document captures the thought process, design decisions, issues encountered, and solutions implemented during the development of the Rockland Grant Management Platform.

## Project Overview

**Goal:** Build a grant discovery and data management platform for FQHC (Federally Qualified Health Center) CFOs to:
- Track HRSA grant utilization with under-spending alerts
- View EMR clinical and billing data in one place
- Discover new federal grant opportunities
- Generate UDS report previews

**Target User:** Non-technical CFO who needs to see financial and operational data without manual data entry.

---

## Design Iterations

### Iteration 1: Static Dummy Data (Initial MVP)

**Approach:** Pre-load sample FQHC data directly in the codebase.

**Pros:**
- Fast to implement
- No database setup required
- Reliable for demos

**Cons:**
- Not personalized per user
- Can't demonstrate data updates

**Decision:** Started here to validate UI/UX quickly.

---

### Iteration 2: Simulated OAuth + Supabase Sync (Attempted)

**Thought Process:**
- CFO shouldn't do manual data entry (pain point from user research)
- Real EMR integrations (Epic FHIR, etc.) require enterprise agreements
- Simulate the OAuth flow to show production-ready architecture
- Store data in Supabase with Row Level Security (RLS)

**Implementation:**
1. Created `/connect` page with "Connect Epic" and "Connect Ocean" buttons
2. Clicking buttons simulates OAuth handshake (2-second delay)
3. On "connection," insert dummy data into Supabase tables
4. Dashboard reads live from Supabase
5. "Sync Now" button updates values with randomized data

**Issues Encountered:**

| Issue | Root Cause | Attempted Fix |
|-------|------------|---------------|
| "Failed to create organization" | Missing INSERT policy on `organizations` table | Added RLS policy `FOR INSERT WITH CHECK (true)` |
| "Failed to connect Epic" | Missing INSERT policy on `clinical_snapshots` | Added RLS policy `FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)` |
| Foreign key constraint error | `created_by` references `profiles(id)` but profile may not exist | Removed `created_by` field from inserts |
| Dashboard redirects to /connect | Profile `organization_id` not updating due to RLS | Added UPDATE policy for profiles |
| Grants not inserting | Missing INSERT policy on `hrsa_grants` | Added RLS policy |
| Import works but redirect fails | Timing issue between profile update and dashboard read | Multiple policy fixes attempted |

**Conclusion:** The RLS policies created a cascade of issues. Each fix revealed another missing policy. The complexity wasn't worth it for a demo.

---

### Iteration 3: JSON Import (Attempted)

**Thought Process:**
- Avoid the RLS timing issues by doing all inserts in a single API route
- User uploads/pastes JSON with their organization data
- Server-side API validates and inserts all data atomically

**Implementation:**
1. Created `/public/sample-data.json` with expected schema
2. Created `/api/onboard` route to process JSON
3. Updated `/connect` page with file upload and JSON paste options
4. Real-time validation of JSON structure

**Issues Encountered:**
- Same RLS policy issues persisted
- Profile update still blocked by RLS
- Multiple SQL scripts needed to fix policies
- User had to run SQL manually in Supabase dashboard

**Conclusion:** Still too complex for a demo. The Supabase RLS model requires careful policy design upfront.

---

### Iteration 4: Revert to Static Data (Final)

**Decision:** Revert to static dummy data for the MVP demo.

**Rationale:**
1. **Reliability** - Static data always works, no database issues
2. **Speed** - No API calls, instant page loads
3. **Simplicity** - No RLS policies to debug
4. **Demo Focus** - CFO can see the value proposition immediately

**What We Kept:**
- Supabase Auth (sign in/sign up still works)
- Grants.gov API integration (real API calls)
- All UI components and pages

**What We Removed:**
- Supabase data sync
- "Sync Now" functionality
- JSON import flow
- Complex RLS policies

---

## Technical Issues & Solutions

### 1. Grants.gov API Not Working

**Symptom:** "Fetch error" when searching for grants

**Root Cause:** 
- API response structure was `data.oppHits`, not `data.data.oppHits`
- Middleware was redirecting `/api` routes to auth

**Solution:**
```typescript
// Fixed response parsing
const opportunities = data.oppHits || [];

// Excluded /api from auth middleware
if (pathname.startsWith('/api')) {
  return NextResponse.next();
}
```

### 2. Git Nested Repository Warning

**Symptom:** "You've added another git repository inside your current repository"

**Root Cause:** Accidentally initialized a `.git` folder inside `rockland-app/`

**Solution:**
```bash
rm -rf rockland-app/.git
```

### 3. Search Field Font Too Light

**Symptom:** Placeholder and input text hard to read

**Solution:**
```tsx
className="... text-gray-900 placeholder:text-gray-500"
```

### 4. TypeScript Errors After Refactoring

**Symptom:** Property names didn't match between Supabase schema and dummy data

**Root Cause:** Supabase uses `snake_case`, dummy data uses `camelCase`

**Solution:** Rewrote dashboard to use dummy data property names directly:
- `grant.award_amount` → `grant.awardAmount`
- `grant.total_spent` → `grant.totalSpent`
- `clinicalData.total_patients` → `epicClinicalData.totalPatients`

---

## Lessons Learned

### 1. RLS Requires Upfront Design
Supabase Row Level Security is powerful but requires careful planning. Adding policies incrementally leads to a cascade of issues. Better to:
- Design all policies before writing application code
- Test policies in isolation with SQL queries
- Use service role key for admin operations

### 2. Demo vs Production Architecture
For demos, prioritize reliability over realism. A working demo with static data is better than a broken demo with "real" architecture.

### 3. Incremental Complexity
Start simple, add complexity only when needed:
1. Static data → validates UI/UX
2. Auth → validates user flow
3. External APIs → validates integrations
4. Database sync → validates data model

We tried to jump to step 4 too quickly.

### 4. Error Messages Matter
Adding detailed error messages (`${error.message}`) saved hours of debugging. Always surface the actual error, not just "Something went wrong."

---

## Future Considerations

If building the production version:

1. **Use Service Role for Onboarding**
   - Bypass RLS for initial data seeding
   - Use server-side API routes with service role key

2. **Design RLS Policies First**
   - Map out all CRUD operations per table
   - Test policies before writing application code

3. **Consider Prisma or Drizzle**
   - Type-safe database queries
   - Migrations instead of raw SQL

4. **Real EMR Integration**
   - Epic FHIR API requires enterprise agreement
   - Consider HL7 FHIR sandbox for development
   - Webhook-based sync for real-time updates

---

## Files Created/Modified

| File | Purpose |
|------|---------|
| `src/lib/dummy-data.ts` | Sample FQHC data |
| `src/app/dashboard/page.tsx` | Main dashboard (uses dummy data) |
| `src/app/connect/page.tsx` | Demo mode landing page |
| `src/app/api/grants/route.ts` | Grants.gov API proxy |
| `src/middleware.ts` | Auth middleware (excludes /api) |
| `supabase-schema.sql` | Database schema (for auth) |
| `supabase-update-policies.sql` | RLS policies (not used in final) |
| `README.md` | Updated documentation |

---

## Summary

We went through 4 iterations trying to balance demo realism with implementation complexity. The final decision was to use static dummy data, which provides a reliable demo experience while keeping the codebase simple. The Supabase auth integration remains, and the Grants.gov API provides real external data. Future production versions can add database sync with proper RLS policy design from the start.
