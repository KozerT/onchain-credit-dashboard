import { components } from "@/lib/api-types";

export type InstitutionDTO = components["schemas"]["Institution"];
export type LoanDTO = components["schemas"]["Loan"];

// Generated from Swagger components["schemas"]["DashboardStats"]
export type DashboardStatsDTO = {
  totalPortfolio: number;
  activeLoanCount: number;
  avgYield: number;
  defaultRate: number;
  status: 'VERIFIED' | 'ACTIVE' | 'PENDING';
};
