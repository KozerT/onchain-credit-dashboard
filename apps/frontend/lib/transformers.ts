import { InstitutionDTO, LoanDTO } from "@/lib/dtos";

export interface InstitutionViewModel extends InstitutionDTO {
  // New fields added locally
  calculatedStatus: "verified" | "active" | "pending";
  displayYield: string;
  estimatedLoanCount: number;
}

export interface LoanViewModel extends LoanDTO {
  // Mocked/Computed fields
  displayYield: string;
  displayTerm: string;
  collateral: string;
  creditScore: number;
  contractAddress: string;
  ltv: number;
  remainingAmount: number;
}

// 2. function to transform Raw -> Perfect
export function transformInstitution(
  data: InstitutionDTO
): InstitutionViewModel {
  // Logic: Status based on Risk Score
  const score = data.creditRiskScore || 0;
  let status: "verified" | "active" | "pending" = "active";
  if (score > 80) status = "verified";
  if (score < 50) status = "pending";

  // Logic: Estimate Loans (Mock logic centralized here)
  const portfolio = data.totalPortfolio || 0;
  const estimatedCount = portfolio > 0 ? Math.floor(portfolio / 150000) : 0;

  return {
    ...data,
    //  computed fields
    calculatedStatus: status,
    displayYield: "8.5%", //FIX: hardcoded, should be  to find/fix later!
    estimatedLoanCount: estimatedCount,
  };
}

export function transformLoan(data: LoanDTO): LoanViewModel {
  return {
    ...data,
    displayYield: data.yield ? `${data.yield.toFixed(1)}%` : "0.0%",
    displayTerm: data.term ? `${data.term} months` : "N/A",
    collateral: data.collateralType || "General Business Assets",
    creditScore: data.creditScore || 0,
    contractAddress: data.contractAddress || "Pending Deployment",
    ltv: data.ltv || 65,
    remainingAmount: data.principalOpenEur - (data.investedAmount || 0),
  };
}
