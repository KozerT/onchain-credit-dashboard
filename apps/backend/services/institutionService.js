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
    const all = loans[0].all[0] || {};
    const active = loans[0].active[0] || {};
    const defaulted = loans[0].defaulted[0] || {};

    stats.totalPortfolio = all.totalPortfolio || 0;
    stats.activeLoanCount = active.activeLoanCount || 0;
    const totalActivePrincipal = active.totalActivePrincipal || 0;
    stats.avgYield =
      totalActivePrincipal > 0
        ? (active.weightedYield || 0) / totalActivePrincipal
        : 0;

    const totalLoans = all.loanCount || 0;
    const defaultedLoanCount = defaulted.defaultedLoanCount || 0;
    stats.defaultRate =
      totalLoans > 0 ? (defaultedLoanCount / totalLoans) * 100 : 0;
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
