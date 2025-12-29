import { KPICard } from "@/components/KPICard";
import { LoansTable } from "@/components/LoansTable";
import {
  getInstitutionDashboard,
  getInstitutionLoans,
} from "@/lib/institution-service";
import { Button } from "@repo/ui/button";
import { formatCurrency } from "@repo/ui/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function InstitutionPage(props: {
  params: Promise<{ "institution-id": string }>;
}) {
  const params = await props.params;
  const id = params["institution-id"];

  const [stats, loans] = await Promise.all([
    getInstitutionDashboard(id),
    getInstitutionLoans(id),
  ]);

  console.log("API Stats Debug:", stats);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 p-6 lg:p-8 mt-16 lg:mt-0">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Institutions
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Institution Overview
          </h1>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total Value"
            value={formatCurrency(stats.totalValue || 0)}
          />
          <KPICard title="Active Loans" value={String(stats.totalLoans || 0)} />
          <KPICard title="Avg Yield" value={`${stats.avgYield || 0}%`} />
          <KPICard title="Default Rate" value={`${stats.defaultRate || 0}%`} />
        </div>

        {/* Loans Table Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Loan Portfolio</h2>
          <LoansTable loans={loans} institutionId={id} />
        </div>
      </main>
    </div>
  );
}
