// Dummy data representing a typical FQHC's EMR and financial data

export const organizationData = {
  id: "org-001",
  name: "Bay Area Community Health Center",
  ein: "94-1234567",
  address: "1234 Mission Street, San Francisco, CA 94110",
  hrsa_grantee_id: "H80CS12345",
};

export const epicClinicalData = {
  snapshotDate: "2026-03-31",
  source: "Epic EMR",
  totalPatients: 8547,
  byInsurance: {
    medicaid: 6238,
    medicare: 1156,
    uninsured: 847,
    private: 306,
  },
  byAge: {
    pediatric: 2134, // 0-17
    adult: 5413,     // 18-64
    geriatric: 1000, // 65+
  },
  byEthnicity: {
    hispanic: 4521,
    black: 1967,
    white: 1284,
    asian: 512,
    other: 263,
  },
  servicesProvided: [
    "Primary Care",
    "Dental",
    "Mental Health",
    "Pediatrics",
    "Women's Health",
    "Chronic Disease Management",
  ],
  qualityMetrics: {
    diabetesControl: 68.2,        // % HbA1c < 9%
    hypertensionControl: 72.4,    // % BP < 140/90
    cervicalCancerScreening: 81.3,
    colorectalCancerScreening: 62.8,
    childImmunizations: 78.9,
    prenatalCare: 85.2,
  },
};

export const oceanBillingData = {
  snapshotDate: "2026-03-31",
  source: "Ocean EMR (Billing)",
  revenueByPayer: {
    medicaid: 4235000,
    medicare: 892000,
    grants: 1845000,
    selfPay: 124000,
    private: 156000,
  },
  totalRevenue: 7252000,
  claimsDenialRate: 8.2,
  avgReimbursementDays: 34,
  outstandingAR: 892000,
  collectionsRate: 94.2,
};

export const hrsaGrants = [
  {
    id: "hrsa-001",
    name: "Section 330 Health Center Program",
    aln: "93.224",
    awardAmount: 2400000,
    periodStart: "2025-09-01",
    periodEnd: "2026-08-31",
    utilization: [
      { month: "2025-09", spent: 180000 },
      { month: "2025-10", spent: 195000 },
      { month: "2025-11", spent: 210000 },
      { month: "2025-12", spent: 225000 },
      { month: "2026-01", spent: 198000 },
      { month: "2026-02", spent: 215000 },
      { month: "2026-03", spent: 205000 },
    ],
    totalSpent: 1428000,
    percentUsed: 59.5,
    status: "on-track",
  },
  {
    id: "hrsa-002",
    name: "Ryan White HIV/AIDS Program",
    aln: "93.914",
    awardAmount: 450000,
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
    utilization: [
      { month: "2026-01", spent: 32000 },
      { month: "2026-02", spent: 28000 },
      { month: "2026-03", spent: 35000 },
    ],
    totalSpent: 95000,
    percentUsed: 21.1,
    status: "under-spending", // Alert: only 21% used with 25% of time elapsed
  },
  {
    id: "hrsa-003",
    name: "Behavioral Health Integration",
    aln: "93.243",
    awardAmount: 320000,
    periodStart: "2025-07-01",
    periodEnd: "2026-06-30",
    utilization: [
      { month: "2025-07", spent: 24000 },
      { month: "2025-08", spent: 26000 },
      { month: "2025-09", spent: 28000 },
      { month: "2025-10", spent: 27000 },
      { month: "2025-11", spent: 29000 },
      { month: "2025-12", spent: 31000 },
      { month: "2026-01", spent: 28000 },
      { month: "2026-02", spent: 30000 },
      { month: "2026-03", spent: 32000 },
    ],
    totalSpent: 255000,
    percentUsed: 79.7,
    status: "on-track",
  },
];

export const udsMetrics = {
  reportingYear: 2025,
  table3A: {
    title: "Patients by Age and Sex",
    data: [
      { category: "Under 1 year", male: 89, female: 94, total: 183 },
      { category: "1-4 years", male: 312, female: 298, total: 610 },
      { category: "5-9 years", male: 356, female: 341, total: 697 },
      { category: "10-14 years", male: 298, female: 312, total: 610 },
      { category: "15-19 years", male: 245, female: 289, total: 534 },
      { category: "20-24 years", male: 312, female: 398, total: 710 },
      { category: "25-44 years", male: 1245, female: 1567, total: 2812 },
      { category: "45-64 years", male: 689, female: 802, total: 1491 },
      { category: "65-74 years", male: 312, female: 398, total: 710 },
      { category: "75 and over", male: 89, female: 101, total: 190 },
    ],
    totalPatients: 8547,
  },
  table4: {
    title: "Selected Patient Characteristics",
    data: [
      { category: "Patients at or below 100% of poverty", count: 5128, percent: 60.0 },
      { category: "Patients 101-150% of poverty", count: 1709, percent: 20.0 },
      { category: "Patients 151-200% of poverty", count: 855, percent: 10.0 },
      { category: "Patients over 200% of poverty", count: 855, percent: 10.0 },
    ],
  },
  table6A: {
    title: "Quality of Care Measures",
    data: [
      { measure: "Diabetes: HbA1c Poor Control (>9%)", numerator: 412, denominator: 1295, rate: 31.8, benchmark: 33.0, status: "met" },
      { measure: "Hypertension: BP Control (<140/90)", numerator: 1823, denominator: 2518, rate: 72.4, benchmark: 65.0, status: "met" },
      { measure: "Cervical Cancer Screening", numerator: 1892, denominator: 2328, rate: 81.3, benchmark: 75.0, status: "met" },
      { measure: "Colorectal Cancer Screening", numerator: 1245, denominator: 1982, rate: 62.8, benchmark: 60.0, status: "met" },
      { measure: "Child Immunization Status", numerator: 1012, denominator: 1283, rate: 78.9, benchmark: 80.0, status: "not-met" },
      { measure: "Prenatal Care in 1st Trimester", numerator: 312, denominator: 366, rate: 85.2, benchmark: 80.0, status: "met" },
    ],
  },
  validationWarnings: [
    {
      type: "warning",
      table: "Table 3A",
      message: "Total patients (8,547) differs from sum of age groups by 0. Verify data integrity.",
    },
    {
      type: "info",
      table: "Table 6A",
      message: "Child Immunization rate (78.9%) is below benchmark (80.0%). Consider quality improvement initiatives.",
    },
  ],
};

export const grantPipeline = [
  {
    id: "pipe-001",
    grantsGovId: "HHS-2026-ACF-OCC-YD-0001",
    title: "Community Health Worker Training Program",
    agency: "HHS - ACF",
    awardCeiling: 500000,
    awardFloor: 100000,
    closeDate: "2026-05-15",
    status: "reviewing",
    fitScore: 85,
    notes: "Strong fit with our CHW program. Need to verify matching fund requirements.",
    addedDate: "2026-03-20",
  },
  {
    id: "pipe-002",
    grantsGovId: "HHS-2026-HRSA-BH-0042",
    title: "Integrated Behavioral Health Services Expansion",
    agency: "HHS - HRSA",
    awardCeiling: 750000,
    awardFloor: 250000,
    closeDate: "2026-06-01",
    status: "applying",
    fitScore: 92,
    notes: "Aligns with our BH integration grant. Draft application in progress.",
    addedDate: "2026-02-15",
  },
  {
    id: "pipe-003",
    grantsGovId: "HHS-2026-CDC-DP-0089",
    title: "Diabetes Prevention Program",
    agency: "HHS - CDC",
    awardCeiling: 300000,
    awardFloor: 75000,
    closeDate: "2026-04-30",
    status: "discovered",
    fitScore: 78,
    notes: "Could support our chronic disease management program.",
    addedDate: "2026-04-01",
  },
];
