import { backendConfig } from './config.js';

const API_BASE_URL = backendConfig.url
  ? `${backendConfig.url}${backendConfig.apiEndpoints.chatAuth}`
  : 'http://localhost:5001/api/chat-auth';

// Generate a unique session ID for guest users
const generateGuestSessionId = () => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Simple login with phone or email
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store session info in localStorage
    localStorage.setItem('kiik69_session', data.user.sessionId);
    localStorage.setItem('kiik69_user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user session
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('kiik69_user');
    const sessionId = localStorage.getItem('kiik69_session');
    
    if (!userStr || !sessionId) {
      return null;
    }

    const user = JSON.parse(userStr);
    return { ...user, sessionId };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser?.sessionId) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: currentUser.sessionId }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('kiik69_session');
    localStorage.removeItem('kiik69_user');
  }
};

// Save chat message
export const saveChatMessage = async (message, isBot = false) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser?.sessionId) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/save-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: currentUser.sessionId,
        message,
        isBot,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save chat');
    }

    return data;
  } catch (error) {
    console.error('Save chat error:', error);
    throw error;
  }
};

// Get chat history
export const getChatHistory = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser?.sessionId) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/chat-history/${currentUser.sessionId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get chat history');
    }

    return data.chatHistory;
  } catch (error) {
    console.error('Get chat history error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser?.sessionId) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/profile/${currentUser.sessionId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user profile');
    }

    return data.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getCurrentUser();
};

// Get guest session ID (for anonymous users)
export const getGuestSessionId = () => {
  let guestSessionId = localStorage.getItem('kiik69_guest_session');
  if (!guestSessionId) {
    guestSessionId = generateGuestSessionId();
    localStorage.setItem('kiik69_guest_session', guestSessionId);
  }
  return guestSessionId;
};
