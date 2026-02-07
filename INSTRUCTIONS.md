# Project Instructions

## Scope
This repository is a Next.js 15 (App Router) web application for Digital Meta Zone, including landing pages and utility tool pages (AI, PDF, and developer workflows).

## Local setup
1. Install dependencies:
```bash
npm install
```
2. Start development server:
```bash
npm run dev
```
3. Open:
`http://localhost:3000`

## Build and quality checks
Run these before committing:
```bash
npm run lint
npm run build
npm run test:all
```

## Environment and base path
- `NEXT_PUBLIC_BASE_PATH` can be set for subpath deployments (example: `/project-space`).
- Use `withBasePath(...)` from `/lib/basePath.ts` when referencing static assets to avoid broken paths in exported deployments.

## Styling and UI guidelines
- Global visual tokens and reusable styles live in `/app/globals.css`.
- Prefer shared classes (`primary-btn`, `secondary-btn`, `service-card`, `glass-card`, `page-title`, `page-subtitle`) over one-off styling.
- Use reusable state components (`LoadingState`, `EmptyState`, `ErrorState`) in tool flows.
- Keep interactions lightweight and smooth; avoid heavy animations or visual noise.
- Preserve responsive behavior for mobile and desktop.

## Routing and structure
- App pages: `/app/*`
- Shared components: `/components/*`
- Tool datasets: `/app/data/*`
- Utility helpers: `/lib/*`
- Smoke tests: `/tests/e2e/*`

## Contribution workflow
1. Create or switch to a `codex/*` branch.
2. Make focused changes.
3. Run lint/build/test checks.
4. Commit with a clear message.
5. Push and open PR to `main`.

## PR checklist
- [ ] No TypeScript or ESLint errors
- [ ] `npm run build` succeeds
- [ ] `npm run test:all` succeeds
- [ ] UI changes verified on key pages (`/`, `/tools`, `/tools/developer`, `/contact`)
- [ ] Base-path-sensitive assets verified
- [ ] Changelog updated when behavior changes
