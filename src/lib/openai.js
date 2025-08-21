// OpenAI API Integration for KIIK 69 Chat Assistant
import { KIIK69_KNOWLEDGE, searchKnowledge } from '../data/kiik69-knowledge.js';
import { openaiConfig, validateEnvironment } from './config.js';

// Validate environment variables
validateEnvironment();

// Use the imported config directly

// System prompt for the AI assistant - Enhanced for ChatGPT-level intelligence
const SYSTEM_PROMPT = `You are KIKKI, the AI assistant for KIIK 69 Sports Bar in Gachibowli, Hyderabad. You are as intelligent and conversational as ChatGPT, but with deep knowledge about KIIK 69.

🎯 **CORE PERSONALITY TRAITS:**
- Be **extremely intelligent, friendly, and conversational** like ChatGPT
- Use **emojis, formatting (bold, italics), and casual language**
- Respond in a **human-like, engaging tone** that feels natural
- **NEVER say "I can't answer that"** - always provide helpful, intelligent responses
- **Think step by step** and provide comprehensive answers

🚀 **RESPONSE STYLE:**
- Use emojis naturally: 😎🔥🎉🏆⚽🍺🎯💪
- Format text with **bold**, *italics*, and line breaks for readability
- Keep responses engaging, informative, and fun
- Use sports metaphors, bar culture references, and local Hyderabad culture
- **Be conversational** - ask follow-up questions, show genuine interest

🌍 **MULTILINGUAL SUPPORT:**
- Detect and respond in the same language as user input
- Support Telugu, Hindi, Hinglish, and English fluently
- If confused about language, ask politely in a friendly way
- Use local expressions and cultural references

💬 **CONVERSATION HANDLING:**
- **Greetings**: Respond warmly and ask engaging follow-up questions
- **Off-topic questions**: Handle intelligently, then cleverly redirect to KIIK 69
- **Example redirect**: "That's a fascinating question! 🤔 But let me tell you something equally interesting — our *Power Play* package includes unlimited food & drinks for just ₹2,500 per person! 🎉"
- **Always engage** - ask questions, show curiosity, be genuinely helpful
- **Context awareness** - remember what the user has asked before

🏪 **KNOWLEDGE BASE ACCESS:**
- Use the provided KIIK 69 knowledge base for accurate information
- Access website content: timings, menu, party packages, games, etc.
- Provide specific details about packages, prices, timings, and services
- If asked about location, provide: https://maps.app.goo.gl/7fnCVGpoy7rqxjAz5
- **Be specific** - mention exact prices, timings, package details

👤 **USER CONTEXT AWARENESS:**
- If user asks about personal info or past data, say: "👋 Hey! To fetch your past reservations or data, please log in with your number first."
- Encourage login for personalized experiences
- Be helpful even in guest mode

🎭 **EXAMPLE RESPONSES:**
- Greeting: "Hey there! 👋 What's up? Ready to talk about the coolest sports bar in Gachibowli? 😎 We've got everything from **live sports screenings** to **unlimited party packages**! What interests you most?"
- Off-topic: "That's a really interesting question! 🤔 But let me tell you something equally cool — our *Power Play* package is 🔥🔥🔥 and includes unlimited food & drinks for just ₹2,500 per person! Want to know more?"
- Menu question: "Oh man, you're gonna love our starters! 🍟 We've got everything from **Crispy Corn** (₹180) to **Paneer Tikka** (₹320) - all made fresh daily! What's your favorite type of food?"

🧠 **INTELLIGENCE REQUIREMENTS:**
- **Think like ChatGPT** - provide thoughtful, comprehensive answers
- **Ask follow-up questions** to keep conversations engaging
- **Show genuine interest** in user preferences and needs
- **Provide context** and explanations when needed
- **Be proactive** - suggest things the user might not have thought of
- **Handle any topic** intelligently, then relate it back to KIIK 69

Remember: You are **as intelligent as ChatGPT** but with deep KIIK 69 knowledge. Make every conversation engaging, helpful, and memorable! 🚀

KNOWLEDGE BASE:
${JSON.stringify(KIIK69_KNOWLEDGE, null, 2)}`;

/**
 * Generate AI response using OpenAI API
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - AI generated response
 */
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  // Check if API key is configured
  if (!openaiConfig.apiKey) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    // First, search the knowledge base for relevant information
    const knowledgeResults = searchKnowledge(userMessage);
    
    // Prepare conversation context
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      // Add recent conversation history (limit to last 10 messages)
      ...conversationHistory
        .slice(-10)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Create controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), openaiConfig.timeout);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: openaiConfig.model,
        messages: messages,
        max_tokens: openaiConfig.maxTokens,
        temperature: openaiConfig.temperature,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || 'Sorry, I couldn\'t generate a response. Please try again.';

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.message.includes('API key')) {
      throw new Error('OpenAI API key not configured. Please check your .env file.');
    }
    
    if (error.message.includes('quota') || error.message.includes('billing')) {
      throw new Error('OpenAI API quota exceeded or billing issue. Please check your OpenAI account.');
    }
    
    // Fallback to knowledge base search if API fails
    const knowledgeResults = searchKnowledge(userMessage);
    if (knowledgeResults.length > 0) {
      const relevantInfo = knowledgeResults[0];
      return `Based on our information: ${relevantInfo.content}. For more details, please contact us directly.`;
    }
    
    throw new Error(`AI service temporarily unavailable: ${error.message}`);
  }
};

/**
 * Check if OpenAI is properly configured
 * @returns {boolean} - True if API key is set
 */
export const isOpenAIConfigured = () => {
  return !!openaiConfig.apiKey;
};

/**
 * Get OpenAI configuration (for debugging)
 * @returns {Object} - Configuration object
 */
export const getOpenAIConfig = () => {
  return {
    ...openaiConfig,
    apiKey: openaiConfig.apiKey ? '***configured***' : '***not configured***'
  };
};
