import { parse } from "csv-parse";
import fs from "fs";
import Institution from "../models/Institution.js";
import Loan from "../models/Loan.js";
import { getInstitutionStats } from "../services/institutionService.js";

// Default values for CSV loan uploads
const DEFAULT_LOAN_TYPE = "Business";
const INITIAL_LOAN_STATUS = "ACTIVE";
const INITIAL_INVESTED_AMOUNT = 0;

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
    // Fetch raw institutions ( .lean() for faster, plain JS objects)
    const institutions = await Institution.find({}).lean();
    // Calculate stats for EVERY institution in parallel
    const enrichedInstitutions = await Promise.all(
      institutions.map(async (inst) => {
        const stats = await getInstitutionStats(inst._id);
        // Explicitly select only safe, required fields to prevent data exposure
        return {
          _id: inst._id,
          name: inst.name,
          country: inst.country,
          foundingYear: inst.foundingYear,
          productType: inst.productType,
          // Merge the calculated stats explicitly
          totalPortfolio: stats.totalPortfolio,
          activeLoanCount: stats.activeLoanCount,
          avgYield: stats.avgYield,
          status: stats.status,
        };
      })
    );
    res.json(enrichedInstitutions);
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
          loanType: DEFAULT_LOAN_TYPE,
          principalOpenEur: Number(row.amount),
          url: row.url,
          status: INITIAL_LOAN_STATUS,
          investedAmount: INITIAL_INVESTED_AMOUNT,
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
    const stats = await getInstitutionStats(institutionId);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
