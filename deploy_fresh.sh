#!/bin/bash
# =============================================================================
# FRESH DEPLOYMENT SCRIPT - Razia E-Commerce
# =============================================================================
# This script performs a clean deployment with database schema initialization.
# WARNING: This will DELETE all existing data in MySQL!
# =============================================================================

set -e  # Exit on any error

echo "🚀 Starting Fresh Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Confirmation prompt
echo -e "${RED}⚠️  WARNING: This will DELETE all existing MySQL data!${NC}"
read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

# Step 1: Stop all services
echo -e "${YELLOW}📦 Step 1/5: Stopping existing services...${NC}"
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Step 2: Remove MySQL volume (to trigger fresh init)
echo -e "${YELLOW}🗑️  Step 2/5: Removing MySQL data volume...${NC}"
docker volume rm $(docker volume ls -q | grep mysql_data) 2>/dev/null || echo "No existing MySQL volume found"

# Step 3: Pull latest images
echo -e "${YELLOW}📥 Step 3/5: Pulling latest images...${NC}"
docker compose -f docker-compose.prod.yml pull

# Step 4: Start all services
echo -e "${YELLOW}🚀 Step 4/5: Starting services...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Step 5: Wait for MySQL healthy status
echo -e "${YELLOW}⏳ Step 5/5: Waiting for MySQL to initialize (this may take 60-90 seconds)...${NC}"
sleep 10

# Check MySQL container health
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' razia_mysql 2>/dev/null || echo "starting")
    if [ "$HEALTH" = "healthy" ]; then
        echo -e "${GREEN}✅ MySQL is healthy!${NC}"
        break
    fi
    echo "   Waiting for MySQL... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

# Verify tables were created
echo -e "${YELLOW}🔍 Verifying database tables...${NC}"
TABLE_COUNT=$(docker exec razia_mysql mysql -uroot -pRaziaStore2024! -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'ebazer_shop';" -s -N 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -gt 10 ]; then
    echo -e "${GREEN}✅ Database initialized successfully! ($TABLE_COUNT tables created)${NC}"
else
    echo -e "${RED}❌ Database initialization may have failed. Only $TABLE_COUNT tables found.${NC}"
    echo "   Check logs: docker logs razia_mysql"
fi

# Show running containers
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker compose -f docker-compose.prod.yml ps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
