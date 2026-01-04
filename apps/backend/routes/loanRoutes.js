import express from "express";
import {
  getLoanById,
  investInLoan,
  updateExpiredLoans,
} from "../controllers/loanController.js";

const router = express.Router();

export const loanRoutes = (contract) => {
  router.route("/:id").get(getLoanById);
  router.route("/:id/invest").post(investInLoan); // POST for invest
  router.route("/update-statuses").post(updateExpiredLoans(contract));
  return router;
};
