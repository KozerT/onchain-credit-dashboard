import cors from "cors";
import dotenv from "dotenv";
import { ethers, JsonRpcProvider, Wallet } from "ethers";
import express from "express";
import fs from "fs";
import path from "path";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- Ethers.js & Blockchain Setup ---

const contractInfoPath = path.resolve("/app/contract-address.json");
const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, "utf8"));

const provider = new JsonRpcProvider(process.env.HARDHAT_PROVIDER_URL);

const privateKeysString = process.env.HARDHAT_PRIVATE_KEYS;

if (!privateKeysString) {
  console.error(
    "[backend]: HARDHAT_PRIVATE_KEYS environment variable not set!"
  );
  process.exit(1);
}

const HARDHAT_KEYS = privateKeysString.split(",");

const adminKey = HARDHAT_KEYS.find((key) => {
  const tempWallet = new Wallet(key);
  return tempWallet.address.toLowerCase() === contractInfo.admin.toLowerCase();
});

if (!adminKey) {
  console.error(
    "[backend]: Could not find private key for admin address:",
    contractInfo.admin
  );
  process.exit(1);
}

const wallet = new Wallet(adminKey, provider);

const abi = [
  "function createLoan(uint256,uint256,string) external",
  "function setStatus(uint256,uint256,bool) external",
  "function getLoan(uint256,uint256) view returns(string,bool)",
];

const contract = new ethers.Contract(contractInfo.address, abi, wallet);

contract.getAddress().then((address) => {
  console.log(`[backend]: Ethers.js connected to contract at ${address}`);
});

// --- End Ethers.js Setup ---

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running!" });
});

app.get("/api/contract-info", async (req, res) => {
  res.json({
    address: await contract.getAddress(),
    admin: contractInfo.admin,
    providerUrl: process.env.HARDHAT_PROVIDER_URL,
  });
});

// Start the server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[backend]: Server is running at http://localhost:${PORT}`);
});
