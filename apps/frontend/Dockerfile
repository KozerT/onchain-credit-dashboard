# STAGE 1: The "Builder" stage
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Enable the package manager enforcer
RUN corepack enable

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY turbo.json ./

# Copy workspace package.json files
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Install all dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build command for the frontend only
RUN npm run build --filter=frontend


# STAGE 2: The "Runner" stage
FROM node:18-slim AS runner

# Set the working directory
WORKDIR /app

# Copy the standalone output from the builder stage.
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

# Expose the port that the Next.js server will run on
EXPOSE 3000

# Set an environment variable to disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# The command to start the production server
CMD ["node", "apps/frontend/server.js"]
