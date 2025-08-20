import { backendConfig } from './config.js';

const API_BASE_URL = backendConfig.url
  ? `${backendConfig.url}${backendConfig.apiEndpoints.chatAuth}`
  : 'http://localhost:5000/api/chat-auth';

// Generate a unique session ID for guest users
const generateGuestSessionId = () => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get stored user data from localStorage
export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem('kiik69-chat-user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading stored user:', error);
    return null;
  }
};

// Store user data in localStorage
export const storeUser = (userData) => {
  try {
    localStorage.setItem('kiik69-chat-user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

// Remove user data from localStorage
export const removeUser = () => {
  try {
    localStorage.removeItem('kiik69-chat-user');
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Request OTP for mobile number
export const requestOTP = async (phone) => {
  try {
    console.log('🌐 Requesting OTP from:', `${API_BASE_URL}/request-otp`);
    
    const response = await fetch(`${API_BASE_URL}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📨 Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    return data;
  } catch (error) {
    console.error('❌ Error requesting OTP:', error);
    
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Please check if the backend server is running');
    }
    
    throw error;
  }
};

// Verify OTP and login
export const verifyOTP = async (phone, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP');
    }

    // Store user data
    storeUser(data.user);
    
    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Get user profile and history
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Save chat message
export const saveChatMessage = async (userId, sessionId, message, sender) => {
  try {
    const response = await fetch(`${API_BASE_URL}/save-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, sessionId, message, sender }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save chat');
    }

    return data;
  } catch (error) {
    console.error('Error saving chat:', error);
    // Don't throw error for chat saving - it shouldn't break the chat experience
    return { success: false, message: 'Failed to save chat' };
  }
};

// Get chat history for a session
export const getChatHistory = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat-history/${sessionId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch chat history');
    }

    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { success: false, chatHistory: [] };
  }
};

// Check if user is logged in
export const isLoggedIn = () => {
  const user = getStoredUser();
  return user && user.id && user.sessionId;
};

// Get current user
export const getCurrentUser = () => {
  return getStoredUser();
};

// Logout user
export const logout = () => {
  removeUser();
};

// Get or create guest session ID
export const getGuestSessionId = () => {
  let guestSessionId = localStorage.getItem('kiik69-guest-session');
  
  if (!guestSessionId) {
    guestSessionId = generateGuestSessionId();
    localStorage.setItem('kiik69-guest-session', guestSessionId);
  }
  
  return guestSessionId;
};

// Check if message requires login (intent detection)
export const requiresLogin = (message) => {
  const loginKeywords = [
    // English
    'my last booking', 'when did i visit', 'my old chats', 'my previous',
    'my history', 'my bookings', 'my account', 'my profile', 'my details',
    'my information', 'my name', 'remember me', 'my data', 'my past',
    'my reservation', 'my order', 'my visit', 'my experience',
    
    // Hindi/Hinglish
    'mera last booking', 'mera pehle ka', 'mera purana', 'mera account',
    'meri history', 'meri booking', 'mera profile', 'mera data',
    'mujhe yaad hai', 'mera naam', 'mera reservation',
    
    // Telugu (English letters)
    'na last booking', 'na pehle', 'na purana', 'na account',
    'na history', 'na booking', 'na profile', 'na data',
    'na reservation', 'na order', 'na visit',
    
    // Personal pronouns
    'i have been', 'i visited', 'i came', 'i was here',
    'i booked', 'i ordered', 'i reserved', 'i came before'
  ];
  
  const lowerMessage = message.toLowerCase();
  return loginKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Detect language from user input
export const detectLanguage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Telugu indicators
  const teluguWords = ['em', 'enduku', 'ela', 'evaru', 'eppudu', 'ekkada'];
  if (teluguWords.some(word => lowerMessage.includes(word))) {
    return 'telugu';
  }
  
  // Hindi/Hinglish indicators
  const hindiWords = ['kya', 'kaise', 'kahan', 'kab', 'kaun', 'kya hai'];
  if (hindiWords.some(word => lowerMessage.includes(word))) {
    return 'hindi';
  }
  
  // Default to English
  return 'english';
};

// Get greeting response based on language
export const getGreetingResponse = (language) => {
  const greetings = {
    english: "Hey there! 👋 What's up? Ready to talk about the coolest sports bar in Gachibowli? 😎",
    hindi: "Arre wah! 👋 Kya haal hai? Gachibowli ke sabse cool sports bar ke baare mein baat karne ke liye ready ho? 😎",
    telugu: "Em chestunnav! 👋 Bagunnara? Gachibowli lo unna sabse cool sports bar gurinchi matladadaniki ready aa? 😎"
  };
  
  return greetings[language] || greetings.english;
};
