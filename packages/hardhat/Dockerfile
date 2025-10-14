# Start from the official Node.js 18 image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Enable Corepack to enforce the correct package manager version
RUN corepack enable

# Copy package.json files first for better Docker layer caching
COPY package*.json ./
COPY turbo.json ./

# Copy workspace package.json files with specific paths
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/hardhat/package.json ./packages/hardhat/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN npm install

# Copy the rest of the monorepo source code
COPY . .

# Expose the port the Hardhat node runs on
EXPOSE 8545

# The command to start the Hardhat node will be provided by docker-compose
CMD ["sh", "./packages/hardhat/entrypoint.sh"]
