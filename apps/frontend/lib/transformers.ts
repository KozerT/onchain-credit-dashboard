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
  // Stable "Mock" logic based on the ID (so it doesn't change on refresh)
  // We use the loanId string to generate "pseudo-random" but stable numbers
  const seed = data.loanId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    ...data,
    // Format existing fields
    // Add missing fields with stable mocks
    displayYield: "8.5%", // You could vary this based on 'seed' if you want
    displayTerm: "36 months",
    collateral: "Commercial Real Estate", // Hardcoded for MVP
    creditScore: 650 + (seed % 200), // Random score between 650-850
    contractAddress: `0x${seed.toString(16).padEnd(40, "0")}`,
    ltv: 65 + (seed % 20), // 65-85%
    remainingAmount: data.principalOpenEur - (data.investedAmount || 0),
  };
}
