# Step 1: Start from an official Node.js image.
FROM node:18-alpine

# Step 2: Set the working directory inside the container.
WORKDIR /app

# Copy the root package files first for workspace awareness
COPY package*.json ./
COPY turbo.json ./

# Step 3: Copy the backend package.json and package-lock.json files.
COPY apps/backend/package*.json ./apps/backend/

# Step 4: Install the application dependencies.
RUN cd apps/backend && npm install

# Step 5: Copy the backend application code into the container.
COPY apps/backend/ ./apps/backend/

# Step 6: Expose the port that the application will run on.
EXPOSE 3001

# Step 7: Define the command to start the application.
CMD [ "npm", "start", "--prefix", "apps/backend" ]