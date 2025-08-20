# 🚀 Instagram Bot Setup Guide

## 📋 **Prerequisites**
- Meta Developer Account
- Instagram Business/Creator Account
- OpenAI API Key
- Express.js Backend (already set up)

## 🔧 **Step 1: Meta App Setup**

### 1.1 Create Meta App
1. Go to [Meta Developers](https://developers.facebook.com/)
2. Click "Create App" → "Business" → "Business"
3. Fill in app details and create

### 1.2 Configure Instagram Basic Display
1. In your app dashboard, go to "Add Product"
2. Add "Instagram Basic Display"
3. Complete the setup process

### 1.3 Get Required Credentials
- **App ID**: Found in app dashboard
- **App Secret**: Generate in app settings
- **Access Token**: Generate with required permissions

## 🔑 **Step 2: Environment Variables**

Add these to your `.env` file:

```bash
# Instagram Bot Configuration
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
INSTAGRAM_VERIFY_TOKEN=your_custom_verify_token_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=150
```

## 🌐 **Step 3: Webhook Configuration**

### 3.1 Set Webhook URL
1. In Meta app dashboard, go to "Webhooks"
2. Add webhook URL: `https://yourdomain.com/api/instagram-bot/webhook`
3. Verify token: Use the same value as `INSTAGRAM_VERIFY_TOKEN`
4. Subscribe to: `messages`, `messaging_postbacks`

### 3.2 Webhook Verification
- GET `/api/instagram-bot/webhook` - Meta verification
- POST `/api/instagram-bot/webhook` - Receives messages

## 🧪 **Step 4: Testing**

### 4.1 Test Endpoint
```bash
GET /api/instagram-bot/test
```
This shows if all environment variables are configured.

### 4.2 Manual Message Test
```bash
POST /api/instagram-bot/send-message
{
  "recipientId": "instagram_user_id",
  "message": "Test message"
}
```

## 📱 **Step 5: Instagram Integration**

### 5.1 Connect Instagram Account
1. In Meta app, go to "Instagram Basic Display"
2. Add Instagram test users
3. Generate access token with required permissions

### 5.2 Required Permissions
- `instagram_basic`
- `instagram_content_publish`
- `pages_messaging`

## 🔒 **Security Features**

- **Webhook Signature Verification**: Prevents fake webhooks
- **Rate Limiting**: Built into Express.js
- **Error Handling**: Graceful fallbacks
- **Logging**: Comprehensive request/response logging

## 🚨 **Common Issues & Solutions**

### Issue: Webhook verification fails
- Check `INSTAGRAM_VERIFY_TOKEN` matches Meta's token
- Ensure webhook URL is accessible

### Issue: Messages not sending
- Verify `INSTAGRAM_ACCESS_TOKEN` is valid
- Check Instagram account permissions
- Ensure account is business/creator type

### Issue: OpenAI errors
- Verify `OPENAI_API_KEY` is valid
- Check API quota and billing
- Ensure model name is correct

## 📊 **Monitoring & Logs**

The bot logs all activities:
- ✅ Webhook verification
- 📱 Incoming messages
- 🤖 AI responses generated
- 📤 Messages sent
- ❌ Errors and failures

## 🔄 **Next Steps**

1. **Deploy to production** with HTTPS
2. **Add conversation context** for better AI responses
3. **Implement rate limiting** for Instagram API
4. **Add analytics** and message tracking
5. **Create admin dashboard** for monitoring

## 📞 **Support**

For issues:
1. Check server logs
2. Verify environment variables
3. Test individual endpoints
4. Check Meta app status
5. Verify Instagram account permissions

---

**🎯 Your Instagram Bot is now ready to automatically respond to DMs using AI!**
