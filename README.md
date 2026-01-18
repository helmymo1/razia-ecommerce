# eBazer - Luxury E-Commerce Platform

> [!NOTE]
> **Status**: Performance Optimized (Lighthouse 90+) 🚀
> 
> This project has been optimized for performance, accessibility, and SEO. It features lazy loading, PWA offline support, and rigorous E2E testing.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (Required for E2E tests)
npx playwright install

# 3. Start development server
npm run dev
```

## Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server. |
| `npm run preview` | Builds and tests the production build locally. |
| `npm run test:e2e` | Runs Playwright End-to-End tests (located in `razia user site`). |
| `npm run lint` | Runs ESLint to check code quality. |
| `npm start` | Starts the backend server (prod mode). |

## Project Structure

- **root**: Backend and Admin Panel configurations.
- **backend/**: Node.js/Express API.
- **razia user site/**: React + Vite Frontend (User Facing).
- **eBazer/**: Admin Panel (Legacy/HTML).

## Testing

This project uses **Playwright** for End-to-End testing and **Husky** for git hooks.

- **Pre-commit Hook**: Runs `lint-staged` (ESLint + Prettier) on staged files to prevent bad code from being committed.
- **Smoke Tests**: Verifies critical user flows (App Load, Hero Image LCP).
