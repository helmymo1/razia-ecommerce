# Architecture & Technical Decisions

## 1. Routing & Performance Strategy

> [!WARNING]
> **Code Splitting**: All new Page components MUST be lazy-loaded to preserve First Contentful Paint (FCP) scores.

- **Lazy Loading**: We use `React.lazy()` and `Suspense` for all top-level routes. This ensures that the main bundle remains small and pages are loaded on-demand.
- **Component Colocation**: Components are organized by feature in the `components/` directory to facilitate maintenance and code splitting.

## 2. PWA (Progressive Web App)

- **Service Worker**: Powered by `vite-plugin-pwa`.
- **Caching Strategy**: The app shell and `vendor` chunks are cached to allow the application to load **offline**.
- **Manifest**: Located in the public directory, updated for full PWA compliance (icons, theme color).

## 3. State Management

- **Context API**: Global state is managed using React Context.
    - `AuthContext`: Manages user authentication state.
    - `CartContext`: Manages shopping cart state.
    - `LanguageContext`: Handles localization (English/Arabic).

## 4. Testing & Quality Assurance

### Git Hooks (Husky)
- **Tool**: `husky` + `lint-staged`.
- **Trigger**: `pre-commit`.
- **Action**: Runs `eslint` and `prettier` on staged files. This prevents formatting errors and lint warnings from polluting the codebase.

### End-to-End Testing (Playwright)
- **Tool**: `@playwright/test`.
- **Location**: `razia user site/razia-chic-builder-main/tests`.
- **Scope**: Smoke tests verify that the critical rendering path (LCP) and interactivity Work correctly in a real browser environment.
- **Run**: `npm run test:e2e` (Manual or CI).
