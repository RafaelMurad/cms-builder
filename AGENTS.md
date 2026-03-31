# CMS Builder (Studio HAUS)

CMS and website builder for creative agencies. Headless CMS with visual studio, ISR publishing, and Stripe billing.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3, Prisma 5 (PostgreSQL).
NextAuth (JWT, multi-provider), Stripe (4-tier subscriptions).
`npm` for packages (node versions via Volta). Path alias: `@/*` → `./src/*`.

## Development

```bash
npm run type-check   # must pass clean
npm run lint         # must pass clean
npm test             # must pass, 50% coverage threshold
npm run build        # verify before finishing
```

Non-obvious commands:
```bash
npm run db:generate   # prisma generate (after schema changes)
npm run db:push       # prisma db push
npm run db:studio     # prisma studio GUI
```

## Conventions

- British English throughout (colour, centre, behaviour).
- CMS content layer in `src/lib/cms/` — fetches from Prisma with static fallback from `src/config/site.ts`.
- Studio pages (under `/studio`) are Client Components with `StudioContext` (useReducer + localStorage).
- Public pages are Server Components with ISR (`revalidate = 60`).
- Feature flag system in `src/lib/feature-flags/` — 14 flags, overridable via localStorage or URL params (`?ff_flag-name=true`).
- API routes in `src/app/api/studio/` — all ownership-checked, Zod-validated.
- Test utilities in `src/__tests__/utils.tsx`.
