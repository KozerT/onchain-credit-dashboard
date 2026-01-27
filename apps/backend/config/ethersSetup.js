import { ethers, JsonRpcProvider, Wallet } from "ethers";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Ethers.js & Blockchain Setup ---

const setupEthers = async () => {
  console.log("[ethersSetup] Starting Ethers setup...");

  const dockerPath = "/app/contract-address.json";

  const localPath = path.join(
    __dirname,
    "../../../packages/hardhat/contract-address.json"
  );

  const contractInfoPath = fs.existsSync(dockerPath) ? dockerPath : localPath;

  if (!fs.existsSync(contractInfoPath)) {
    console.error(
      `[backend]: contract-address.json not found. Looked in ${dockerPath} and ${localPath}. Please deploy the contract first.`
    );
    process.exit(1);
  }
  const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, "utf8"));
  console.log("[ethersSetup] Contract info loaded");

  // Use the environment variable for the provider URL
  const providerUrl = process.env.HARDHAT_PROVIDER_URL;
  if (!providerUrl) {
    console.error(
      "[backend]: HARDHAT_PROVIDER_URL environment variable not set!"
    );
    process.exit(1);
  }

  console.log("[ethersSetup] Initializing provider with URL:", providerUrl);
  let provider;
  try {
    provider = new JsonRpcProvider(providerUrl);
    // Test the provider connection with a timeout
    console.log("[ethersSetup] Testing provider connection...");
    const testConnection = Promise.race([
      provider.getBlockNumber(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Provider connection timeout after 5s")), 5000)
      ),
    ]);
    const blockNumber = await testConnection;
    console.log(`[ethersSetup] Provider connected successfully. Current block: ${blockNumber}`);
  } catch (error) {
    console.error(`[ethersSetup] Provider connection failed: ${error.message}`);
    process.exit(1);
  }

  // Read private keys from environment
  const privateKeysString = process.env.HARDHAT_PRIVATE_KEYS;
  if (!privateKeysString) {
    console.error(
      "[backend]: HARDHAT_PRIVATE_KEYS environment variable not set!"
    );
    process.exit(1);
  }
  const HARDHAT_KEYS = privateKeysString.split(",");
  console.log("[ethersSetup] Private keys loaded");

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
  console.log("[ethersSetup] Admin key found");

  const wallet = new Wallet(adminKey, provider);

  const abi = [
    "function createLoan(uint256,uint256,string) external",
    "function setStatus(uint256,uint256,bool) external",
    "function getLoan(uint256,uint256) view returns(string,bool)",
  ];

  const contract = new ethers.Contract(contractInfo.address, abi, wallet);
  console.log("[ethersSetup] Contract instance created");

  return { contract, contractInfo, provider };
};

// Export async setup function
export default setupEthers;
