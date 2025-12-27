"use client";
import { components } from "@/lib/api-types";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardFooter } from "@repo/ui/card";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

type InstitutionData = components["schemas"]["Institution"];

export interface InstitutionProps {
  data: InstitutionData;
}

export const InstitutionCard = ({ data }: InstitutionProps) => {
  const router = useRouter();
  const formattedPortfolio = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(data.totalPortfolio || 0);

  const status = (data.creditRiskScore || 0) > 80 ? "verified" : "active";
  const mockYield = "8.5%";
  const mockTotalLoans = Math.floor((data.totalPortfolio || 0) / 150000);

  const statusColors = {
    active: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
    verified: "bg-primary/10 text-primary hover:bg-primary/20",
    pending: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20",
  };
  return (
    <Card
      className="border-border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={() => router.push(`/institution/${data._id}`)} // 👈 Next.js Navigation
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {data.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {data.country} • Est. {data.foundingYear}
              </p>
            </div>
          </div>
          {/* Using the Derived Status */}
          <Badge className={statusColors[status]} variant="secondary">
            {status === "verified" && <ShieldCheck className="w-3 h-3 mr-1" />}
            {status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Est. Loans</p>
            <p className="text-lg font-semibold">{mockTotalLoans}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Portfolio</p>
            <p className="text-lg font-semibold" suppressHydrationWarning>
              {formattedPortfolio}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Yield</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-lg font-semibold text-green-500">
                {mockYield}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/institution/${data._id}`);
          }}
        >
          View Portfolio
        </Button>
      </CardFooter>
    </Card>
  );
};
