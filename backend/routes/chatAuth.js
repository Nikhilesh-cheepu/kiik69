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
    const { phone, email } = req.body;
    
    if (!phone && !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide either phone number or email' 
      });
    }

    let formattedPhone = null;
    let userIdentifier = null;

    if (phone) {
      if (!validatePhone(phone)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid 10-digit mobile number' 
        });
      }
      formattedPhone = formatPhoneNumber(phone);
      userIdentifier = formattedPhone;
    } else if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid email address' 
        });
      }
      userIdentifier = email;
    }
    
    // Check if user exists
    let existingUser;
    if (formattedPhone) {
      existingUser = await db.get('SELECT * FROM chat_users WHERE phone = ?', [formattedPhone]);
    } else {
      existingUser = await db.get('SELECT * FROM chat_users WHERE email = ?', [email]);
    }
    
    if (existingUser) {
      // Update existing user's session and last login
      const newSessionId = generateSessionId();
      await db.run('UPDATE chat_users SET session_id = ?, last_login = ?, updated_at = ? WHERE id = ?', 
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
        'INSERT INTO chat_users (phone, email, session_id, last_login) VALUES (?, ?, ?, ?)', 
        [formattedPhone, email, newSessionId, new Date()]
      );
      
      res.json({
        success: true,
        message: 'Account created and login successful',
        user: {
          id: result.lastID,
          phone: formattedPhone,
          email: email,
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
    const user = await db.get('SELECT id, phone, email, last_login, created_at FROM chat_users WHERE session_id = ?', [sessionId]);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get recent chat history
    const recentChats = await db.all('SELECT * FROM user_chats WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20', [user.id]);
    
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
    const user = await db.get('SELECT id FROM chat_users WHERE session_id = ?', [sessionId]);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Save chat message
    const result = await db.run('INSERT INTO user_chats (user_id, session_id, message, is_bot) VALUES (?, ?, ?, ?)', 
      [user.id, sessionId, message, isBot]);
    
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
    
    const chatHistory = await db.all('SELECT * FROM user_chats WHERE session_id = ? ORDER BY timestamp ASC', [sessionId]);
    
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
    await db.run('UPDATE chat_users SET session_id = ? WHERE session_id = ?', [newSessionId, sessionId]);
    
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
