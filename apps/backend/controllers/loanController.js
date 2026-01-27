import Loan from "../models/Loan.js";
import Transaction from "../models/Transaction.js";

// @desc    Get a single loan by database _id
// @route   GET /api/loans/:id
export const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }
    res.json(loan);
  } catch (error) {
    console.error("Error fetching loan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// TODO: SECURITY - Add Authentication Middleware to verify session.
// TODO: SECURITY - Verify req.body.investorId matches the authenticated user.
// TODO: LOGIC - Check if investor has sufficient balance before processing.
// @desc    Invest in a specific loan (creates Transaction)
// @route   POST /api/loans/:id/invest
export const investInLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, investorId } = req.body;

    // Strict validation for investorId
    if (!investorId || typeof investorId !== "string" || investorId.trim() === "") {
      return res.status(400).json({ message: "Invalid investorId." });
    }

    // Strict validation for amount: must be a number, not NaN, finite, and > 0
    if (
      typeof amount !== "number" ||
      isNaN(amount) ||
      !isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({ message: "Invalid amount. Must be a positive number." });
    }

    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    const remainingAmount = loan.principalOpenEur - loan.investedAmount;
    if (amount > remainingAmount) {
      return res
        .status(400)
        .json({ message: "Not enough available to invest." });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      loanId: loan._id,
      investorId,
      amount,
      status: "completed",
    });

    // Increment investedAmount
    loan.investedAmount += amount;
    await loan.save();

    res.json({ loan, transactionId: transaction._id });
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
