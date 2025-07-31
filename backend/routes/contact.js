const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit contact form (public)
router.post('/submit', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;

    db.run(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to submit message' });
        }
        
        res.status(201).json({ 
          message: 'Thank you for your message! We will get back to you soon.',
          id: this.lastID 
        });
      }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contact messages (admin only)
router.get('/', [authenticateToken, requireAdmin], (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  let query = 'SELECT * FROM contact_messages';
  let params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, messages) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(messages);
  });
});

// Get contact message by ID (admin only)
router.get('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM contact_messages WHERE id = ?', [id], (err, message) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  });
});

// Update message status (admin only)
router.patch('/:id/status', [
  authenticateToken,
  requireAdmin,
  body('status').isIn(['unread', 'read', 'replied', 'archived']).withMessage('Valid status is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    db.run('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update message status' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json({ message: 'Message status updated successfully' });
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete message (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM contact_messages WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete message' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  });
});

// Get message statistics (admin only)
router.get('/stats/overview', [authenticateToken, requireAdmin], (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total FROM contact_messages',
    'SELECT COUNT(*) as unread FROM contact_messages WHERE status = "unread"',
    'SELECT COUNT(*) as read FROM contact_messages WHERE status = "read"',
    'SELECT COUNT(*) as replied FROM contact_messages WHERE status = "replied"'
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.get(query, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }))
  .then(results => {
    const stats = {
      total: results[0].total,
      unread: results[1].unread,
      read: results[2].read,
      replied: results[3].replied
    };
    res.json(stats);
  })
  .catch(err => {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to get statistics' });
  });
});

module.exports = router; 