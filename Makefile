.PHONY: help dev build lint type-check format check generate-og generate-pwa generate-assets \
        docker-build docker-up docker-down docker-logs docker-shell docker-dev

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start the development server"
	@echo "  make build            - Build the project for production"
	@echo "  make lint             - Run ESLint to fix and report issues"
	@echo "  make type-check       - Run TypeScript type checking"
	@echo "  make format           - Format code with Prettier"
	@echo "  make check            - Run both linting and type checking"
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
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml up -d --build

docker-down:
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml down

docker-logs:
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml logs -f

docker-shell:
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.npm.yml exec genefoundry sh
