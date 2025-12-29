import { components } from "@/lib/api-types";

type Loan = components["schemas"]["Loan"];

const BASE_URL = process.env.INTERNAL_API_URL || "http://localhost:3001";

export async function getInstitutionDashboard(
  id: string
): Promise<DashboardStatsDTO> {
  try {
    const res = await fetch(`${BASE_URL}/api/institutions/dashboard/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { totalValue: 0, totalLoans: 0, avgYield: 0, defaultRate: 0 };
    }

    const data = await res.json();

    // Map the nested API response to flat DTO
    return {
      totalValue: data.summary?.totalLoanAmount || 0,
      totalLoans: data.summary?.numberOfLoans || 0,
      avgYield: 8.5, //  API doesn't return this yet, this is mock
      defaultRate: 2.3, // API doesn't return this yet, this is mock
    };
  } catch (error) {
    console.error("Failed to fetch dashboard:", error);
    return { totalValue: 0, totalLoans: 0, avgYield: 8.5, defaultRate: 2.3 };
  }
}

export async function getInstitutionLoans(id: string): Promise<Loan[]> {
  const res = await fetch(`${BASE_URL}/api/institutions/${id}/loans`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}
