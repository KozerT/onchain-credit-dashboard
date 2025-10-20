import express from "express";
import multer from "multer";
import {
  createInstitution,
  getAllInstitutions,
  getDashboardSummary,
  getInstitutionLoans,
  uploadLoanCSV,
} from "../controllers/institutionController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

export const institutionRoutes = (contract) => {
  router.route("/").post(createInstitution).get(getAllInstitutions);
  router
    .route("/:institutionId/upload")
    .post(upload.single("file"), uploadLoanCSV(contract));
  router.route("/:institutionId/loans").get(getInstitutionLoans);
  router.route("/dashboard/:institutionId").get(getDashboardSummary);

  return router;
};
