# Client Dockerfile - Multi-stage build

# Build stage
FROM node:18-alpine AS builder

# Accept build-time arguments
ARG VITE_CLERK_PUBLISHABLE_KEY

# Set environment variable for build
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app (environment variables will be injected at build time)
RUN npm run build

# Production stage with Nginx
FROM nginx:stable-alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
