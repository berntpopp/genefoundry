# syntax=docker/dockerfile:1.11

# ============================================================================
# GeneFoundry Landing Page - Production Dockerfile
# Multi-stage build: Node.js build → nginx-unprivileged runtime
# ============================================================================

ARG NODE_VERSION=20-alpine3.20
ARG NGINX_VERSION=1.27-alpine3.20-slim

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
# STAGE 2: Builder - Build static site
# ============================================================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Build production static files
RUN npm run build && \
    # Verify dist directory was created
    ls -la dist/ && \
    # Show build size
    du -sh dist/

# ============================================================================
# STAGE 3: Runtime - nginx-unprivileged serving static files
# ============================================================================
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runtime

# Metadata labels (OCI standard)
LABEL org.opencontainers.image.title="GeneFoundry Landing Page" \
      org.opencontainers.image.description="Modular registry for trustworthy genomic AI analysis" \
      org.opencontainers.image.vendor="GeneFoundry" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/berntpopp/genefoundry" \
      org.opencontainers.image.documentation="https://github.com/berntpopp/genefoundry/blob/main/README.md" \
      org.opencontainers.image.authors="Bernt Popp <bernt.popp@gmail.com>"

# Copy nginx configuration (as nginx user)
COPY --chown=nginx:nginx docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application (as nginx user)
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# Remove default configs (need root temporarily)
USER root
RUN rm -f /etc/nginx/conf.d/*.conf.default && \
    # Verify files were copied
    ls -la /usr/share/nginx/html/
USER nginx

# Health check (nginx-unprivileged runs on 8080)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose non-privileged port
EXPOSE 8080

# Start nginx (runs as non-root user 'nginx' UID 101)
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
