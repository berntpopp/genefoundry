# syntax=docker/dockerfile:1.11@sha256:10c699f1b6c8bdc8f6b4ce8974855dd8542f1768c26eb240237b8f1c9c6c9976

# ============================================================================
# GeneFoundry Landing Page - Production Dockerfile
# Multi-stage build: Node.js build → nginx with Brotli runtime
# ============================================================================

# fholzer/nginx-brotli includes brotli_static and gzip_static modules
ARG APP_VERSION=0.0.0
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown

# ============================================================================
# STAGE 1: Dependencies - Install node_modules with cache
# ============================================================================
FROM node:26-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3 AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies including devDependencies (needed for build)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# ============================================================================
# STAGE 2: Builder - Build static site with pre-compressed assets
# ============================================================================
FROM node:26-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3 AS builder

WORKDIR /app

# Set base URL for Docker deployment (not GitHub Pages)
ENV VITE_BASE_URL=/

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Build and validate final static HTML without a browser, then generate compression sidecars.
RUN npm run build

# ============================================================================
# STAGE 3: Runtime - nginx with Brotli serving pre-compressed static files
# ============================================================================
FROM fholzer/nginx-brotli:v1.31.3@sha256:e1e3c88f7df467e7c7d67dd4e167c6ef05f8cca819e2c9617f932f2cb628b140 AS runtime

ARG APP_VERSION
ARG VCS_REF
ARG BUILD_DATE

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="GeneFoundry Landing Page" \
      org.opencontainers.image.description="Modular registry for trustworthy genomic AI analysis" \
      org.opencontainers.image.vendor="GeneFoundry" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/berntpopp/genefoundry" \
      org.opencontainers.image.documentation="https://github.com/berntpopp/genefoundry/blob/main/README.md" \
      org.opencontainers.image.authors="Bernt Popp <bernt.popp@gmail.com>" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}"

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
    CMD ["wget", "-qO-", "http://127.0.0.1:8080/health"]

# Expose port
EXPOSE 8080

# Start nginx (entrypoint is already 'nginx' in base image)
CMD ["-g", "daemon off;"]
