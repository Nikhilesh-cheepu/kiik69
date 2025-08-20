# Environment Variables Setup Guide

This document explains all the environment variables needed for the KIIK 69 application.

## Frontend Environment Variables (Vite)

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

The `vercel.json` file is already configured with:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: `vite`

## Local Development

### Creating .env file

1. Create a `.env` file in your project root
2. Add the required environment variables
3. Never commit the `.env` file (it's already in `.gitignore`)

### Example .env file

```bash
# Frontend
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_BACKEND_URL=http://localhost:5000
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_OPENAI_MAX_TOKENS=600
VITE_OPENAI_TEMPERATURE=0.7
VITE_OPENAI_TIMEOUT=30000

# Backend
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=your_local_database_url
JWT_SECRET=your_local_jwt_secret
OPENAI_API_KEY=sk-your-key-here
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
