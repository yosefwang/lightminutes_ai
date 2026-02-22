# Server Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create necessary directories for uploads and data
RUN mkdir -p /app/uploads /app/data

# Expose port (default is 8787 as per code)
EXPOSE 8787

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.js"]
