import fs from "fs";
import { ethers } from "hardhat";
import path from "path";

async function main() {
  // Get the contract factory and the deployer's address (signer)
  const LoanContract = await ethers.getContractFactory("LoanData3475");
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  // Deploy the contract
  const loanContract = await LoanContract.deploy();
  await loanContract.waitForDeployment();

  const contractAddress = await loanContract.getAddress();
  console.log(`LoanData3475 contract deployed to: ${contractAddress}`);

  // Prepare the contract information object
  const contractInfo = {
    address: contractAddress,
    admin: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
  };

  // Define the path to save the file (at the root of the hardhat package)
  const filePath = path.join(__dirname, "..", "contract-address.json");

  // Write the contract info to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(contractInfo, null, 2));

  console.log(`Contract address and admin info saved to ${filePath}`);
}

// Standard pattern to execute the async main function
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
