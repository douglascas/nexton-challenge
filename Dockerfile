# Stage 1: Build the Angular application
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build production bundle
RUN npm run build -- --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for Angular SPA routing & gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled application assets from build stage
COPY --from=build /app/dist/nexton-challenge/browser /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
