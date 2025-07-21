# Use Node.js LTS base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose port (match your backend port)
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
