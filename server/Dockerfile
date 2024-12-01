# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the Node.js backend source code
COPY . .

# Expose the backend port
EXPOSE 8000

# Start the Node.js server
CMD ["npm", "run", "dev"]
