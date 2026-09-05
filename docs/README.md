# GeneFoundry Documentation

## Deployment Guides

| Guide                                       | Description                                          |
| ------------------------------------------- | ---------------------------------------------------- |
| [VPS Setup](./vps-setup.md)                 | Deploy GeneFoundry on a VPS with Nginx Proxy Manager |
| [Container Release](./container-release.md) | Run the reviewed-main container release workflow     |

## Quick Reference

### Local Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
make check           # Lint + type-check
```

### Docker Commands

```bash
make docker-build    # Build Docker image
make docker-dev      # Run locally (port 8080)
make docker-up       # Deploy with NPM
make docker-down     # Stop containers
make docker-logs     # View logs
make docker-shell    # Shell into container
```

### Security & Pre-commit

```bash
make pre-commit      # Full check: lint + type-check + security + build
make security        # Run security checks only
make audit           # npm audit for vulnerabilities
make hadolint        # Lint Dockerfile
make trivy           # Scan filesystem with Trivy (requires Docker)
```

### VPS Requirements

- 4GB RAM
- 2 vCPU
- 40GB SSD
- Ubuntu 22.04+ or Debian 12+

### Estimated Costs

| Provider     | Spec     | Monthly |
| ------------ | -------- | ------- |
| Hetzner CX22 | 4GB/2CPU | ~$5     |
| DigitalOcean | 4GB/2CPU | ~$24    |
| Vultr        | 4GB/2CPU | ~$24    |

## Security

The Docker image includes automatic security patching:

- Alpine packages are upgraded at build time via `apk upgrade`
- CI runs CodeQL, Trivy, Hadolint, and npm audit on every push
- Dependabot monitors npm, GitHub Actions, and Docker base images
