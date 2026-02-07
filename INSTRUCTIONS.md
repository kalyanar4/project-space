# Project Instructions

## Scope
This repository is a Next.js 15 (App Router) web application for Digital Meta Zone, including landing pages and utility tool pages (AI and PDF workflows).

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
npx tsc --noEmit
npm run build
```

## Environment and base path
- `NEXT_PUBLIC_BASE_PATH` can be set for subpath deployments (example: `/project-space`).
- Use `withBasePath(...)` from `/lib/basePath.ts` when referencing static assets to avoid broken paths in exported deployments.

## Styling and UI guidelines
- Global visual tokens and reusable styles live in `/app/globals.css`.
- Prefer shared classes (`primary-btn`, `secondary-btn`, `service-card`, `glass-card`, `page-title`, `page-subtitle`) over one-off styling.
- Keep interactions lightweight and smooth; avoid heavy animations or visual noise.
- Preserve responsive behavior for mobile and desktop.

## Routing and structure
- App pages: `/app/*`
- Shared components: `/components/*`
- Tool datasets: `/app/data/*`
- Utility helpers: `/lib/*`

## Contribution workflow
1. Create or switch to a `codex/*` branch.
2. Make focused changes.
3. Run lint/typecheck/build.
4. Commit with a clear message.
5. Push and open PR to `main`.

## PR checklist
- [ ] No TypeScript or ESLint errors
- [ ] `npm run build` succeeds
- [ ] UI changes verified on key pages (`/`, `/tools`, `/projects`, `/technology`)
- [ ] Base-path-sensitive assets verified
- [ ] Changelog updated when behavior changes
