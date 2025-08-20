const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to mobile number (mock implementation)
const sendOTP = async (phone, otp) => {
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  console.log(`📱 OTP ${otp} sent to ${phone}`);
  return true;
};

// Request OTP for mobile number
router.post('/request-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid mobile number' 
      });
    }

    // Format phone number to +91XXXXXXXXXX
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    
    // Check if user exists
    const existingUser = await db.get('SELECT * FROM chat_users WHERE phone = ?', [formattedPhone]);
    
    if (existingUser) {
      // Update existing user's OTP
      await db.run('UPDATE chat_users SET otp = ?, otp_expires_at = ? WHERE phone = ?', 
        [otp, otpExpiresAt, formattedPhone]);
    } else {
      // Create new user
      await db.run('INSERT INTO chat_users (phone, otp, otp_expires_at) VALUES (?, ?, ?)', 
        [formattedPhone, otp, otpExpiresAt]);
    }
    
    // Send OTP (mock)
    await sendOTP(formattedPhone, otp);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      phone: formattedPhone
    });
    
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again.' 
    });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide phone number and OTP' 
      });
    }
    
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;
    
    // Find user and verify OTP
    const user = await db.get('SELECT * FROM chat_users WHERE phone = ?', [formattedPhone]);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please request OTP first.' 
      });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.' 
      });
    }
    
    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
    }
    
    // Update user verification status and last login
    await db.run('UPDATE chat_users SET is_verified = true, last_login = ?, otp = NULL, otp_expires_at = NULL WHERE id = ?', 
      [new Date(), user.id]);
    
    // Generate session ID
    const sessionId = `session_${user.id}_${Date.now()}`;
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        sessionId: sessionId
      }
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP. Please try again.' 
    });
  }
});

// Get user profile and history
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user details
    const user = await db.get('SELECT id, phone, last_login, created_at FROM chat_users WHERE id = ?', [userId]);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get recent chat history
    const recentChats = await db.all('SELECT * FROM user_chats WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10', [userId]);
    
    // Get recent bookings
    const recentBookings = await db.all('SELECT * FROM user_bookings WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [userId]);
    
    res.json({
      success: true,
      user: {
        ...user,
        recentChats,
        recentBookings
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
    const { userId, sessionId, message, sender } = req.body;
    
    if (!userId || !message || !sender) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Save chat message
    const result = await db.run('INSERT INTO user_chats (user_id, session_id, message, sender) VALUES (?, ?, ?, ?)', 
      [userId, sessionId, message, sender]);
    
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

module.exports = router; 