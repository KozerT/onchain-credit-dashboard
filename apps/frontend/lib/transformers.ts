import { DashboardStatsDTO, InstitutionDTO, LoanDTO } from "@/lib/dtos";

export interface InstitutionViewModel extends InstitutionDTO {
  // New fields added locally
  calculatedStatus: "verified" | "active" | "pending";
  displayYield: string;
  estimatedLoanCount: number;
}

export interface LoanViewModel extends Omit<LoanDTO, 'contractAddress' | 'collateralType'> {
  displayYield: string;
  displayTerm: string | null;
  collateral: string | null;
  creditScore: number;
  contractAddress: string | null;
  remainingAmount: number;
}

// 2. function to transform Raw -> Perfect
export function transformInstitution(
  data: InstitutionDTO & Partial<DashboardStatsDTO>
): InstitutionViewModel {
  return {
    ...data,
    calculatedStatus:
      (data.status?.toLowerCase() as "verified" | "active" | "pending") ||
      "active",
    displayYield: data.avgYield ? `${data.avgYield.toFixed(2)}%` : "0.00%",
    estimatedLoanCount: data.activeLoanCount || 0,
  };
}

export function transformLoan(data: LoanDTO): LoanViewModel {
  return {
    ...data,
    displayYield: data.yield ? `${data.yield.toFixed(1)}%` : "0.0%",
    displayTerm: data.term ? `${data.term} months` : null,
    collateral: data.collateralType || null,
    creditScore: data.creditScore || 0,
    contractAddress: data.contractAddress || null,
    remainingAmount: data.principalOpenEur - (data.investedAmount || 0),
  };
}
