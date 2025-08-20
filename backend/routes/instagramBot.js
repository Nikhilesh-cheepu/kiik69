const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

// Environment variables (add to your .env file)
const {
  INSTAGRAM_ACCESS_TOKEN,
  INSTAGRAM_APP_SECRET,
  INSTAGRAM_VERIFY_TOKEN,
  OPENAI_API_KEY,
  OPENAI_MODEL = 'gpt-4o',
  OPENAI_MAX_TOKENS = 150
} = process.env;

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === INSTAGRAM_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook endpoint for receiving messages
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  
  // Verify webhook signature
  if (!verifyWebhookSignature(req.body, signature)) {
    console.log('❌ Invalid webhook signature');
    return res.sendStatus(401);
  }

  const body = req.body;
  
  // Check if this is a page webhook
  if (body.object === 'instagram') {
    try {
      // Process each entry
      body.entry.forEach(entry => {
        entry.messaging?.forEach(messagingEvent => {
          handleInstagramMessage(messagingEvent);
        });
      });
      
      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

// Verify webhook signature from Meta
function verifyWebhookSignature(body, signature) {
  if (!signature || !INSTAGRAM_APP_SECRET) {
    return false;
  }

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', INSTAGRAM_APP_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Handle incoming Instagram messages
async function handleInstagramMessage(messagingEvent) {
  const senderId = messagingEvent.sender.id;
  const message = messagingEvent.message;

  if (!message || !message.text) {
    return;
  }

  console.log(`📱 Received message from ${senderId}: ${message.text}`);

  try {
    // Generate AI response
    const aiResponse = await generateAIResponse(message.text, senderId);
    
    // Send response back to Instagram
    await sendInstagramMessage(senderId, aiResponse);
    
    console.log(`✅ Response sent to ${senderId}: ${aiResponse}`);
  } catch (error) {
    console.error('❌ Error handling message:', error);
  }
}

// Generate AI response using OpenAI
async function generateAIResponse(userMessage, senderId) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for KIIK 69 Sports Bar. 
            You help customers with inquiries about our services, menu, party packages, 
            bookings, and general information. Be friendly, professional, and helpful. 
            Keep responses concise and engaging. If someone asks about something 
            unrelated to KIIK 69, politely redirect them back to our services.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ OpenAI API error:', error.response?.data || error.message);
    return 'Sorry, I\'m having trouble processing your request right now. Please try again later or contact us directly.';
  }
}

// Send message via Instagram Graph API
async function sendInstagramMessage(recipientId, messageText) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: messageText }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          access_token: INSTAGRAM_ACCESS_TOKEN
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Instagram API error:', error.response?.data || error.message);
    throw new Error('Failed to send Instagram message');
  }
}

// Test endpoint to verify setup
router.get('/test', (req, res) => {
  res.json({
    status: 'Instagram Bot is running!',
    timestamp: new Date().toISOString(),
    config: {
      hasAccessToken: !!INSTAGRAM_ACCESS_TOKEN,
      hasAppSecret: !!INSTAGRAM_APP_SECRET,
      hasVerifyToken: !!INSTAGRAM_VERIFY_TOKEN,
      hasOpenAIKey: !!OPENAI_API_KEY,
      openaiModel: OPENAI_MODEL
    }
  });
});

// Manual message sending endpoint (for testing)
router.post('/send-message', async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    
    if (!recipientId || !message) {
      return res.status(400).json({ error: 'recipientId and message are required' });
    }

    const result = await sendInstagramMessage(recipientId, message);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
