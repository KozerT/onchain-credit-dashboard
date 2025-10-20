import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import { contract } from "./config/ethersSetup.js";
import swaggerOptions from "./config/swagger.js";
import { institutionRoutes } from "./routes/institutionRoutes.js";
import { loanRoutes } from "./routes/loanRoutes.js";

// --- Application Setup ---
dotenv.config();
connectDB();

const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- Swagger API Documentation Setup ---
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});
// --- End Swagger Setup ---

// --- Routes ---
app.use("/api/institutions", institutionRoutes(contract));
app.use("/api/loans", loanRoutes(contract));

app.get("/", (_req, res) => {
  res.json({ message: "Backend API is running!" });
});

// Start the server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[backend]: Server is running at http://localhost:${PORT}`);
  console.log(
    `[backend]: API Docs available at http://localhost:${PORT}/api-docs`
  );
});
