# VibeStack

An AI-era developer learning platform focused on hands-on project completion.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook signing secret (see setup guide below)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### 3. Set Up Clerk Webhooks

**Important**: You must configure Clerk webhooks to sync user data with Supabase. Without this, users will encounter "User Not Found" errors.

Follow the detailed setup guide: [Clerk Webhook Setup](./Document/CLERK_WEBHOOK_SETUP.md)

Quick steps:
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/auth/webhook`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to `CLERK_WEBHOOK_SECRET` in `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (marketing)/         # Public pages (landing, pricing)
│   ├── (auth)/              # Authentication pages
│   ├── (onboarding)/        # Onboarding flow
│   ├── (dashboard)/         # Main app (docs, tutorials, snippets)
│   ├── actions/             # Server Actions
│   └── api/                 # API routes (webhooks)
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── layout/              # Layout components
│   └── onboarding/          # Onboarding components
├── lib/                     # Utility libraries
│   └── supabase/            # Supabase client
├── types/                   # TypeScript type definitions
├── Document/                # Project documentation
└── supabase/                # Database migrations
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Payments**: Stripe + Toss Payments
- **Testing**: Jest + Testing Library
- **Deployment**: Vercel

## Development Methodology

This project follows **Test-Driven Development (TDD)** and **Tidy First** principles:

- Write failing tests first
- Implement minimum code to pass tests
- Refactor only when tests are green
- Separate structural changes from behavioral changes
- Small, frequent commits

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.

## Key Features

### Content System
- **Docs**: Concept understanding (5-10 min reads)
- **Tutorials**: Complete projects (30 min - 3 hours)
- **Snippets**: Copy-paste solutions (10-50 lines)

### User Authentication & Sync
- Clerk authentication with automatic Supabase sync
- Webhook-based user data synchronization
- Comprehensive error handling

### Monetization
- Freemium + à la carte model
- Single purchases ($12 per content)
- Pro Plan ($12/month)
- Team Plan ($50/month)

## Documentation

- [Clerk Webhook Setup Guide](./Document/CLERK_WEBHOOK_SETUP.md) - **Start here to fix "User Not Found" errors**
- [Product Requirements](./Document/PRD.md)
- [Database Schema](./Document/ERD.md)
- [Folder Structure](./Document/folder-structure.md)
- [Design System](./Document/DesignStyle.md)

## Common Issues

### "User Not Found" Error During Onboarding

**Cause**: Clerk webhooks are not configured to sync user data to Supabase.

**Solution**: Follow the [Clerk Webhook Setup Guide](./Document/CLERK_WEBHOOK_SETUP.md)

### Webhook Tests Failing

**Cause**: Missing `CLERK_WEBHOOK_SECRET` environment variable.

**Solution**:
1. Copy `.env.example` to `.env.local`
2. Add your Clerk webhook secret
3. Restart the dev server

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- app/api/auth/webhook/__tests__/route.test.ts

# Run with coverage
npm run test:coverage
```

All webhook tests should pass:
- ✅ user.created creates user in Supabase
- ✅ user.updated updates user in Supabase
- ✅ user.deleted removes user from Supabase
- ✅ Proper error handling for all edge cases

## Contributing

This project follows strict TDD practices. Before making changes:

1. Write failing tests first
2. Implement minimum code to pass
3. Refactor only when tests are green
4. Run all tests before committing
5. No commits unless all tests pass

## License

Private - All rights reserved

## Support

For issues or questions, please refer to the documentation in the `Document/` folder or check the inline code comments.
