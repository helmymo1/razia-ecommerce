# Phase 1: Containerizing the Frontend (Store)
# File: razia user site/razia-chic-builder-main/Dockerfile
# Note: This is mapped from "store/Dockerfile"

# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Web Server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (internal to container)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
