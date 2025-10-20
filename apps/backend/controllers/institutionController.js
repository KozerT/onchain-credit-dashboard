import { parse } from "csv-parse";
import fs from "fs";
import mongoose from "mongoose";
import Institution from "../models/Institution.js";
import Loan from "../models/Loan.js";

//  The 'contract' object will be imported from index.js later
// For now, we assume it will be available when these functions are called.

// @desc    Create a new institution
// @route   POST /api/institutions
export const createInstitution = async (req, res) => {
  try {
    const newInstitution = new Institution(req.body);
    const savedInstitution = await newInstitution.save();
    res.status(201).json(savedInstitution);
  } catch (error) {
    console.error("Error creating institution:", error);
    res
      .status(500)
      .json({ message: "Server error while creating institution." });
  }
};

// @desc    Get all institutions
// @route   GET /api/institutions
export const getAllInstitutions = async (_req, res) => {
  try {
    const institutions = await Institution.find({});
    res.json(institutions);
  } catch (error) {
    console.error("Error fetching institutions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Upload CSV of loans for an institution
// @route   POST /api/institutions/:institutionId/upload
export const uploadLoanCSV = (contract) => async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.institutionId);
    if (!institution) {
      return res.status(404).send("Institution not found");
    }

    const content = fs.readFileSync(req.file.path);
    parse(content, { columns: true }, async (err, rows) => {
      if (err) {
        fs.unlinkSync(req.file.path);
        return res.status(500).send(err.message);
      }

      const loansToCreate = [];
      const onChainErrors = [];

      for (const row of rows) {
        let expirationDate;
        const csvDate = new Date(row.loan_last_date);

        if (row.loan_last_date && !isNaN(csvDate.getTime())) {
          expirationDate = csvDate;
        } else {
          console.warn(
            `Invalid or missing loan_last_date for loanId ${row.loanId}. Using default 30-day expiration.`
          );
          expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
        }

        const loanDate =
          row.loan_date && !isNaN(new Date(row.loan_date).getTime())
            ? new Date(row.loan_date)
            : new Date();

        try {
          await contract.createLoan(
            Number(row.classId),
            Number(row.nonceId),
            row.url
          );
        } catch (e) {
          console.error("On-chain error:", e.message);
          onChainErrors.push(row.loanId);
          continue;
        }

        loansToCreate.push({
          institution: institution._id,
          loanId: row.loanId,
          classId: Number(row.classId),
          nonceId: Number(row.nonceId),
          loanType: "Business",
          principalOpenEur: Number(row.amount),
          url: row.url,
          status: "ACTIVE",
          investedAmount: 0,
          loanDate: loanDate,
          loanLastDate: expirationDate,
        });
      }

      if (loansToCreate.length > 0) {
        await Loan.insertMany(loansToCreate);
      }

      fs.unlinkSync(req.file.path);
      res.status(201).json({
        message: `CSV for ${institution.name} processed.`,
        savedToDB: loansToCreate.length,
        onChainErrors: onChainErrors,
      });
    });
  } catch (error) {
    console.error("Error during CSV upload:", error);
    res.status(500).send("Server error during file upload.");
  }
};

// @desc    Get all loans for a specific institution
// @route   GET /api/institutions/:institutionId/loans
export const getInstitutionLoans = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const loans = await Loan.find({ institution: institutionId });
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans for institution:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get dashboard summary for an institution
// @route   GET /api/dashboard/:institutionId
export const getDashboardSummary = async (req, res) => {
  try {
    const { institutionId } = req.params;

    const summaryResult = await Loan.aggregate([
      {
        $match: {
          institution:
            mongoose.Types.ObjectId.createFromHexString(institutionId),
        },
      },
      {
        $group: {
          _id: null,
          totalLoanAmount: { $sum: "$principalOpenEur" },
          totalInvestedAmount: { $sum: "$investedAmount" },
          numberOfLoans: { $sum: 1 },
        },
      },
    ]);

    const institutionProfile = await Institution.findById(institutionId);
    if (!institutionProfile) {
      return res.status(404).json({ message: "Institution not found" });
    }
    const summary = summaryResult[0] || {
      totalLoanAmount: 0,
      totalInvestedAmount: 0,
      numberOfLoans: 0,
    };

    summary.investmentPercentage =
      summary.totalLoanAmount > 0
        ? (summary.totalInvestedAmount / summary.totalLoanAmount) * 100
        : 0;

    const dashboardData = {
      institution: institutionProfile,
      summary: summary,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
