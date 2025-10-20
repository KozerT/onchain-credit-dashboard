import express from "express";
import {
  investInLoan,
  updateExpiredLoans,
} from "../controllers/loanController.js";

const router = express.Router();

export const loanRoutes = (contract) => {
  router.route("/:loanId/invest").patch(investInLoan);
  router.route("/update-statuses").post(updateExpiredLoans(contract));
  return router;
};
