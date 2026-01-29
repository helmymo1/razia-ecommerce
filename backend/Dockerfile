# =============================================================================
# BACKEND DOCKERFILE - Production Multi-Stage Build
# =============================================================================
# Image: ghcr.io/<owner>/<repo>/backend:latest
# =============================================================================

# Stage 1: Builder
FROM node:18-alpine AS builder

LABEL org.opencontainers.image.source="https://github.com/helmymo1/razia-ecommerce"
LABEL org.opencontainers.image.description="Razia Store Backend API"

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source code
COPY . .

# -----------------------------------------------------------------------------
# Stage 2: Production Runner
# -----------------------------------------------------------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Security: Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Copy only necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app .

# Switch to non-root user
USER nodejs

# Health check - verify API responds
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

EXPOSE 5000

CMD ["npm", "start"]
