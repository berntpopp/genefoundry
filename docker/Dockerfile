# syntax=docker/dockerfile:1.11

# ============================================================================
# GeneFoundry Landing Page - Production Dockerfile
# Multi-stage build: Node.js build → nginx with Brotli runtime
# ============================================================================

ARG NODE_VERSION=20-alpine3.20
# fholzer/nginx-brotli includes brotli_static and gzip_static modules
ARG NGINX_VERSION=v1.28.0

# ============================================================================
# STAGE 1: Dependencies - Install node_modules with cache
# ============================================================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies including devDependencies (needed for build)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# ============================================================================
# STAGE 2: Builder - Build static site with pre-compressed assets
# ============================================================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Set base URL for Docker deployment (not GitHub Pages)
ENV VITE_BASE_URL=/

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Build production static files (generates .br and .gz files)
RUN npm run build && \
    echo "=== Build output ===" && \
    ls -la dist/ && \
    echo "=== Compressed files ===" && \
    find dist \( -name "*.br" -o -name "*.gz" \) -print && \
    echo "=== Total size ===" && \
    du -sh dist/

# ============================================================================
# STAGE 3: Runtime - nginx with Brotli serving pre-compressed static files
# ============================================================================
FROM fholzer/nginx-brotli:${NGINX_VERSION} AS runtime

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="GeneFoundry Landing Page" \
      org.opencontainers.image.description="Modular registry for trustworthy genomic AI analysis" \
      org.opencontainers.image.vendor="GeneFoundry" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/berntpopp/genefoundry" \
      org.opencontainers.image.documentation="https://github.com/berntpopp/genefoundry/blob/main/README.md" \
      org.opencontainers.image.authors="Bernt Popp <bernt.popp@gmail.com>"

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application with pre-compressed files
COPY --from=builder /app/dist /usr/share/nginx/html

# Update Alpine packages to patch CVEs, set permissions, and clean up
RUN apk update && apk upgrade --no-cache && \
    rm -rf /var/cache/apk/* && \
    chmod -R 755 /usr/share/nginx/html

# Health check (using wget since curl isn't in Alpine base)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health || exit 1

# Expose port
EXPOSE 8080

# Start nginx (entrypoint is already 'nginx' in base image)
CMD ["-g", "daemon off;"]
