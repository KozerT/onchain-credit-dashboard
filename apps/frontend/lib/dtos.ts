import { components } from "@/lib/api-types";

export type InstitutionDTO = components["schemas"]["Institution"];
export type LoanDTO = components["schemas"]["Loan"];

export interface DashboardStatsDTO {
  totalValue: number;
  totalLoans: number;
  avgYield: number;
  defaultRate: number;
}
