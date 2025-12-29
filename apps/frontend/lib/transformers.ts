import { components } from "@/lib/api-types";

type RawInstitution = components["schemas"]["Institution"];

export interface InstitutionViewModel extends RawInstitution {
  // New fields added locally
  calculatedStatus: "verified" | "active" | "pending";
  displayYield: string;
  estimatedLoanCount: number;
}

// 2. function to transform Raw -> Perfect
export function transformInstitution(
  data: RawInstitution
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
