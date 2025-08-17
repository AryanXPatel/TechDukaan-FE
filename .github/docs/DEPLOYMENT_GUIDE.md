# TechDukaan Frontend - Production Deployment Guide

## 🚀 Quick Start for Fresh Clone

### Prerequisites

- Node.js 18+
- npm 9+ or pnpm (recommended)

### Installation Steps

1. **Clone and Install Dependencies**

```bash
git clone <repository-url>
cd New-TechDukaan-Frontend
pnpm install
# or
npm install
```

2. **Environment Configuration**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

- Supabase URL and Key
- MeiliSearch host and API key
- Medusa backend URL
- Other optional services

3. **Run Development Server**

```bash
pnpm dev
# or
npm run dev
```

## 📦 Updated Dependencies

### Major Dependencies Added/Updated:

- **@supabase/supabase-js**: Fixed version `^2.39.3` (was "latest")
- **meilisearch**: Fixed version `^0.41.0` (was "latest")
- **next-themes**: Fixed version `^0.3.0` (was "latest")
- **react/react-dom**: Fixed version `^19.0.0` (was "^19")
- **eslint & eslint-config-next**: Added for proper linting
- **tsx**: Added for running TypeScript scripts
- **autoprefixer**: Moved to dependencies (was missing)

### New Scripts Added:

- `type-check`: Type checking without building
- `clean`: Clean .next directory
- `configure-meilisearch`: Setup MeiliSearch index
- `debug-meilisearch`: Debug MeiliSearch connection

## 🔧 Production Build

```bash
# Type check
pnpm type-check

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📋 Environment Variables Required

### Essential (App won't work without these):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MEILISEARCH_HOST`
- `NEXT_PUBLIC_MEILISEARCH_API_KEY`

### Optional but Recommended:

- `NEXT_PUBLIC_APP_URL` (for OAuth redirects)
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (for product data)
- `NEXT_PUBLIC_PUBLISHABLE_API_KEY` (for Medusa)

## 🌐 Vercel Deployment

### Automatic Deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_MEILISEARCH_HOST=your_meilisearch_host
NEXT_PUBLIC_MEILISEARCH_API_KEY=your_meilisearch_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🔍 Features

### Authentication

- ✅ Supabase OAuth (Google, Facebook)
- ✅ Email/Password authentication
- ✅ Protected routes with AuthGuard
- ✅ User session management

### E-commerce Features

- ✅ Product catalog with MeiliSearch
- ✅ Shopping cart (localStorage + Supabase sync)
- ✅ Wishlist (localStorage + Supabase sync)
- ✅ Product comparison
- ✅ Checkout flow (authenticated users only)

### UI/UX

- ✅ Responsive design
- ✅ Dark/Light theme toggle
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error boundaries

## 🚨 Troubleshooting

### Common Issues:

1. **"Module not found" errors**

   - Run `pnpm install` or `npm install`
   - Clear `.next` folder: `pnpm clean`

2. **Environment variable errors**

   - Check `.env.local` exists and has correct values
   - Restart development server after env changes

3. **Supabase connection issues**

   - Verify URL and key in Supabase dashboard
   - Check if project is paused/inactive

4. **MeiliSearch errors**
   - Ensure MeiliSearch server is running
   - Check API key permissions

## 📝 Package.json Changes Summary

**Added missing dependencies:**

- eslint, eslint-config-next (linting)
- tsx (TypeScript execution)
- autoprefixer (CSS processing)

**Fixed version specifications:**

- Replaced "latest" with specific versions for stability
- Added proper React 19 version constraints
- Added Node.js engine requirements

**Added utility scripts:**

- Type checking, cleaning, MeiliSearch setup

This ensures the project will work consistently across all environments and deployments.
