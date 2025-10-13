# Start from the official Node.js 18 image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Enable Corepack to enforce the correct package manager version
RUN corepack enable

# Copy only the necessary package manager files first to leverage Docker's cache
COPY package*.json ./
COPY turbo.json ./

# Install all dependencies for the entire monorepo
RUN npm install

# Copy the rest of the monorepo source code
COPY . .

# Expose the port the Hardhat node runs on
EXPOSE 8545

# The command to start the Hardhat node will be provided by docker-compose
CMD ["npx", "--workspace=hardhat", "hardhat", "node", "--hostname", "0.0.0.0"]
