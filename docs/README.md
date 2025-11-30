# GeneFoundry Documentation

## Deployment Guides

| Guide | Description |
|-------|-------------|
| [VPS Setup](./vps-setup.md) | Deploy GeneFoundry on a VPS with Nginx Proxy Manager |
| [Plausible Setup](./plausible-setup.md) | Self-host Plausible Analytics |

## Quick Reference

### Local Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
make check           # Lint + type-check
```

### Docker Commands

```bash
make docker-dev      # Run locally (port 8080)
make docker-up       # Deploy with NPM
make docker-down     # Stop containers
make docker-logs     # View logs
```

### VPS Requirements

- 4GB RAM
- 2 vCPU
- 40GB SSD
- Ubuntu 22.04+ or Debian 12+

### Estimated Costs

| Provider | Spec | Monthly |
|----------|------|---------|
| Hetzner CX22 | 4GB/2CPU | ~$5 |
| DigitalOcean | 4GB/2CPU | ~$24 |
| Vultr | 4GB/2CPU | ~$24 |
