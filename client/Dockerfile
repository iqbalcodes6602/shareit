# client/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the React app source code
COPY . .

# Expose port for React dev server
EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
