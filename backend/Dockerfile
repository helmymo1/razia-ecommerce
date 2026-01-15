# Base Image
FROM node:18-alpine

# Working Directory
WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Source Code
COPY . .

# Expose Port
EXPOSE 5000

# Environment Variable defaults (Override in your deployment)
ENV PORT=5000
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node scripts/db_health_check.js || exit 1

# Start Server
CMD ["npm", "start"]
