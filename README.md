# Digital Meta Zone

Digital Meta Zone is a Next.js product focused on a clear niche: **AI + PDF productivity for freelancers and small agencies**.

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

## Growth Plan

### Week 1: Positioning + Conversion Base
- Lock niche statement: "AI + PDF productivity for freelancers and small agencies."
- Update homepage hero + tool pages with one clear CTA: `Start Free`.
- Define pricing skeleton:
  - Free: basic usage limits
  - Pro: higher limits, faster processing, advanced tools
- Add core analytics dashboard events:
  - `landing_view`
  - `tool_start`
  - `tool_success`
  - `email_capture`
  - `upgrade_click`
- Add email capture after successful tool output (not before).

### Week 2: Productized MVP Offer
- Productize 3 hero tools:
  - PDF Merge
  - PDF to Word
  - AI Text Generator
- Add output quality trust blocks:
  - privacy note
  - local-processing note (where true)
  - reliability message
- Add “next best action” cards after each success:
  - “Try Split PDF”
  - “Generate summary with AI”
- Ship one lead magnet:
  - “10-client-proposal templates” (email-gated)

### Week 3: Acquisition Engine
- Publish 6 SEO pages (2 per hero tool):
  - use-case page + comparison page each
- Publish 4 blog posts with transactional intent:
  - “How to merge client contracts in 2 mins”
  - “Convert scanned PDF to editable draft workflow”
- Add simple programmatic internal linking between tools + posts.
- Distribute content in 3 channels:
  - Reddit/X communities
  - Indie Hackers/Product Hunt prep
  - niche Facebook/Slack groups

### Week 4: Monetization + Sales Motion
- Turn on Pro plan checkout.
- Add upgrade prompts only at value moments:
  - after 2–3 successful outputs
  - when limit is hit
- Launch B2B landing page:
  - team workspace
  - private processing
  - priority support
  - API access
- Start outbound to small agencies (20/day for 5 days) with short demo clip.
- Add testimonials/early user quotes to homepage + tool pages.

### KPIs to Track Weekly
- Activation rate: visitor → first successful output
- Retention: 7-day return rate
- Conversion: free → paid
- Lead capture rate post-success
- Revenue per 1000 visitors

### Execution Rules
- Ship weekly, no redesign detours.
- Keep only features that improve activation/retention/conversion.
- Every new page must have:
  - one intent keyword
  - one CTA
  - one measurable event

If you want, I can now convert this into a task board (exact tickets by day) and start implementing Week 1 directly.
