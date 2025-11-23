# Architecture Documentation

This document details the technical architecture and design decisions for the freelance framework.

## Table of Contents
1. [Core Principles](#core-principles)
2. [Directory Structure](#directory-structure)
3. [Data Flow](#data-flow)
4. [Authentication](#authentication)
5. [Database Design](#database-design)
6. [API Design](#api-design)
7. [State Management](#state-management)
8. [Feature Flags](#feature-flags)
9. [Billing System](#billing-system)
10. [Testing Strategy](#testing-strategy)

---

## Core Principles

### 1. Type Safety First
Every piece of data is typed with TypeScript. Runtime validation with Zod ensures API inputs match expected types.

### 2. Progressive Enhancement
The site works without JavaScript. CMS data fetching falls back to static configuration. Features degrade gracefully.

### 3. Separation of Concerns
- `lib/` - Business logic (pure functions, no UI)
- `components/` - UI components (no business logic)
- `services/` - External integrations
- `utils/` - Generic utilities

### 4. Convention Over Configuration
File-based routing, predictable naming, consistent patterns across the codebase.

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (optional group)
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   └── studio/               # Protected API endpoints
│   ├── auth/                     # Auth pages (signin, error)
│   └── studio/                   # Protected admin interface
│
├── components/                   # React components
│   ├── ui/                       # Base UI (Button, Input, Modal)
│   ├── layout/                   # Layout (Header, Footer, Sidebar)
│   ├── home/                     # Homepage-specific
│   └── studio/                   # Admin interface components
│
├── hooks/                        # Custom React hooks
│   ├── useScrollAnimation.ts     # Scroll-based animations
│   ├── useIntersectionObserver.ts # Visibility detection
│   └── useFeatureFlag.ts         # Feature flag access
│
├── lib/                          # Core business logic
│   ├── auth/                     # Authentication
│   │   ├── config.ts             # NextAuth configuration
│   │   └── index.ts              # Exports
│   ├── db/                       # Database
│   │   └── client.ts             # Prisma singleton
│   ├── cms/                      # Content management
│   │   ├── content.ts            # Database queries
│   │   └── index.ts              # Unified API with fallbacks
│   ├── billing/                  # Payments
│   │   └── subscription.ts       # Stripe integration
│   └── feature-flags/            # Feature management
│       ├── types.ts              # Flag definitions
│       ├── provider.tsx          # Context provider
│       └── index.ts              # Exports
│
├── services/                     # External service integrations
│   ├── galleryFileService.ts     # File system operations
│   └── simpleGalleryService.ts   # Gallery CRUD
│
├── utils/                        # Utility functions
│   ├── assetPath.ts              # Asset URL handling
│   └── animationConfigs.ts       # Animation presets
│
├── types/                        # TypeScript definitions
│   ├── index.ts                  # Main type exports
│   └── api.ts                    # API-specific types
│
├── context/                      # React Context providers
│   └── StudioContext.tsx         # Studio state management
│
├── config/                       # Configuration
│   └── site.ts                   # Static site config (fallback)
│
└── __tests__/                    # Test files
    ├── components/               # Component tests
    ├── hooks/                    # Hook tests
    └── studio/                   # Integration tests
```

---

## Data Flow

### Server Component Data Fetching
```
Request → Layout → Page → Component
              ↓
         getSiteConfig() ─→ CMS Database
              ↓                   ↓ (fallback)
         Response ←─────── Static Config
```

### Client Component State
```
User Action → Dispatch → Reducer → New State → Re-render
                              ↓
                        localStorage (persist)
```

### API Request Flow
```
Client Request
      ↓
Authentication Check (NextAuth session)
      ↓
Input Validation (Zod schema)
      ↓
Authorization Check (user owns resource?)
      ↓
Usage Limit Check (subscription tier)
      ↓
Business Logic (Prisma queries)
      ↓
Response
```

---

## Authentication

### NextAuth.js Configuration

**Strategy**: JWT-based sessions (no database session storage)

**Providers**:
1. Google OAuth (consent + offline access)
2. GitHub OAuth
3. Twitter/X OAuth 2.0
4. Credentials (email/password for demo)

**Session Extension**:
```typescript
interface Session {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    subscriptionTier: SubscriptionTier;  // Custom field
    isTrialing: boolean;                  // Custom field
  };
}
```

**JWT Callbacks**:
```typescript
// jwt callback - runs when JWT is created/updated
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.subscriptionTier = user.subscriptionTier || "FREE";
    token.isTrialing = user.trialEndsAt ? new Date(user.trialEndsAt) > new Date() : false;
  }
  return token;
}

// session callback - runs when session is accessed
async session({ session, token }) {
  session.user.id = token.id;
  session.user.subscriptionTier = token.subscriptionTier;
  session.user.isTrialing = token.isTrialing;
  return session;
}
```

### Authorization Patterns

**Route Protection** (Server Components):
```typescript
// In page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  return <Content />;
}
```

**API Protection**:
```typescript
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Continue...
}
```

---

## Database Design

### Core Models

**User & Authentication**:
```prisma
model User {
  id                  String     @id @default(cuid())
  name                String?
  email               String?    @unique
  emailVerified       DateTime?
  image               String?
  subscriptionTier    SubscriptionTier @default(FREE)
  subscriptionStatus  SubscriptionStatus @default(ACTIVE)
  stripeCustomerId    String?    @unique
  trialEndsAt         DateTime?
  storageUsedMB       Int        @default(0)
  // Relations
  accounts            Account[]
  sites               Site[]
  galleries           Gallery[]
}
```

**Content Models**:
```prisma
model Site {
  id              String    @id @default(cuid())
  slug            String    @unique
  name            String
  tagline         String    @default("")
  description     String    @db.Text
  // Theme
  primaryColor    String    @default("#000000")
  headingFont     String    @default("Inter")
  // Publishing
  isPublished     Boolean   @default(false)
  publishedAt     DateTime?
  // Relations
  user            User      @relation(fields: [userId])
  galleries       Gallery[]
}

model Gallery {
  id          String        @id @default(cuid())
  slug        String
  title       String
  layout      GalleryLayout @default(grid)
  isPublished Boolean       @default(false)
  isFeatured  Boolean       @default(false)
  // Relations
  items       GalleryItem[]
  site        Site?         @relation(fields: [siteId])
}
```

### Design Decisions

1. **CUID over UUID**: Shorter, sortable, collision-resistant
2. **Soft Relations**: Gallery can exist without Site (orphan galleries allowed)
3. **Publish Workflow**: `isPublished` + `publishedAt` for content staging
4. **JSON for Flexible Content**: Pages use JSON blocks for extensibility

---

## API Design

### RESTful Conventions

| Method | Endpoint | Action |
|--------|----------|--------|
| GET | /api/studio/galleries | List all |
| GET | /api/studio/galleries/:id | Get one |
| POST | /api/studio/galleries | Create |
| PATCH | /api/studio/galleries/:id | Update |
| DELETE | /api/studio/galleries/:id | Delete |

### Request Validation

```typescript
const createGallerySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  tags: z.array(z.string()).optional(),
  layout: z.enum(["grid", "masonry", "carousel"]).optional(),
});
```

### Response Format

**Success**:
```json
{
  "data": { ... },
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error**:
```json
{
  "error": "Validation error",
  "details": [
    { "path": ["title"], "message": "Required" }
  ]
}
```

### Status Codes

- `200` - Success (GET, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation)
- `401` - Unauthorized
- `403` - Forbidden (quota exceeded)
- `404` - Not Found
- `500` - Server Error

---

## State Management

### Studio Context

**Pattern**: React Context + useReducer

```typescript
interface StudioState {
  site: SiteConfig;
  galleries: Gallery[];
  pages: Page[];
  media: MediaFile[];
  isLoading: boolean;
  isSaving: boolean;
}

type Action =
  | { type: 'SET_GALLERIES'; payload: Gallery[] }
  | { type: 'ADD_GALLERY'; payload: Gallery }
  | { type: 'UPDATE_GALLERY'; payload: { id: string; data: Partial<Gallery> } }
  | { type: 'DELETE_GALLERY'; payload: string }
  // ...
```

**Persistence**:
- Auto-save to localStorage on state change
- Load from localStorage on mount
- Sync with server on explicit save

### When to Use What

| Scenario | Solution |
|----------|----------|
| Server data fetching | React Server Components |
| Form state | useState or React Hook Form |
| Complex local state | useReducer |
| Shared state (admin) | Context + useReducer |
| Global app state | Context or Zustand |

---

## Feature Flags

### Type-Safe Implementation

```typescript
// types.ts
export type FeatureFlagKey =
  | 'command-palette'
  | 'advanced-analytics'
  | 'ai-descriptions'
  | 'bulk-operations'
  | 'custom-css';

export interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  name: string;
  description: string;
  category: 'studio' | 'api' | 'ui' | 'experimental';
  enabled: boolean;
}
```

### Usage Patterns

```typescript
// Hook
const isEnabled = useFeatureFlag('command-palette');

// Component
<Feature flag="command-palette">
  <CommandPalette />
</Feature>

// With fallback
<Feature flag="new-feature" fallback={<OldFeature />}>
  <NewFeature />
</Feature>
```

### Debug Panel

Enable in development:
```tsx
{process.env.NODE_ENV === 'development' && (
  <FeatureFlagDebugPanel />
)}
```

---

## Billing System

### Subscription Tiers

```typescript
enum SubscriptionTier {
  FREE        // Default
  STARTER     // $9/month
  PROFESSIONAL // $29/month (popular)
  ENTERPRISE   // $99/month
}
```

### Limit Checks

```typescript
// Before creating resource
const limits = await checkUsageLimits(userId);

if (!limits.withinLimits) {
  return NextResponse.json({
    error: "Limit exceeded",
    upgrade: true,
    limit: limits.usage.galleries.limit
  }, { status: 403 });
}
```

### Stripe Integration

```typescript
// Create checkout session
const session = await createCheckoutSession(userId, 'PROFESSIONAL');
redirect(session.url);

// Handle webhook
export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(...);

  switch (event.type) {
    case 'checkout.session.completed':
      await activateSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object);
      break;
  }
}
```

---

## Testing Strategy

### Test Types

1. **Unit Tests** - Utils, hooks, pure functions
2. **Component Tests** - UI components with RTL
3. **Integration Tests** - API routes, database operations
4. **E2E Tests** - Critical user flows (optional, with Playwright)

### Test Structure

```typescript
// Component test
describe('Gallery', () => {
  it('renders gallery items', () => {
    render(<Gallery items={mockItems} />);
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('handles empty state', () => {
    render(<Gallery items={[]} />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });
});
```

### Mocking

```typescript
// jest.setup.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));
```

### Coverage Goals

- Minimum 50% coverage (realistic baseline)
- Focus on critical paths first
- Accessibility testing included

---

## Performance Considerations

### Server Components
- Default to Server Components
- Use Client Components only when needed (interactivity)

### ISR (Incremental Static Regeneration)
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### Image Optimization
- Use Next.js Image component
- Configure remote patterns in next.config.js
- Serve WebP/AVIF formats

### Bundle Analysis
```bash
npm run build
# Check .next/analyze/ for bundle sizes
```

---

## Security Checklist

- [x] CSRF protection (NextAuth handles)
- [x] SQL injection prevention (Prisma parameterized queries)
- [x] XSS prevention (React auto-escapes)
- [x] Authentication on all protected routes
- [x] Authorization checks (user owns resource)
- [x] Input validation (Zod schemas)
- [x] Rate limiting (implement as needed)
- [x] Secure headers (Next.js defaults)
- [x] Environment variable protection

---

## Extending the Framework

### Adding a New Feature

1. Define feature flag (if gated)
2. Create database model (if persistent)
3. Create API routes
4. Build UI components
5. Write tests
6. Document

### Adding a New Provider

1. Add credentials to `.env`
2. Configure in `lib/auth/config.ts`
3. Update sign-in UI
4. Test OAuth flow

### Adding a New Subscription Tier

1. Create Stripe product
2. Add to `SubscriptionTier` enum
3. Define limits in `getStorageLimit()`, `getGalleryLimit()`
4. Update pricing UI

---

This architecture is designed to be understood quickly and extended easily. Questions? Check the code - it's the source of truth.
