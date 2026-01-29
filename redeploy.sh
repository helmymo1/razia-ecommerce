#!/bin/bash

# Stop existing containers
echo "🛑 Stopping Docker containers..."
docker compose down

# Update code from GitHub
echo "🔄 Updating code..."
git fetch
git reset --hard origin/main

# Rebuild and start containers
echo "🏗️ Rebuilding and starting services..."
docker compose up -d --build

# Cleanup unused images
echo "🧹 Cleaning up old images..."
docker image prune -f

# Logging
echo "✅ Fresh Deployment Complete"
