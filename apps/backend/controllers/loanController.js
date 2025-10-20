import Loan from "../models/Loan.js";

// @desc    Invest in a specific loan
// @route   PATCH /api/loans/:loanId/invest
export const investInLoan = async (req, res) => {
  try {
    const { amountToInvest } = req.body;
    const { loanId } = req.params;

    if (typeof amountToInvest !== "number" || amountToInvest <= 0) {
      return res.status(400).json({ message: "Invalid investment amount." });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    // Validation: Don't allow over-investment
    if (loan.investedAmount + amountToInvest > loan.principalOpenEur) {
      return res
        .status(400)
        .json({ message: "Investment exceeds the total loan amount." });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId,
      { $inc: { investedAmount: amountToInvest } },
      { new: true }
    );

    res.json(updatedLoan);
  } catch (error) {
    console.error("Error investing in loan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update the status of all expired loans
// @route   POST /api/loans/update-statuses
export const updateExpiredLoans = (contract) => async (_req, res) => {
  try {
    const now = new Date();
    const loansToExpire = await Loan.find({
      loanLastDate: { $lte: now },
      status: "ACTIVE",
    });

    if (loansToExpire.length === 0) {
      return res.json({
        message: "No active loans have expired.",
        updatedCount: 0,
      });
    }

    let updatedCount = 0;
    for (const loan of loansToExpire) {
      try {
        const tx = await contract.setStatus(loan.classId, loan.nonceId, false);
        await tx.wait();
        await Loan.findByIdAndUpdate(loan._id, { $set: { status: "EXPIRED" } });
        updatedCount++;
      } catch (error) {
        console.error(
          `Failed to update on-chain status for loan ${loan.loanId}:`,
          error
        );
      }
    }

    res.json({
      message: "Loan statuses updated successfully.",
      updatedCount: updatedCount,
    });
  } catch (error) {
    console.error("Error updating loan statuses:", error);
    res.status(500).json({ message: "Server error" });
  }
};
