#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Change to the hardhat workspace directory
cd /app/packages/hardhat

# Start the Hardhat node in the background
npm run node &

# Wait for the node to be ready. We'll give it a few seconds.
echo "Waiting for Hardhat node to start..."
sleep 5

# Deploy the contract
echo "Deploying contract..."
npm run deploy

# Now, bring the background Hardhat node process to the foreground
# so the container doesn't exit.
wait