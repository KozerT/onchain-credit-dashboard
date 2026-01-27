console.log("1. Starting server process...");

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import swaggerOptions from "./config/swagger.js";
import { institutionRoutes } from "./routes/institutionRoutes.js";
import { loanRoutes } from "./routes/loanRoutes.js";

console.log("1a. Imports loaded, setting up environment...");

// --- Application Setup ---
dotenv.config();

console.log("2. Attempting DB Connection...");
await connectDB();
console.log("3. DB Connected");

console.log("4. Setting up Ethers...");
const setupEthers = (await import("./config/ethersSetup.js")).default;
const { contract } = await setupEthers();
console.log("4a. Ethers setup complete");

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

console.log("5. Starting Express Listener...");
app.listen(PORT, () => {
  console.log(`6. Server running on port ${PORT}`);
});
