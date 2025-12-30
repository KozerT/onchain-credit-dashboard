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
import { formatCurrency } from "@repo/ui/lib/utils";
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

  // Calculate remaining amount
  const remainingAmount = loan.principalOpenEur - (loan.investedAmount || 0);

  // Format dates (YYYY-MM-DD format)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "N/A";
    }
  };

  const issueDate = formatDate(loan.createdAt);
  const maturityDate = formatDate(loan.loanLastDate);

  // Map status to badge variant
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "EXPIRED":
        return "secondary";
      case "PAID":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "EXPIRED":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "PAID":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      default:
        return "";
    }
  };

  // Truncate contract address
  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  // Ethereum explorer URL
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
                  className={`${getStatusColor(loan.status)} capitalize`}
                  variant={getStatusVariant(loan.status)}
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
            remainingAmount={remainingAmount}
          />
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              $ Principal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(loan.principalOpenEur)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annual Yield
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {loan.displayYield}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Term
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loan.displayTerm}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              $ Remaining
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(remainingAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Loan Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Collateral Type:
              </span>
              <span className="text-sm font-medium">{loan.collateral}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Credit Score:
              </span>
              <span className="text-sm font-medium">{loan.creditScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Issue Date:</span>
              <span className="text-sm font-medium">{issueDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Maturity Date:
              </span>
              <span className="text-sm font-medium">{maturityDate}</span>
            </div>
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
                {truncateAddress(loan.contractAddress)}
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
