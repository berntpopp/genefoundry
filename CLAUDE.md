# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GeneFoundry is a single-page Vue 3 landing page for a modular registry of trustworthy genomic analysis powered by Model Context Protocols (MCPs). Currently a Proof of Concept / conceptual entry page.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint with auto-fix
npm run type-check   # TypeScript type checking
npm run format       # Prettier formatting

# Combined check (via Makefile)
make check           # Run lint + type-check
```

## Architecture

**Stack**: Vue 3 (Composition API) + Vite + Tailwind CSS + TypeScript + lucide-vue-next icons

**Structure**:
- `src/App.vue` - Main layout entry point
- `src/components/` - Section-based components:
  - `HeroSection.vue` - 3D CSS carousel with mobile detection (640px breakpoint)
  - `MethodologyFlow.vue` - Interactive process diagram
  - `RoleSwitcher.vue` - Tabbed interface with typed `activeRole` state
  - `ImpactGrid.vue` - Feature grid layout
  - `NavBar.vue` - Responsive nav with hamburger menu
  - `FooterSection.vue` - Simple footer

## Code Style Requirements

- **Vue**: Always use `<script setup lang="ts">`
- **Styling**: Tailwind CSS utilities for 99% of styling; `<style scoped>` only for complex animations (3D transforms)
- **Reactivity**: Use `ref` and `computed` for state management
- **Type Safety**: Explicitly type props, emits, and complex state objects

## Design System

- **Primary**: `#BE3E82` (defined in tailwind.config.js)
- **Secondary**: `#334155` (Slate)
- **Font**: Inter (sans-serif)
- **Mobile-first**: Support 375px+ screens, use hamburger menu for mobile nav
