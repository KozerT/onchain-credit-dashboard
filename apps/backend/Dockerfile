# Step 1: Start from an official Node.js image.
FROM node:18-alpine

# Step 2: Set the working directory inside the container.
WORKDIR /app

# Step 3: Copy the backend package.json and package-lock.json files.
COPY apps/backend/package*.json ./

# Step 4: Install the application dependencies.
RUN npm install

# Step 5: Copy the backend application code into the container.
COPY apps/backend/ .

# Step 6: Expose the port that the application will run on.
EXPOSE 3001

# Step 7: Define the command to start the application.
CMD [ "npm", "start" ]