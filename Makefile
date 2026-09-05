.PHONY: help dev build lint type-check format check test generate-og generate-pwa generate-assets \
        docker-build docker-up docker-down docker-logs docker-shell docker-dev \
        security audit hadolint trivy pre-commit test-health-container

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start the development server"
	@echo "  make build            - Build the project for production"
	@echo "  make lint             - Run ESLint and report issues"
	@echo "  make type-check       - Run TypeScript type checking"
	@echo "  make format           - Format code with Prettier"
	@echo "  make check            - Run both linting and type checking"
	@echo ""
	@echo "Security (pre-commit checks):"
	@echo "  make pre-commit       - Run all checks before committing"
	@echo "  make security         - Run all security checks"
	@echo "  make audit            - Run npm audit for vulnerabilities"
	@echo "  make hadolint         - Lint Dockerfile with Hadolint"
	@echo "  make trivy            - Scan for vulnerabilities with Trivy"
	@echo ""
	@echo "Assets:"
	@echo "  make generate-og      - Generate OG image PNG from SVG"
	@echo "  make generate-pwa     - Generate PWA icons from logo"
	@echo "  make generate-assets  - Generate all assets (OG + PWA)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build     - Build Docker image"
	@echo "  make docker-dev       - Run locally with exposed port (no NPM)"
	@echo "  make docker-up        - Start with NPM integration (production)"
	@echo "  make docker-down      - Stop containers"
	@echo "  make docker-logs      - View container logs"
	@echo "  make docker-shell     - Shell into running container"

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

type-check:
	npm run type-check

test:
	npm test

format:
	npm run format

check: lint type-check

generate-og:
	npm run generate-og-image

generate-pwa:
	npm run generate-pwa-assets

generate-assets: generate-og generate-pwa

# Docker commands
docker-build:
	docker compose -f docker/docker-compose.yml build

docker-dev:
	docker compose -f docker/docker-compose.yml up --build

docker-up:
	node scripts/validate-production-env.mjs .env.docker
	env -u GENEFOUNDRY_IMAGE_SHA256 docker compose --env-file .env.docker -f docker/docker-compose.yml -f docker/docker-compose.npm.yml up -d

docker-down:
	node scripts/validate-production-env.mjs .env.docker
	env -u GENEFOUNDRY_IMAGE_SHA256 docker compose --env-file .env.docker -f docker/docker-compose.yml -f docker/docker-compose.npm.yml down

docker-logs:
	node scripts/validate-production-env.mjs .env.docker
	env -u GENEFOUNDRY_IMAGE_SHA256 docker compose --env-file .env.docker -f docker/docker-compose.yml -f docker/docker-compose.npm.yml logs -f

docker-shell:
	node scripts/validate-production-env.mjs .env.docker
	env -u GENEFOUNDRY_IMAGE_SHA256 docker compose --env-file .env.docker -f docker/docker-compose.yml -f docker/docker-compose.npm.yml exec genefoundry sh

test-health-container:
	bash tests/test-health-container.sh

# Security commands (local pre-commit checks)
# These mirror the CI security workflow for local testing

# npm audit - check for dependency vulnerabilities
audit:
	@echo "Running npm audit..."
	npm audit --audit-level=moderate || (echo "⚠️  Vulnerabilities found. Run 'npm audit' for details." && exit 1)

# Hadolint - Dockerfile linting (requires Docker)
hadolint:
	@echo "Running Hadolint on Dockerfile..."
	docker run --rm -i hadolint/hadolint < docker/Dockerfile

# Trivy - filesystem vulnerability scan (requires Docker)
trivy:
	@echo "Running Trivy filesystem scan..."
	docker run --rm -v "$(PWD):/app" aquasec/trivy:latest fs /app --severity HIGH,CRITICAL --exit-code 1

# Combined security check
security: audit hadolint
	@echo "✅ Security checks passed!"

# Full pre-commit check: lint + type-check + security
pre-commit: lint type-check security build
	@echo "✅ All pre-commit checks passed!"
