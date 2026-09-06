# VPS Setup Guide

Deploy GeneFoundry on a VPS with Nginx Proxy Manager.

## Prerequisites

- [ ] VPS with 4GB RAM, 2 vCPU (Hetzner CX22 or similar)
- [ ] Ubuntu 22.04+ or Debian 12+
- [ ] Domain pointing to VPS IP (`genefoundry.org`)
- [ ] SSH access to VPS

---

## Step 1: Install Docker

SSH into your VPS and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker --version
```

---

## Step 2: Set Up Nginx Proxy Manager

```bash
# Create NPM directory
mkdir -p ~/npm && cd ~/npm

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    networks:
      - npm_default

networks:
  npm_default:
    name: npm_default
EOF

# Start NPM
docker compose up -d
```

**Access NPM Admin:**

- URL: `http://YOUR_VPS_IP:81`
- Email: `admin@example.com`
- Password: `changeme`

Change these credentials immediately after first login.

---

## Step 3: Deploy GeneFoundry

```bash
# Clone repository
cd ~
git clone https://github.com/berntpopp/genefoundry.git
cd genefoundry

# Create environment file
cp .env.docker.example .env.docker
# Replace <64-lowercase-hex-digest> with the SHA-256 value from the attested
# application release manifest. Mutable tags and arbitrary image names are not
# production inputs.
$EDITOR .env.docker

# Validate .env.docker, then pull and start the exact released image.
# Production never builds on the VPS.
make docker-up
```

Verify it's running:

```bash
docker ps | grep genefoundry
```

---

## Step 4: Configure NPM Proxy Host

1. Open NPM admin panel (`http://YOUR_VPS_IP:81`)
2. Go to **Proxy Hosts** → **Add Proxy Host**

**Details tab:**

| Field                 | Value                                    |
| --------------------- | ---------------------------------------- |
| Domain Names          | `genefoundry.org`, `www.genefoundry.org` |
| Scheme                | `http`                                   |
| Forward Hostname      | `genefoundry-npm`                        |
| Forward Port          | `8080`                                   |
| Block Common Exploits | ✓                                        |

**SSL tab:**

| Field                   | Value                         |
| ----------------------- | ----------------------------- |
| SSL Certificate         | Request a new SSL Certificate |
| Force SSL               | ✓                             |
| HTTP/2 Support          | ✓                             |
| Email for Let's Encrypt | your@email.com                |

3. Click **Save**

---

## Step 5: Verify Deployment

- [ ] Visit `https://genefoundry.org` - site loads
- [ ] Check for padlock icon (SSL working)
- [ ] Test health endpoint: `curl https://genefoundry.org/health`

---

## Updating

```bash
cd ~/genefoundry
git pull
# Update GENEFOUNDRY_IMAGE_SHA256 to the newly attested digest first.
make docker-up
```

---

## Troubleshooting

**Container not starting?**

```bash
docker logs genefoundry-npm
```

**NPM can't reach container?**

```bash
# Check network
docker network inspect npm_default | grep genefoundry
```

**SSL not working?**

- Ensure DNS A record points to VPS IP
- Wait 5 minutes for DNS propagation
- Check NPM logs: `docker logs npm`

---

## Security Notes

Production accepts only the 64-character digest for the fixed
`ghcr.io/berntpopp/genefoundry` repository. `make docker-up` loads and validates
`.env.docker`; it rejects tags, arbitrary image names, and malformed digests.
Do not rebuild on the VPS.

Run local security checks before deploying:

```bash
make pre-commit      # Full check: lint + type-check + security + build
```

## Modernized static-site delivery contract

The frontend builds 36 public content pages plus a separate error document using Node 24. Build and validate both deployment targets with `npm run build:matrix`; use `VITE_BASE_URL=/ npm run build` for the production container or `VITE_BASE_URL=/genefoundry/ npm run build` for the GitHub Pages mirror. Only `dist/` enters the runtime image. The builder includes the private sanitized execution-verification ledger so a claimed verified recipe cannot bypass evidence checks; neither that ledger nor its evidence is published.

The frontend nginx serves directory index pages and genuine HTTP 404 responses for unknown documents/assets. Every public page except `/` is a directory, so a request without the trailing slash gets nginx's own 301; `absolute_redirect off` keeps that `Location` a bare path. Leave it off. An absolute redirect is rebuilt from the container's own `server_name` and listen port, which behind the proxy sends visitors to `http://<host>:8080/...` — neither the public scheme nor a reachable port. Its exact `/health` response measures only this static container. HTML, service workers, manifests and changing unhashed assets revalidate; fingerprinted assets may be cached immutably. The build renders HTML before calculating worker revisions and generates Brotli/gzip sidecars last.

Before an authorized release, the edge operator must record and preserve the existing routes for `/mcp`, `/authorize`, `/token`, `/register`, `/consent`, `/auth/`, `/.well-known/`, `/health`, `/metrics`, `/docs`, `/redoc` and `/openapi.json`. The frontend repository does not establish those upstream destinations; do not route those paths to static homepage HTML. Validate read-only routing before and after release, then complete a real client sign-in/query using an authorized account. A frontend health response or copied endpoint is not evidence of successful gateway authentication.

The Pages build is a noindex mirror with production canonicals. No Pages deployment workflow is added by the modernization. CI builds, checks and uploads artifacts only. After an authorized deployment, independently verify public canonical URLs, deep links, missing-page status, asset headers and the previously installed service worker's update path. Search Console and field performance measurements require separate owner access.
