#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Start the Hardhat node in the background
npx --workspace=hardhat hardhat node --hostname 0.0.0.0 &

# Wait for the node to be ready. We'll give it a few seconds.
echo "Waiting for Hardhat node to start..."
sleep 5

# Deploy the contract
echo "Deploying contract..."
npx --workspace=hardhat hardhat run scripts/deploy.ts --network localhost

# Now, bring the background Hardhat node process to the foreground
# so the container doesn't exit.
wait