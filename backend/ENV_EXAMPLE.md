# Backend Environment Variables

## Required Variables

Create a `.env` file in the backend directory with these variables:

```bash
# Core Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com

# Database (REQUIRED - PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT Secret (for future use)
JWT_SECRET=your_jwt_secret_key_here

# OpenAI Configuration (for chat AI)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=150

# Instagram Bot Configuration (optional)
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_VERIFY_TOKEN=your_instagram_verify_token
```

## Database Setup

### PostgreSQL Database
- **Required**: `DATABASE_URL` must be set
- **Format**: `postgresql://username:password@host:port/database_name`
- **SSL**: Automatically configured for production

### Tables Created Automatically
- `chat_users` - User authentication and sessions
- `user_chats` - Chat history storage
- `party_packages` - Party package management

## Production Deployment

### Railway/Heroku/Vercel
1. Set `NODE_ENV=production`
2. Set `DATABASE_URL` to your PostgreSQL connection string
3. Set `FRONTEND_URL` to your production frontend domain
4. Set `OPENAI_API_KEY` for AI chat functionality

### Environment Variables Priority
1. **Required**: `DATABASE_URL` (PostgreSQL connection)
2. **Required**: `NODE_ENV` (production/development)
3. **Optional**: `OPENAI_API_KEY` (for AI chat)
4. **Optional**: Instagram bot variables

## Security Notes

- Never expose `DATABASE_URL` in client-side code
- Use environment variables for all sensitive configuration
- The `.env` file is automatically ignored by Git
- Production environment variables are encrypted and secure
