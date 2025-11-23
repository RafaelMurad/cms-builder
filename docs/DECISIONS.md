# Architectural Decision Records (ADR)

This document captures key architectural decisions made in this framework.

---

## ADR-001: Next.js App Router over Pages Router

**Status**: Accepted

**Context**: Starting a new Next.js project in 2024 requires choosing between the legacy Pages Router and the newer App Router.

**Decision**: Use App Router with Server Components as the default.

**Rationale**:
- Server Components reduce client-side JavaScript
- Layouts and nested routing simplify complex UIs
- Better data fetching patterns (no getServerSideProps boilerplate)
- Future of Next.js development

**Consequences**:
- Requires understanding Server vs Client Components
- Some libraries may have compatibility issues
- Initial learning curve for teams familiar with Pages Router

---

## ADR-002: Prisma as ORM

**Status**: Accepted

**Context**: Need a database abstraction layer that provides type safety and developer experience.

**Decision**: Use Prisma ORM with PostgreSQL.

**Rationale**:
- First-class TypeScript support
- Auto-generated types from schema
- Excellent migration system
- Wide database support (can switch later)
- Prisma Studio for debugging

**Consequences**:
- Slightly higher abstraction than raw SQL
- Need to run `prisma generate` after schema changes
- Some complex queries may need raw SQL fallback

---

## ADR-003: NextAuth.js for Authentication

**Status**: Accepted

**Context**: Need secure authentication supporting multiple providers.

**Decision**: Use NextAuth.js v4 with JWT strategy.

**Rationale**:
- Built specifically for Next.js
- Multiple OAuth providers out of the box
- JWT sessions don't require database per-request
- Extensible session/token callbacks
- Active community and maintenance

**Alternatives Considered**:
- Clerk: Excellent but adds vendor dependency
- Auth0: Powerful but complex for simple use cases
- Custom JWT: Reinventing the wheel

**Consequences**:
- Must understand JWT vs database session tradeoffs
- Token refresh handled automatically
- Session data limited to JWT payload size

---

## ADR-004: Tailwind CSS for Styling

**Status**: Accepted

**Context**: Need a styling solution that balances productivity and customization.

**Decision**: Use Tailwind CSS with custom design tokens.

**Rationale**:
- Rapid prototyping with utility classes
- No CSS specificity issues
- Consistent spacing/color scales
- Excellent tree-shaking (small bundles)
- IDE support with IntelliSense

**Alternatives Considered**:
- CSS Modules: Good isolation but slower development
- styled-components: Runtime overhead, SSR complexity
- Vanilla CSS: Maximum control but slower

**Consequences**:
- HTML can get verbose with many classes
- Team needs Tailwind familiarity
- Design system lives in tailwind.config.js

---

## ADR-005: Zod for Runtime Validation

**Status**: Accepted

**Context**: TypeScript provides compile-time safety but not runtime validation.

**Decision**: Use Zod for all API input validation.

**Rationale**:
- TypeScript-first design
- Infers types from schemas (DRY)
- Excellent error messages
- Composable schemas
- Small bundle size

**Alternatives Considered**:
- Yup: More verbose, less TypeScript-native
- io-ts: Powerful but steeper learning curve
- Manual validation: Error-prone, inconsistent

**Consequences**:
- Slight runtime overhead for validation
- Consistent error format across APIs
- Types derived from schemas (single source of truth)

---

## ADR-006: Feature Flags System

**Status**: Accepted

**Context**: Need ability to release features gradually and toggle functionality.

**Decision**: Built-in feature flag system with localStorage persistence.

**Rationale**:
- No external dependency
- Type-safe flag definitions
- Debug panel for development
- Can migrate to LaunchDarkly/Split later

**Alternatives Considered**:
- LaunchDarkly: Powerful but adds cost/complexity
- Environment variables: Not dynamic
- Database flags: Requires API calls

**Consequences**:
- Flags sync only on page load (not real-time)
- Manual management of flag definitions
- Good enough for small-medium projects

---

## ADR-007: Context + useReducer for State Management

**Status**: Accepted

**Context**: Studio interface needs shared state across components.

**Decision**: Use React Context with useReducer pattern.

**Rationale**:
- No additional dependencies
- Predictable state updates
- Easy to understand action/reducer pattern
- Sufficient for admin interface complexity

**Alternatives Considered**:
- Redux: Overkill for this use case
- Zustand: Good option, adds dependency
- Jotai/Recoil: Atomic state, different paradigm

**Consequences**:
- All state changes go through dispatch
- Context re-renders can be optimized with useMemo
- Pattern familiar to Redux developers

---

## ADR-008: Jest + React Testing Library

**Status**: Accepted

**Context**: Need testing framework for components and utilities.

**Decision**: Use Jest with React Testing Library.

**Rationale**:
- React Testing Library encourages accessibility
- Tests behavior, not implementation
- Jest widely adopted, good DX
- Native support in Next.js

**Alternatives Considered**:
- Vitest: Faster but less mature
- Playwright/Cypress: For E2E, not unit tests
- Enzyme: Deprecated, tests implementation details

**Consequences**:
- Need to mock Next.js hooks (useRouter, etc.)
- Focus on user-visible behavior
- 50% coverage threshold is realistic starting point

---

## ADR-009: Stripe for Payments

**Status**: Accepted

**Context**: Need subscription billing for SaaS features.

**Decision**: Use Stripe with webhook-based state management.

**Rationale**:
- Industry standard for web payments
- Excellent documentation
- Hosted checkout reduces PCI scope
- Customer portal for self-service

**Alternatives Considered**:
- Paddle: Simpler but less control
- LemonSqueezy: Good for digital products
- PayPal: Less developer-friendly

**Consequences**:
- Webhook handler required for state sync
- Stripe fees (2.9% + 30c)
- Must handle edge cases (failed payments, disputes)

---

## ADR-010: ISR over Full SSG or SSR

**Status**: Accepted

**Context**: Content needs to be fresh but fast.

**Decision**: Use Incremental Static Regeneration (ISR) with 60-second revalidation.

**Rationale**:
- Fast initial loads (static)
- Content updates within a minute
- Scales infinitely (no server per-request)
- Falls back gracefully

**Alternatives Considered**:
- Full SSG: Requires rebuild for updates
- Full SSR: Higher latency, more compute
- Client-side fetching: SEO concerns, loading states

**Consequences**:
- Content can be up to 60 seconds stale
- First visitor after revalidation sees old content
- On-demand revalidation available for critical updates

---

## ADR-011: Fallback to Static Config

**Status**: Accepted

**Context**: CMS database may be unavailable during development or failures.

**Decision**: Implement fallback chain: CMS → Static Config.

**Rationale**:
- Site always works, even without database
- Great for local development
- Graceful degradation in production
- Static config serves as documentation

**Consequences**:
- Dual maintenance (CMS + static)
- Clear priority order required
- Must handle null/undefined from CMS

---

## ADR-012: PostgreSQL over SQLite/MySQL

**Status**: Accepted

**Context**: Need a production database that scales.

**Decision**: Use PostgreSQL as the primary database.

**Rationale**:
- Excellent JSON support (future flexibility)
- Array columns (tags without join table)
- Full-text search built-in
- Works with Vercel Postgres, Supabase, Neon

**Alternatives Considered**:
- SQLite: Great for local, scaling concerns
- MySQL: Less feature-rich
- MongoDB: Schema flexibility vs type safety tradeoff

**Consequences**:
- Need PostgreSQL-compatible provider
- Prisma handles most compatibility issues
- Some PostgreSQL-specific features available

---

## Future Decisions to Document

When making significant architectural changes, add a new ADR entry:

1. **ADR-XXX: [Title]**
2. Status: Proposed/Accepted/Deprecated
3. Context: Why is this decision needed?
4. Decision: What was decided?
5. Rationale: Why this option?
6. Alternatives: What else was considered?
7. Consequences: What are the tradeoffs?

This keeps the team aligned and helps future developers understand "why".
