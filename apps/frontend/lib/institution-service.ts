import { DashboardStatsDTO, InstitutionDTO, LoanDTO } from "@/lib/dtos";

const BASE_URL = process.env.INTERNAL_API_URL || "http://localhost:3001";

export async function getInstitutions(): Promise<InstitutionDTO[]> {
  const res = await fetch(`${BASE_URL}/api/institutions`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch institutions");
  return res.json();
}

export async function getInstitutionDashboard(
  id: string
): Promise<DashboardStatsDTO> {
  try {
    const res = await fetch(`${BASE_URL}/api/institutions/dashboard/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        totalPortfolio: 0,
        activeLoanCount: 0,
        avgYield: 0,
        defaultRate: 0,
        status: "PENDING",
      };
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard:", error);
    return {
      totalPortfolio: 0,
      activeLoanCount: 0,
      avgYield: 0,
      defaultRate: 0,
      status: "PENDING",
    };
  }
}

export async function getInstitutionLoans(id: string): Promise<LoanDTO[]> {
  const res = await fetch(`${BASE_URL}/api/institutions/${id}/loans`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export async function getLoanDetails(
  institutionId: string,
  loanId: string
): Promise<LoanDTO> {
  const res = await fetch(
    `${BASE_URL}/api/institutions/${institutionId}/loans`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch loans");

  const loans: LoanDTO[] = await res.json();

  const loan = loans.find((l) => l._id === loanId || l.loanId === loanId);

  if (!loan) {
    throw new Error("Loan not found");
  }

  return loan;
}

export async function getInstitutionById(
  id: string
): Promise<InstitutionDTO | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/institutions/dashboard/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.institution || null;
  } catch (error) {
    console.error("Failed to fetch institution:", error);
    return null;
  }
}
