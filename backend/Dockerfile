# Phase 1: Containerizing the Backend
# File: backend/Dockerfile

# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build/test tools if needed in future)
# or stick to production for leaner build
RUN npm ci

# Copy source code
COPY . .

# Stage 2: Production Runner
FROM node:18-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Assign ownership to the non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
