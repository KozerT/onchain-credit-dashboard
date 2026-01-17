import mongoose from "mongoose";
import Institution from "../models/Institution.js";
import Loan from "../models/Loan.js";

/**
 * Calculate dashboard statistics for an institution
 * @param {string|mongoose.Types.ObjectId} institutionId
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function getInstitutionStats(institutionId) {
  // Ensure institutionId is an ObjectId
  const institutionObjectId =
    typeof institutionId === "string"
      ? new mongoose.Types.ObjectId(institutionId)
      : institutionId;

  const loans = await Loan.aggregate([
    { $match: { institution: institutionObjectId } },
    {
      $facet: {
        all: [
          {
            $group: {
              _id: null,
              totalPortfolio: { $sum: "$principalOpenEur" },
              loanCount: { $sum: 1 },
            },
          },
        ],
        active: [
          { $match: { status: "ACTIVE" } },
          {
            $group: {
              _id: null,
              activeLoanCount: { $sum: 1 },
              totalActivePrincipal: { $sum: "$principalOpenEur" },
              weightedYield: {
                $sum: { $multiply: ["$yield", "$principalOpenEur"] },
              },
            },
          },
        ],
        defaulted: [
          { $match: { status: "DEFAULTED" } },
          { $count: "defaultedLoanCount" },
        ],
      },
    },
  ]);

  const stats = {
    totalPortfolio: 0,
    activeLoanCount: 0,
    avgYield: 0,
    defaultRate: 0,
    status: "PENDING",
  };

  if (loans.length > 0) {
    const allData = loans[0].all[0] || {};
    const activeData = loans[0].active[0] || {};
    const defaultedData = loans[0].defaulted[0] || {};

    const currentAUM = activeData.totalActivePrincipal || 0; // Active Assets Under Management
    const weightedYieldSum = activeData.weightedYield || 0;
    const historicalLoanCount = allData.loanCount || 0;
    const defaultedCount = defaultedData.defaultedLoanCount || 0;

    // UI "Total Portfolio" = Current Active Money (AUM)
    stats.totalPortfolio = currentAUM;

    // UI "Active Loans" = Count of currently active loans
    stats.activeLoanCount = activeData.activeLoanCount || 0;

    stats.avgYield = currentAUM > 0 ? weightedYieldSum / currentAUM : 0;

    // UI "Default Rate
    stats.defaultRate =
      historicalLoanCount > 0
        ? (defaultedCount / historicalLoanCount) * 100
        : 0;
  }

  // Fetch institution for creditRiskScore and status logic
  const institution = await Institution.findById(institutionId).lean();
  if (institution && typeof institution.creditRiskScore === "number") {
    if (institution.creditRiskScore > 80) stats.status = "VERIFIED";
    else if (institution.creditRiskScore < 50) stats.status = "PENDING";
    else stats.status = "ACTIVE";
  }

  return stats;
}
