import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running!" });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[backend]: Server is running at http://localhost:${PORT}`);
});
