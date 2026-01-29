# Stage 1: Build the React Application
FROM node:20-alpine as builder

WORKDIR /app

# Copy package.json from the frontend subdirectory (ignoring package-lock.json to avoid platform issues)
COPY ["razia user site/razia-chic-builder-main/package.json", "./"]

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY ["razia user site/razia-chic-builder-main", "."]

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx configuration
COPY ["razia user site/razia-chic-builder-main/nginx.conf", "/etc/nginx/conf.d/default.conf"]

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
