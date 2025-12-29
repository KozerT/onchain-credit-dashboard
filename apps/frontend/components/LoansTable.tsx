"use client";

import { components } from "@/lib/api-types";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { formatCurrency, sortData } from "@repo/ui/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Loan = components["schemas"]["Loan"];
type SortField = "loanId" | "principalOpenEur" | "status";

export const LoansTable = ({ loans }: { loans: Loan[] }) => {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setDirection("asc");
    }
  };

  const sortedLoans = useMemo(() => {
    return sortData(loans, sortField, direction);
  }, [loans, sortField, direction]);

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("loanId")}
              className="cursor-pointer"
            >
              Loan ID <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("principalOpenEur")}
              className="cursor-pointer"
            >
              Principal <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLoans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No active loans found.
              </TableCell>
            </TableRow>
          ) : (
            sortedLoans.map((loan) => (
              <TableRow key={loan._id || loan.loanId}>
                <TableCell className="font-medium">{loan.loanId}</TableCell>
                <TableCell suppressHydrationWarning>
                  {formatCurrency(loan.principalOpenEur)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={loan.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/loan/${loan.loanId}`)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
