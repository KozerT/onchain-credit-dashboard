import { KPICard } from "@/components/KPICard";
import { getLoanDetails } from "@/lib/institution-service";
import { transformLoan } from "@/lib/transformers"; // 👈 Import transformer
import { formatCurrency } from "@repo/ui/lib/utils";

export default async function LoanPage(props: {
  params: Promise<{ "institution-id": string; "loan-id": string }>;
}) {
  const params = await props.params;

  // Map "kebab-case" from URL to "camelCase"
  const institutionId = params["institution-id"];
  const loanId = params["loan-id"];

  // 1. Fetch Raw Data
  const rawLoan = await getLoanDetails(institutionId, loanId);

  // 2. Transform to View Model (Adds yield, collateral, etc.)
  const loan = transformLoan(rawLoan);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Loan {loan.loanId}</h1>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <KPICard
          title="Principal"
          value={formatCurrency(loan.principalOpenEur)}
        />
        <KPICard title="Yield" value={loan.displayYield} />
        <KPICard title="Collateral" value={loan.collateral} />
        <KPICard title="Credit Score" value={loan.creditScore.toString()} />
      </div>
    </div>
  );
}
