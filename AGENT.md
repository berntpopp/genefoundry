# Agentic Development Guide

This document provides context, guidelines, and structural information to assist AI agents in navigating and contributing to the GeneFoundry Landing Page project.

## 1. Project Overview

**Goal**: Create a high-impact, responsive, single-page landing page for GeneFoundry, a modular registry for trustworthy genomic analysis powered by Model Context Protocols (MCPs).
**Status**: Proof of Concept (POC) / Conceptual Entry Page.

## 2. Technology Stack

*   **Framework**: Vue 3 (Composition API)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (Utility-first)
*   **Language**: TypeScript
*   **Icons**: `lucide-vue-next`
*   **Linting/Formatting**: ESLint (Flat Config), Prettier

## 3. Project Structure

```
genefoundry/
├── public/              # Static assets (logos, favicon)
├── src/
│   ├── components/      # Vue components (Atomic/Section-based)
│   │   ├── HeroSection.vue      # 3D Carousel & Main CTA
│   │   ├── MethodologyFlow.vue  # Interactive process diagram
│   │   ├── RoleSwitcher.vue     # Tabbed interface for perspectives
│   │   ├── ImpactGrid.vue       # Grid layout for features/impact
│   │   ├── NavBar.vue           # Responsive navigation
│   │   └── FooterSection.vue    # Simple footer
│   ├── App.vue          # Main layout entry point
│   ├── main.js          # App initialization
│   └── style.css        # Global styles & Tailwind imports
├── eslint.config.js     # ESLint configuration
├── tailwind.config.js   # Tailwind configuration (colors, fonts)
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 4. Development Principles

### Code Style
*   **Vue**: Always use `<script setup lang="ts">`.
*   **Styling**: Use Tailwind CSS utility classes for 99% of styling. Use `<style scoped>` only for complex animations (e.g., 3D transforms) that are hard to express with utilities.
*   **Reactivity**: Use `ref` and `computed` for state management.
*   **Type Safety**: Explicitly type props, emits, and complex state objects.

### Design System
*   **Primary Color**: `#D15697` (Vibrant Pink)
*   **Secondary Color**: `#334155` (Slate)
*   **Font**: Inter (Sans-serif)
*   **Aesthetic**: "Scientific Modern" – Clean, glassmorphism, bento-grids, subtle animations.

### Responsiveness
*   **Mobile-First**: Ensure all components render correctly on small screens (375px+) before scaling up.
*   **Navigation**: Use the hamburger menu implementation in `NavBar.vue` for mobile.

## 5. Tooling & Commands

*   **Start Dev Server**: `npm run dev`
*   **Lint Code**: `npm run lint` (Fixes errors automatically)
*   **Type Check**: `npm run type-check`
*   **Format**: `npm run format`
*   **Build**: `npm run build`

## 6. Critical Implementation Details

*   **3D Carousel (`HeroSection.vue`)**: Implemented using CSS 3D transforms. It detects mobile viewports (`window.innerWidth < 640`) to adjust the orbit radius and scale.
*   **Role Switcher (`RoleSwitcher.vue`)**: Uses a typed `activeRole` state to switch content dynamically.
*   **Navigation**: Smooth scrolling is implemented via standard anchor tags (`#id`).

## 7. Workflow for Agents

1.  **Read**: Check `AGENT.md` and `package.json` to understand the environment.
2.  **Plan**: Break down tasks into component-level changes.
3.  **Implement**: Write code using the principles above.
4.  **Verify**:
    *   Run `npm run type-check` to catch TS errors.
    *   Run `npm run lint` to ensure code style.
    *   Check responsiveness if modifying UI.
