import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  trend?: string;
  trendStatus?: "positive" | "negative" | "neutral";
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendStatus = "neutral",
}: KPICardProps) {
  const trendColor = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-muted-foreground",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trendColor[trendStatus]} mt-1`}>{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}
