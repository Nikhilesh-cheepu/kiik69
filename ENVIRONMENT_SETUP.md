# Environment Variables Setup Guide

This document explains all the environment variables needed for the SkyHy Live Sports Brewery application (formerly KIIK 69 Sports Bar).

## Next.js App & Admin (current stack)

Used by the Next.js app (and admin panel).

### Required for app + DB

```bash
# Postgres (use public URL for Vercel/serverless)
DATABASE_URL_PUBLIC=postgresql://user:pass@host:port/db
# Optional: private URL for backend (e.g. Railway internal)
DATABASE_URL_PRIVATE=postgresql://...
```

If only one URL is set, the app uses `DATABASE_URL` or `DATABASE_URL_PUBLIC` or `DATABASE_URL_PRIVATE` (first available).

### Required for admin

```bash
# JWT signing (use a long random string in production)
ADMIN_JWT_SECRET=your-secret-at-least-32-chars
```

### One-time seed (first admin user)

```bash
# Set only when creating the first admin; remove or leave unset after
ADMIN_SEED_TOKEN=your-one-time-secret-token
```

Call `POST /api/admin/seed` with header `Authorization: Bearer <ADMIN_SEED_TOKEN>` and body `{ "email": "admin@example.com", "password": "your-password" }`. Then remove or unset `ADMIN_SEED_TOKEN`.

### Vercel Blob (media uploads)

```bash
# From Vercel: Storage → Blob → Create store, then copy token
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx
```

Add this in Vercel project → Settings → Environment Variables. For local dev, use `vercel env pull` or add to `.env.local`.

---

## Frontend Environment Variables (Vite – legacy)

All frontend environment variables must start with `VITE_` to be accessible in the browser.

### Required Variables

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_BACKEND_URL=https://your-backend-domain.com

# Optional OpenAI Settings
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_OPENAI_MAX_TOKENS=600
VITE_OPENAI_TEMPERATURE=0.7
VITE_OPENAI_TIMEOUT=30000
```

### Backend Environment Variables

```bash
# Core Configuration
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret_key

# OpenAI (Backend)
OPENAI_API_KEY=your_openai_api_key_here

# Instagram Bot Configuration
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_VERIFY_TOKEN=your_instagram_verify_token
```

## Vercel Configuration

### Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the required variables listed above
4. Make sure to set the correct scope (Production, Preview, Development)

### Vercel Build Configuration

This project is a **Next.js app**.

- **Framework preset**: Next.js  
- **Root directory**: `/` (project root)  
- **Build command**: `npm run build`  
- **Install command**: `npm install`  
- **Output directory**: leave as the default that Vercel sets for Next.js (no manual override needed)

## Local Development

### Creating `.env.local`

1. Create a `.env.local` file in your project root.
2. Add the required environment variables listed earlier in this document (database, Vercel Blob, etc.).
3. Never commit `.env.local` (it's already in `.gitignore`).

### Basic dev commands

```bash
npm install
npm run dev
```

## Environment Validation

The application automatically validates environment variables on startup:

- **Development**: Shows warnings for missing variables
- **Production**: Shows errors for missing required variables

## Testing Environment Variables

You can test if your environment variables are properly configured by:

1. Running the app locally: `npm run dev`
2. Checking the browser console for validation messages
3. Testing the chat functionality

## Troubleshooting

### Common Issues

1. **"VITE_ variables not found"**: Make sure variables start with `VITE_`
2. **Build fails on Vercel**: Check all required environment variables are set
3. **API calls failing**: Verify `VITE_BACKEND_URL` is correct

### Vercel Build Issues

If you encounter build issues:
1. Check the build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure the build command works locally: `npm run build`

## Security Notes

- Never expose API keys in client-side code
- Use environment variables for all sensitive configuration
- The `.env` file is automatically ignored by Git
- Vercel environment variables are encrypted and secure
