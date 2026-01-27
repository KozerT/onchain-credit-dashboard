"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { formatCurrency } from "@repo/ui/lib/utils";

interface LoanInvestActionProps {
  loanId: string;
  loanYield: string;
  remainingAmount: number;
}

export function LoanInvestAction({
  loanId,
  loanYield,
  remainingAmount,
}: LoanInvestActionProps) {
  const [open, setOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");

  const handleInvest = () => {
    // TODO: Implement investment logic
    setOpen(false);
    setInvestmentAmount("");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invest Now</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in Loan {loanId}</DialogTitle>
            <DialogDescription>
              Enter the amount you want to invest. Maximum available:{" "}
              {formatCurrency(remainingAmount)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Investment Amount
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min="0"
                max={remainingAmount}
              />
            </div>
            {investmentAmount && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Yield:</span>
                  <span className="font-medium">{loanYield}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investment:</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(investmentAmount) || 0)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvest}
              disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
            >
              Confirm Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

