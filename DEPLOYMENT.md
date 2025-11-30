# GeneFoundry Deployment Guide

This guide covers deploying GeneFoundry on a VPS with Nginx Proxy Manager (NPM) and self-hosted Plausible Analytics.

## Prerequisites

- **VPS Requirements:**
  - 4GB RAM minimum (2GB for Plausible, 256MB for GeneFoundry)
  - 2 vCPU
  - 40GB SSD
  - Ubuntu 22.04+ or Debian 12+

- **Software:**
  - Docker Engine 24+
  - Docker Compose v2
  - Nginx Proxy Manager (already running)

## Architecture

```
Internet → NPM (SSL) → genefoundry:8080 (static site)
                   → plausible:8000 (analytics)
```

## Quick Start

### 1. Clone and Configure GeneFoundry

```bash
# Clone the repository
git clone https://github.com/berntpopp/genefoundry.git
cd genefoundry

# Create environment file
cp .env.docker.example .env.docker

# Edit with your NPM network name (check with: docker network ls)
nano .env.docker
```

### 2. Build and Start

```bash
# Build and start with NPM integration
docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml up -d --build

# Check status
docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml ps

# View logs
docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml logs -f
```

### 3. Configure NPM Proxy Host

In Nginx Proxy Manager admin panel:

1. **Add Proxy Host:**
   - Domain: `genefoundry.org` (and `www.genefoundry.org`)
   - Forward Hostname: `genefoundry-npm`
   - Forward Port: `8080`
   - Enable WebSocket Support: No (not needed)

2. **SSL Tab:**
   - Request new SSL certificate
   - Enable Force SSL
   - Enable HTTP/2

3. **Advanced Tab** (optional):
   ```nginx
   # Additional security headers (most are already in container nginx.conf)
   proxy_hide_header X-Powered-By;
   ```

## Self-Hosted Plausible Analytics

### 1. Clone Plausible Community Edition

```bash
# Clone specific version
git clone -b v3.1.0 --single-branch https://github.com/plausible/community-edition plausible-ce
cd plausible-ce
```

### 2. Generate Secret Key

```bash
openssl rand -base64 48
```

### 3. Configure Environment

Create/edit `plausible-conf.env`:

```env
BASE_URL=https://plausible.genefoundry.org
SECRET_KEY_BASE=<your-generated-secret>
TOTP_VAULT_KEY=<another-generated-secret>
```

### 4. Add NPM Network

Edit `docker-compose.yml` to add the NPM network:

```yaml
services:
  plausible:
    # ... existing config ...
    networks:
      - default
      - npm_default

networks:
  npm_default:
    external: true
```

### 5. Start Plausible

```bash
docker compose up -d
```

### 6. Configure NPM for Plausible

1. **Add Proxy Host:**
   - Domain: `plausible.genefoundry.org`
   - Forward Hostname: `plausible`
   - Forward Port: `8000`

2. **SSL Tab:**
   - Request new SSL certificate
   - Enable Force SSL

### 7. Create Admin Account

Visit `https://plausible.genefoundry.org` and create your admin account.

## Local Development

For local testing without NPM:

```bash
# Start with exposed port
docker compose -f docker/docker-compose.yml up --build

# Access at http://localhost:8080
```

## Makefile Commands

```bash
make docker-build   # Build Docker image
make docker-up      # Start with NPM compose
make docker-down    # Stop containers
make docker-logs    # View logs
make docker-shell   # Shell into container
```

## Updating

### GeneFoundry

```bash
cd genefoundry
git pull
docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml up -d --build
```

### Plausible

```bash
cd plausible-ce
git fetch --tags
git checkout v3.x.x  # new version
docker compose pull
docker compose up -d
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml logs genefoundry

# Check if port is in use
netstat -tlnp | grep 8080
```

### NPM can't reach container

```bash
# Verify network connection
docker network ls
docker network inspect npm_default

# Check container is on the network
docker inspect genefoundry-npm | grep -A 20 Networks
```

### Plausible not tracking

1. Check browser console for script loading errors
2. Verify domain matches `data-domain` attribute
3. Check Plausible container logs

## Security Notes

- **No direct port exposure**: All traffic goes through NPM
- **Non-root containers**: nginx runs as UID 101
- **Read-only filesystem**: Container filesystem is immutable
- **Resource limits**: Prevents DoS via resource exhaustion
- **Security headers**: OWASP recommended headers enabled

## Resource Usage

| Component | RAM | CPU | Disk |
|-----------|-----|-----|------|
| GeneFoundry | 64-128MB | 0.1-0.5 | ~50MB |
| Plausible | 512MB | 0.5 | 100MB |
| PostgreSQL | 256MB | 0.25 | 500MB |
| ClickHouse | 1-2GB | 0.5 | 1GB+ |
