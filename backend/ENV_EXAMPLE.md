# Backend Environment Variables

## Required Variables

Create a `.env` file in the backend directory with these variables:

```bash
# Core Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=your_postgresql_database_url_here
# For local development, leave empty to use SQLite

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=150

# Instagram Bot Configuration
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
INSTAGRAM_VERIFY_TOKEN=your_instagram_verify_token_here

# Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Email Configuration (for email OTP fallback)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password_here
```

## Setup Instructions

### 1. Twilio Setup (for SMS OTP)
1. Sign up at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. Add these to your `.env` file

### 2. Gmail Setup (for Email OTP)
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password
3. Use your Gmail address and app password in `.env`

### 3. Local Development
- Leave `DATABASE_URL` empty to use SQLite
- Set `NODE_ENV=development`
- Use local URLs for frontend and backend

### 4. Production
- Set `NODE_ENV=production`
- Use production database URL
- Use production frontend URL
- Ensure all API keys are set
