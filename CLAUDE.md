# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Methodology

### TDD (Test-Driven Development) Principles

This project follows **Kent Beck's Test-Driven Development** and **Tidy First** principles strictly.

#### Core TDD Cycle: Red → Green → Refactor

1. **Red**: Write a failing test that defines a small increment of functionality
2. **Green**: Implement the minimum code needed to make the test pass
3. **Refactor**: Improve structure while keeping tests green

#### TDD Guidelines

- Start by writing a failing test that defines behavior
- Use meaningful test names (e.g., `shouldReturnUserAccessibleContent`)
- Make test failures clear and informative
- Write just enough code to make the test pass - no more
- Once tests pass, consider if refactoring is needed
- Repeat the cycle for new functionality
- When fixing a defect: first write an API-level failing test, then write the smallest possible test that replicates the problem, then get both tests to pass

#### Tidy First Approach

Separate all changes into two distinct types:

1. **STRUCTURAL CHANGES**: Rearranging code without changing behavior
   - Renaming variables/functions
   - Extracting methods
   - Moving code between files
   - Reformatting

2. **BEHAVIORAL CHANGES**: Adding or modifying actual functionality
   - New features
   - Bug fixes
   - Logic changes

**Rules**:
- Never mix structural and behavioral changes in the same commit
- Always make structural changes first when both are needed
- Validate structural changes don't alter behavior by running tests before and after

#### Commit Discipline

Only commit when:
1. ALL tests are passing
2. ALL compiler/linter warnings have been resolved
3. The change represents a single logical unit of work
4. Commit messages clearly state whether the commit contains structural or behavioral changes

Use small, frequent commits rather than large, infrequent ones.

#### Code Quality Standards

- Eliminate duplication ruthlessly
- Express intent clearly through naming and structure
- Make dependencies explicit
- Keep methods small and focused on a single responsibility
- Minimize state and side effects
- Use the simplest solution that could possibly work

#### Refactoring Guidelines

- Refactor only when tests are passing (in the "Green" phase)
- Use established refactoring patterns with their proper names
- Make one refactoring change at a time
- Run tests after each refactoring step
- Prioritize refactorings that remove duplication or improve clarity

#### Example TDD Workflow

When approaching a new feature:

1. Write a simple failing test for a small part of the feature
2. Implement the bare minimum to make it pass
3. Run tests to confirm they pass (Green)
4. Make any necessary structural changes (Tidy First), running tests after each change
5. Commit structural changes separately
6. Add another test for the next small increment of functionality
7. Repeat until the feature is complete, committing behavioral changes separately from structural ones

**Always write one test at a time, make it run, then improve structure. Always run all the tests (except long-running tests) each time.**

## Project Overview

**VibeStack** is an AI-era developer learning platform focused on hands-on project completion. The platform provides three content pillars: Documentation (Docs), Tutorial Projects, and Code Snippets, specifically designed for developers using AI coding tools like Cursor and Copilot.

**Core Value Proposition**: Transform "reading docs" into "shipping projects" by providing 80% practical content with real-world implementation examples, prompts, and error solutions.

## Technology Stack

```yaml
Framework: Next.js 14.2 (App Router)
Language: TypeScript 5.3
Styling: Tailwind CSS 3.4 + Shadcn/ui
Database: Supabase (PostgreSQL)
Auth: Clerk
Payments: Stripe
Search: Algolia
Hosting: Vercel
Analytics: PostHog
Error Tracking: Sentry
```

## Architecture & Key Concepts

### App Router Structure

The project uses Next.js 14 App Router with **Route Groups** for logical separation:

- `(marketing)/` - Landing, pricing, about pages (public)
- `(auth)/` - Sign-in, sign-up pages (Clerk integration)
- `(onboarding)/` - Welcome flow, stack selection (first-time users)
- `(dashboard)/` - Main app (docs, tutorials, snippets, projects)
- `(tools)/` - Error clinic, project map, AI chat
- `(checkout)/` - Purchase and subscription flows

**Important**: Route groups don't affect URL structure. `app/(marketing)/page.tsx` renders at `/`, not `/(marketing)`.

### Database Architecture

**Core Pattern**: Single `contents` table for all content types (docs, tutorials, snippets) with `type` enum for differentiation. This prevents JOIN explosion and simplifies queries.

**Access Control Model**:
- `user_contents` table tracks access rights (free/purchased/subscription)
- `subscriptions` table manages Pro/Team plans
- Row Level Security (RLS) enforced via Supabase policies

**Key Relationships**:
```
users → subscriptions (1:1)
users → purchases (1:N)
purchases → user_contents (1:N)
contents → user_progress (1:N per user)
contents → ratings (1:N)
```

### Content System

**Three Pillars**:
1. **Docs** (`type='doc'`) - Concept understanding (5-10 min reads)
2. **Tutorials** (`type='tutorial'`) - Complete projects (30 min - 3 hours)
3. **Snippets** (`type='snippet'`) - Copy-paste solutions (10-50 lines)

**MDX Content**: All content stored as MDX in `contents.content` field, supporting:
- Code blocks with syntax highlighting (Shiki)
- Checkpoints and progress tracking
- Interactive quizzes
- Error diagnostics

### Monetization Model

**Freemium + À la carte**:
- Free: Basic docs and 1-2 starter tutorials
- Single Purchase: $12 per premium content
- Pro Plan: $12/month for unlimited access
- Team Plan: $50/month for 5 seats

**Credit System**: Single purchases convert to Pro credits (e.g., $50 spent = 4 months free Pro)

## Development Commands

**Note**: This is a planning-phase project. The following commands will be used once development starts:

```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint check
npm run type-check   # TypeScript check

# Database
npm run db:generate  # Generate Supabase types
npm run db:push      # Push schema changes
npm run db:reset     # Reset local database

# Testing (when implemented)
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:e2e     # E2E tests
```

## Key Implementation Details

### Server Actions vs API Routes

**Use Server Actions for**:
- Content CRUD operations (`app/actions/content.ts`)
- User progress updates (`app/actions/progress.ts`)
- Project management (`app/actions/project.ts`)

**Use API Routes for**:
- Webhook handlers (`/api/stripe/webhook`, `/api/auth/webhook`)
- External service proxies (`/api/content/search`)
- Checkout session creation (`/api/stripe/checkout`)

### Authentication Flow

Uses **Clerk** for auth with custom user sync:
1. Clerk handles sign-in/sign-up UI
2. Webhook syncs user to `users` table via `clerk_user_id`
3. App queries local DB using `clerk_user_id` for business logic

### Content Access Check Pattern

```typescript
// Check if user can access content
async function checkAccess(userId: string, contentId: string): Promise<boolean> {
  // 1. Check if content is free
  const content = await getContent(contentId);
  if (!content.is_premium) return true;

  // 2. Check if user purchased
  const purchased = await hasUserPurchased(userId, contentId);
  if (purchased) return true;

  // 3. Check if user has active Pro/Team subscription
  const subscription = await getUserSubscription(userId);
  return subscription?.plan_type in ['pro', 'team'] && subscription?.status === 'active';
}
```

### Search Implementation

**Algolia Integration**:
- Index all published content with metadata (stack, tags, difficulty)
- Natural language queries: "how to add Stripe checkout"
- Filter by stack: `{"framework": "Next.js 14", "auth": "Clerk"}`
- Return mixed results (docs, tutorials, snippets)

## Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Trust, technology
- **Secondary**: Purple (#a855f7) - Premium, Pro features
- **Semantic**: Green (success), Yellow (warning), Red (error)

### Typography
- **Sans**: Inter (body, UI)
- **Mono**: JetBrains Mono (code, prompts)
- Fluid typography with `clamp()` for responsive scaling

### Component Patterns
- All UI components from Shadcn/ui (`components/ui/`)
- Layout components in `components/layout/`
- Content-specific in `components/content/`
- Reusable: ContentCard, CopyButton, ProgressBar, RatingWidget

### Key UX Features
1. **Trust Indicators**: Real-time success rate, user count, avg completion time
2. **Copy Buttons**: One-click copy for all code blocks and prompts
3. **Checkpoints**: Step-by-step validation in tutorials
4. **Error Clinic**: AI-powered error diagnosis tool
5. **Progress Tracking**: Auto-save user position in tutorials

## Database Queries to Know

### Get User's Accessible Content
```sql
-- Returns all content user can access (free + purchased + subscription)
WITH user_subscription AS (
  SELECT plan_type, status FROM subscriptions WHERE user_id = $1
)
SELECT c.*, uc.access_type, up.progress_pct
FROM contents c
LEFT JOIN user_contents uc ON c.id = uc.content_id AND uc.user_id = $1
LEFT JOIN user_progress up ON c.id = up.content_id AND up.user_id = $1
WHERE c.status = 'published'
  AND (c.is_premium = false OR uc.content_id IS NOT NULL
       OR EXISTS (SELECT 1 FROM user_subscription
                  WHERE plan_type IN ('pro', 'team') AND status = 'active'))
```

### Calculate Real-time Success Rate
```sql
-- For content trust indicators
SELECT
  COUNT(CASE WHEN works = true THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100 as success_rate,
  COUNT(*) as total_ratings,
  AVG(time_spent_mins) as avg_time
FROM ratings
WHERE content_id = $1 AND created_at > NOW() - INTERVAL '30 days'
```

## Important File Locations

```
/Document/               Documentation (planning phase)
  ├── PRD.md            Product requirements and features
  ├── ERD.md            Database schema and relationships
  ├── folder-structure.md  App Router structure
  └── DesignStyle.md    Design system and components

/app/                   (To be created)
  ├── (dashboard)/      Main authenticated app
  ├── (marketing)/      Public pages
  ├── actions/          Server Actions
  └── api/              API routes (webhooks, external)

/components/            (To be created)
  ├── ui/               Shadcn components
  ├── layout/           Headers, footers, sidebars
  ├── content/          Content display components
  └── dashboard/        Dashboard-specific

/lib/                   (To be created)
  ├── supabase.ts       DB client
  ├── stripe.ts         Payment client
  ├── clerk.ts          Auth config
  └── utils.ts          Helpers
```

## Development Priorities (MVP - Week 1-10)

### Phase 1 (Week 1-4): Foundation
- Next.js project setup
- Supabase + Clerk + Stripe integration
- Design system implementation
- Marketing landing page
- Auth flow

### Phase 2 (Week 5-7): Content System
- MDX rendering with code highlighting
- Content CRUD (Server Actions)
- Tutorial step-by-step UI
- Progress tracking
- 30 initial docs

### Phase 3 (Week 8-10): Monetization & Launch
- Stripe checkout integration
- Error clinic tool
- Search (Algolia)
- Beta testing (100 users)
- Product Hunt launch

## Special Considerations

### Performance Optimization
- Use Server Components by default
- Client Components only for interactivity (`'use client'`)
- Optimize images with Next.js `<Image>`
- Implement ISR for content pages (`revalidate: 3600`)

### Error Handling
- All errors tracked via Sentry
- User-friendly error messages (no stack traces)
- Error clinic uses pattern matching from `error_patterns` table

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Focus indicators on all focusable elements
- Screen reader support with proper ARIA labels

### Security
- RLS policies on all Supabase tables
- Stripe webhook signature verification
- Clerk webhook signature verification
- Environment variables for all secrets
- Content validation before rendering (prevent XSS)

## Common Patterns

### Creating New Content Type
1. Add enum value to `content_type` in database
2. Update TypeScript types in `types/content.ts`
3. Create display component in `components/content/`
4. Add route in `app/(dashboard)/[type]/[slug]/page.tsx`
5. Update search indexing

### Adding Stripe Product
1. Create product in Stripe Dashboard
2. Add price_id to environment variables
3. Create checkout session in `/api/stripe/checkout`
4. Handle webhook events in `/api/stripe/webhook`
5. Update user permissions in database

### Implementing Feature Behind Paywall
1. Check user subscription status
2. Show upgrade CTA if not subscribed
3. Track "paywall hit" event for analytics
4. A/B test messaging for conversion optimization

## Target Users

**Primary**: Non-technical founders and junior developers (1-2 years) using AI coding tools to build projects

**Use Case**: Build complete MVP (e.g., SaaS with auth, payments, DB) in 2-4 weeks without getting stuck on errors or incomplete documentation

## Product Philosophy

**80/20 Rule**: 80% practical implementation, 20% theory
**Prompt-First**: Provide AI-ready prompts alongside explanations
**Error-Aware**: Document top 5 errors for every tutorial
**Success-Driven**: Track and display real completion rates, not vanity metrics
