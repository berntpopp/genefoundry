.PHONY: help dev build lint type-check format check generate-og generate-pwa generate-assets

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev            - Start the development server"
	@echo "  make build          - Build the project for production"
	@echo "  make lint           - Run ESLint to fix and report issues"
	@echo "  make type-check     - Run TypeScript type checking"
	@echo "  make format         - Format code with Prettier"
	@echo "  make check          - Run both linting and type checking"
	@echo "  make generate-og    - Generate OG image PNG from SVG"
	@echo "  make generate-pwa   - Generate PWA icons from logo"
	@echo "  make generate-assets- Generate all assets (OG + PWA)"

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
