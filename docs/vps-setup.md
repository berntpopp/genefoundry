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
| Field | Value |
|-------|-------|
| Domain Names | `genefoundry.org`, `www.genefoundry.org` |
| Scheme | `http` |
| Forward Hostname | `genefoundry-npm` |
| Forward Port | `8080` |
| Block Common Exploits | ✓ |

**SSL tab:**
| Field | Value |
|-------|-------|
| SSL Certificate | Request a new SSL Certificate |
| Force SSL | ✓ |
| HTTP/2 Support | ✓ |
| Email for Let's Encrypt | your@email.com |

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
