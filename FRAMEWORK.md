# Freelance Framework

A production-ready Next.js 14 framework for building professional web applications. Built from real-world freelance projects with battle-tested patterns.

## Quick Start

```bash
# Clone this repo as your new project
git clone <repo-url> my-new-project
cd my-new-project

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Generate Prisma client
npm run db:generate

# Run development server
npm run dev
```

## What's Included

### Core Stack
- **Next.js 14** - App Router, Server Components, ISR
- **TypeScript** - Strict mode, path aliases
- **Tailwind CSS** - Custom design system, animations
- **Prisma** - Type-safe ORM with comprehensive schema
- **NextAuth.js** - Multi-provider OAuth + credentials

### Production Features
- **Subscription System** - Stripe integration with 4 tiers
- **CMS Builder** - Studio interface for content management
- **Feature Flags** - Type-safe feature gating
- **Analytics** - Built-in event tracking
- **API Routes** - RESTful patterns with validation

### Developer Experience
- **Jest + RTL** - Testing setup with mocks
- **ESLint** - Next.js best practices
- **Zod** - Runtime type validation
- **Husky** - Git hooks (optional)

## Architecture Overview

```
src/
  app/                    # Next.js App Router
    api/                  # RESTful API routes
    studio/               # Protected CMS interface
    auth/                 # Authentication pages
  components/             # React components
    ui/                   # Base UI components
    layout/               # Header, Footer, etc.
    studio/               # Studio-specific
  hooks/                  # Custom React hooks
  lib/                    # Core business logic
    auth/                 # NextAuth configuration
    db/                   # Prisma client
    cms/                  # Content providers
    billing/              # Stripe integration
    feature-flags/        # Feature flag system
  services/               # External integrations
  utils/                  # Utility functions
  types/                  # TypeScript definitions
  context/                # React Context providers
  config/                 # Configuration files
  __tests__/              # Jest test suite
```

## Environment Variables

Create `.env.local` with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (configure what you need)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

## Key Patterns

### 1. API Route Pattern
```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = schema.parse(body);

    // Create resource...

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### 2. Feature Flags
```typescript
// Check in component
const isEnabled = useFeatureFlag('new-feature');

// Wrap component
<Feature flag="new-feature">
  <NewComponent />
</Feature>

// Check in API
if (hasFeatureAccess(session.user.subscriptionTier, 'api_access')) {
  // Allow API access
}
```

### 3. CMS Data Fetching
```typescript
// src/app/page.tsx
import { getSiteConfig, getFeaturedProjects, REVALIDATE_TIME } from "@/lib/cms";

export const revalidate = REVALIDATE_TIME; // ISR

export default async function Home() {
  const [config, projects] = await Promise.all([
    getSiteConfig(),
    getFeaturedProjects(6),
  ]);

  return <Page config={config} projects={projects} />;
}
```

### 4. State Management
```typescript
// src/context/StudioContext.tsx
const StudioContext = createContext<StudioContextType | null>(null);

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error('Must be used within StudioProvider');
  return context;
}
```

## Subscription Tiers

| Feature | FREE | STARTER | PROFESSIONAL | ENTERPRISE |
|---------|------|---------|--------------|------------|
| Galleries | 3 | 10 | 50 | Unlimited |
| Storage | 100MB | 1GB | 10GB | Unlimited |
| Custom Domain | - | Yes | Yes | Yes |
| API Access | - | - | Yes | Yes |
| Team Members | - | - | 5 | Unlimited |
| White Label | - | - | - | Yes |

## Database Schema Highlights

```prisma
// User with subscription
model User {
  id                String    @id @default(cuid())
  email             String?   @unique
  subscriptionTier  SubscriptionTier @default(FREE)
  stripeCustomerId  String?   @unique
}

// Content models
model Gallery { ... }
model Page { ... }
model MediaFile { ... }

// Analytics
model AnalyticsEvent { ... }
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run test         # Jest tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB
npm run db:studio    # Open Prisma Studio
```

## Customization Guide

### 1. Update Branding
- Edit `src/config/site.ts` for site metadata
- Update `tailwind.config.js` colors
- Replace logo in `src/components/Logo.tsx`

### 2. Modify Database Schema
- Edit `prisma/schema.prisma`
- Run `npm run db:generate && npm run db:push`
- Update types in `src/types/`

### 3. Add New Features
1. Add feature flag in `src/lib/feature-flags/types.ts`
2. Create component/route
3. Gate with `useFeatureFlag()` or `<Feature>`

### 4. Configure Payments
1. Set up Stripe account
2. Add webhook endpoint
3. Configure products in Stripe Dashboard
4. Update `src/lib/billing/subscription.ts`

## Testing

```typescript
// Component test
import { render, screen } from '@testing-library/react';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

// API test
import { POST } from './route';

test('creates resource', async () => {
  const req = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify({ title: 'Test' }),
  });
  const res = await POST(req);
  expect(res.status).toBe(201);
});
```

## Deployment

### Vercel (Recommended)
```bash
# Connect repo to Vercel
vercel

# Set environment variables in Vercel Dashboard
# Database: Use Vercel Postgres or external
# Configure domain
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Project Checklist

When starting a new project:

- [ ] Update `package.json` name and description
- [ ] Configure `.env.local` with credentials
- [ ] Edit `src/config/site.ts` branding
- [ ] Update `tailwind.config.js` colors/fonts
- [ ] Modify `prisma/schema.prisma` for your domain
- [ ] Configure Stripe products (if using payments)
- [ ] Set up OAuth apps (Google, GitHub, etc.)
- [ ] Configure analytics (optional)
- [ ] Update this README

## License

MIT - Use freely for client projects.

---

Built with care for freelance developers who value quality and efficiency.
