const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const { generateSessionId, formatPhoneNumber, validateEmail, validatePhone } = require('../services/authService');

// Test endpoint to verify database connection
router.get('/test', async (req, res) => {
  try {
    // Test database connection
    const result = await db.all('SELECT 1 as test');
    res.json({
      success: true,
      message: 'Database connection successful',
      result: result
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Simple login with phone or email
router.post('/login', async (req, res) => {
  try {
    const { identifier } = req.body;
    
    if (!identifier) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide your email or phone number' 
      });
    }

    // Auto-detect if it's a phone number or email
    const isPhone = /^\d{10}$/.test(identifier.replace(/\D/g, ''));
    const isEmail = identifier.includes('@') && identifier.includes('.');
    
    if (!isPhone && !isEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid 10-digit phone number or email address' 
      });
    }

    let formattedPhone = null;
    let emailValue = null;
    let userIdentifier = null;

    if (isPhone) {
      const cleanPhone = identifier.replace(/\D/g, '');
      if (!validatePhone(cleanPhone)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid 10-digit mobile number' 
        });
      }
      formattedPhone = formatPhoneNumber(cleanPhone);
      userIdentifier = formattedPhone;
    } else {
      if (!validateEmail(identifier)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid email address' 
        });
      }
      emailValue = identifier;
      userIdentifier = identifier;
    }
    
    // Check if user exists (by phone or email)
    let existingUser;
    if (formattedPhone) {
      existingUser = await db.get('SELECT * FROM chat_users WHERE phone = $1', [formattedPhone]);
    } else {
      existingUser = await db.get('SELECT * FROM chat_users WHERE email = $1', [emailValue]);
    }
    
    if (existingUser) {
      // Update existing user's session and last login
      const newSessionId = generateSessionId();
      await db.run('UPDATE chat_users SET session_id = $1, last_login = $2, updated_at = $3 WHERE id = $4', 
        [newSessionId, new Date(), new Date(), existingUser.id]);
      
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: existingUser.id,
          phone: existingUser.phone,
          email: existingUser.email,
          sessionId: newSessionId
        }
      });
    } else {
      // Create new user
      const newSessionId = generateSessionId();
      const result = await db.run(
        'INSERT INTO chat_users (phone, email, session_id, last_login) VALUES ($1, $2, $3, $4) RETURNING id', 
        [formattedPhone, emailValue, newSessionId, new Date()]
      );
      
      res.json({
        success: true,
        message: 'Account created and login successful',
        user: {
          id: result.lastID,
          phone: formattedPhone,
          email: emailValue,
          sessionId: newSessionId
        }
      });
    }
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Get user profile and chat history
router.get('/profile/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get user details
    const user = await db.get('SELECT id, phone, email, last_login, created_at FROM chat_users WHERE session_id = $1', [sessionId]);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get recent chat history
    const recentChats = await db.all('SELECT id, user_id, session_id, message, sender, timestamp FROM user_chats WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 20', [user.id]);
    
    res.json({
      success: true,
      user: {
        ...user,
        recentChats
      }
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user profile' 
    });
  }
});

// Save chat message
router.post('/save-chat', async (req, res) => {
  try {
    const { sessionId, message, isBot = false } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Get user ID from session
    const user = await db.get('SELECT id FROM chat_users WHERE session_id = $1', [sessionId]);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Save chat message
    const result = await db.run('INSERT INTO user_chats (user_id, session_id, message, sender) VALUES ($1, $2, $3, $4)',
      [user.id, sessionId, message, isBot ? 'bot' : 'user']);
    
    res.json({
      success: true,
      message: 'Chat saved successfully',
      chatId: result.lastID
    });
    
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save chat' 
    });
  }
});

// Get chat history for a session
router.get('/chat-history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const chatHistory = await db.all('SELECT id, user_id, session_id, message, sender, timestamp FROM user_chats WHERE session_id = $1 ORDER BY timestamp ASC', [sessionId]);
    
    res.json({
      success: true,
      chatHistory
    });
    
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch chat history' 
    });
  }
});

// Logout (invalidate session)
router.post('/logout', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID required' 
      });
    }
    
    // Generate new session ID to invalidate current one
    const newSessionId = generateSessionId();
    await db.run('UPDATE chat_users SET session_id = $1 WHERE session_id = $2', [newSessionId, sessionId]);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Logout failed' 
    });
  }
});

module.exports = router;
