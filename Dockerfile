# Stage 1: Build React Frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy Frontend Source
COPY "razia user site/razia-chic-builder-main/package*.json" ./
RUN npm ci

COPY "razia user site/razia-chic-builder-main/" ./
RUN npm run build

# Stage 2: Setup Node.js Backend Server
FROM node:18-alpine

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy Backend Dependencies and Install
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Copy Backend Source Code
COPY backend/ ./

# Copy Built Frontend Assets from Stage 1 to Backend's 'public' folder
COPY --from=builder /app/dist ./public

# Copy Root Configs
COPY ecosystem.config.js /app/

# Expose Port
EXPOSE 5000

# Start Application
CMD ["pm2-runtime", "start", "/app/ecosystem.config.js"]
