import { ethers, JsonRpcProvider, Wallet } from "ethers";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Ethers.js & Blockchain Setup ---

const dockerPath = "/app/contract-address.json";

const localPath = path.join(
  __dirname,
  "../../../packages/contract/contract-address.json"
);

const contractInfoPath = fs.existsSync(dockerPath) ? dockerPath : localPath;

if (!fs.existsSync(contractInfoPath)) {
  console.error(
    `[backend]: contract-address.json not found. Looked in ${dockerPath} and ${localPath}. Please deploy the contract first.`
  );
  process.exit(1);
}
const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, "utf8"));

// Use the environment variable for the provider URL
const providerUrl = process.env.HARDHAT_PROVIDER_URL;
if (!providerUrl) {
  console.error(
    "[backend]: HARDHAT_PROVIDER_URL environment variable not set!"
  );
  process.exit(1);
}
const provider = new JsonRpcProvider(providerUrl);

// Read private keys from environment
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

// Export the contract instance and other details if needed elsewhere
export { contract, contractInfo, provider };
