# Plausible Analytics Setup

Self-host Plausible CE for privacy-first analytics.

## Prerequisites

- [ ] VPS setup complete (see [vps-setup.md](./vps-setup.md))
- [ ] Subdomain pointing to VPS (`plausible.genefoundry.org`)

---

## Step 1: Clone Plausible CE

```bash
cd ~
git clone -b v3.1.0 --single-branch \
  https://github.com/plausible/community-edition plausible-ce
cd plausible-ce
```

---

## Step 2: Generate Secrets

```bash
# Generate two secrets (save these!)
echo "SECRET_KEY_BASE=$(openssl rand -base64 48)"
echo "TOTP_VAULT_KEY=$(openssl rand -base64 32)"
```

---

## Step 3: Configure Environment

```bash
cat > plausible-conf.env << 'EOF'
BASE_URL=https://plausible.genefoundry.org
SECRET_KEY_BASE=paste-your-first-secret-here
TOTP_VAULT_KEY=paste-your-second-secret-here
DISABLE_REGISTRATION=invite_only
EOF
```

Edit the file with your actual secrets:

```bash
nano plausible-conf.env
```

---

## Step 4: Add NPM Network

Edit `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Add at the bottom of the file:

```yaml
networks:
  default:
  npm_default:
    external: true
```

Add to the `plausible` service (under `depends_on`):

```yaml
    networks:
      - default
      - npm_default
```

---

## Step 5: Start Plausible

```bash
docker compose up -d
```

Wait 30 seconds for startup, then verify:

```bash
docker ps | grep plausible
```

---

## Step 6: Configure NPM Proxy Host

1. Open NPM admin panel
2. Go to **Proxy Hosts** → **Add Proxy Host**

**Details tab:**
| Field | Value |
|-------|-------|
| Domain Names | `plausible.genefoundry.org` |
| Scheme | `http` |
| Forward Hostname | `plausible` |
| Forward Port | `8000` |
| Block Common Exploits | ✓ |

**SSL tab:**
| Field | Value |
|-------|-------|
| SSL Certificate | Request a new SSL Certificate |
| Force SSL | ✓ |
| HTTP/2 Support | ✓ |

3. Click **Save**

---

## Step 7: Create Admin Account

1. Visit `https://plausible.genefoundry.org`
2. Click **Register**
3. Enter your email and password
4. Verify email (check spam folder)

---

## Step 8: Add Your Site

1. Log in to Plausible dashboard
2. Click **Add Website**
3. Enter `genefoundry.org`
4. Skip the snippet step (already configured)

---

## Verify Analytics

1. Visit `https://genefoundry.org` in a browser
2. Open Plausible dashboard
3. You should see 1 current visitor

---

## Updating Plausible

```bash
cd ~/plausible-ce
docker compose pull
docker compose up -d
```

---

## Troubleshooting

**Dashboard not loading?**
```bash
docker logs plausible-ce-plausible-1
```

**No data appearing?**
- Check browser console for script errors
- Verify `data-domain` matches your site
- Disable ad blockers for testing

**Email verification not arriving?**
- Check spam folder
- Plausible CE requires SMTP for email (optional)
- Skip verification by accessing database directly if needed
