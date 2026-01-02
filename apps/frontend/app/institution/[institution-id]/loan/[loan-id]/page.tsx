import { DetailRow } from "@/components/DetailRow";
import { KPICard } from "@/components/KPICard";
import { LoanInvestAction } from "@/components/LoanInvestAction";
import { getInstitutionById, getLoanDetails } from "@/lib/institution-service";
import { transformLoan } from "@/lib/transformers";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { formatCurrency, formatDate, truncateMiddle } from "@repo/ui/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function LoanPage(props: {
  params: Promise<{ "institution-id": string; "loan-id": string }>;
}) {
  const params = await props.params;
  const institutionId = params["institution-id"];
  const loanId = params["loan-id"];

  const [rawLoan, institution] = await Promise.all([
    getLoanDetails(institutionId, loanId),
    getInstitutionById(institutionId),
  ]);
  const loan = transformLoan(rawLoan);

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-700 border-green-500/20",
    EXPIRED: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    PAID: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  };

  const statusVariant = loan.status === "ACTIVE" ? "default" : "secondary";

  const etherscanUrl = `https://etherscan.io/address/${loan.contractAddress}`;

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href={`/institution/${institutionId}`}>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Loan {loan.loanId}</h1>
                <Badge
                  className={`${statusStyles[loan.status || "ACTIVE"]} capitalize`}
                  variant={statusVariant}
                >
                  {loan.status?.toLowerCase() || "active"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {institution?.name || "Institution"}
              </p>
            </div>
          </div>
          <LoanInvestAction
            loanId={loan.loanId}
            loanYield={loan.displayYield}
            remainingAmount={loan.remainingAmount}
          />
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Principal"
          value={formatCurrency(loan.principalOpenEur)}
        />
        <KPICard
          title="Annual Yield"
          value={loan.displayYield}
          icon={TrendingUp}
          trendStatus="positive"
        />
        <KPICard title="Term" value={loan.displayTerm} icon={Calendar} />
        <KPICard
          title="Remaining Amount"
          value={formatCurrency(loan.remainingAmount)}
          icon={DollarSign}
        />
      </div>

      {/* Details Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Loan Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Collateral Type" value={loan.collateral} />
            <DetailRow label="Credit Score" value={String(loan.creditScore)} />
            <DetailRow label="Issue Date" value={formatDate(loan.createdAt)} />
            <DetailRow
              label="Maturity Date"
              value={formatDate(loan.loanLastDate)}
            />
          </CardContent>
        </Card>

        {/* Blockchain Verification Card */}
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-muted-foreground">
                {truncateMiddle(loan.contractAddress, 10, 8)}
              </span>
              <a
                href={etherscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">
                Verified on Ethereum Mainnet
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Schedule Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
          <CardDescription>Expected payment schedule over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Chart: Expected payment schedule over time
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
