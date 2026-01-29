# =============================================================================
# FRONTEND DOCKERFILE - Production Multi-Stage Build
# =============================================================================
# Image: ghcr.io/<owner>/<repo>/frontend:latest
# =============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

LABEL org.opencontainers.image.source="https://github.com/helmymo1/razia-ecommerce"
LABEL org.opencontainers.image.description="Razia Store Frontend"

WORKDIR /app

# Copy package files first (layer caching optimization)
COPY ["razia user site/razia-chic-builder-main/package.json", "./"]
COPY ["razia user site/razia-chic-builder-main/package-lock.json", "./"]

# Install dependencies with clean install
RUN npm ci --omit=dev || npm install

# Copy source code
COPY ["razia user site/razia-chic-builder-main", "."]

# Ensure .env.production is present for Vite build
COPY ["razia user site/razia-chic-builder-main/.env.production", "./.env.production"]

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Nginx Server
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Security: Create non-root user
RUN addgroup -S nginx-group && adduser -S nginx-user -G nginx-group

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (fallback to default if not exists)
COPY ["razia user site/razia-chic-builder-main/nginx.conf", "/etc/nginx/conf.d/default.conf"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
