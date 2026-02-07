# Digital Meta Zone

Digital Meta Zone is a Next.js product focused on a clear niche: **AI-assisted content workflows** and **document productivity tools**.

## Niche focus
- AI utility workflows (text generation, assistant patterns, AI news)
- PDF/document workflows (merge, split, conversion, compression roadmap)
- Developer-adjacent utility operations for faster execution

## Tech stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS + shared global design system
- pdf-lib, pdfjs, docx, dnd-kit

## Local development
```bash
npm install
npm run dev
```

## Quality checks
```bash
npm run lint
npm run build
```

## Base path support
This project supports subpath deployments (for example GitHub Pages).
- Configure `NEXT_PUBLIC_BASE_PATH` (example: `/project-space`)
- Use `withBasePath(...)` from `lib/basePath.ts` for static assets

## Key docs
- `INSTRUCTIONS.md` - contribution and engineering workflow
- `PROJECT_PURPOSE.md` - mission, niche, and success criteria
- `COMPONENTS_AND_LINKS.md` - component behavior, route map, and commercial purpose
