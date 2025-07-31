const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all events
router.get('/', (req, res) => {
  const { featured, upcoming } = req.query;
  let query = 'SELECT * FROM events';
  let params = [];

  if (featured === 'true') {
    query += ' WHERE is_featured = 1';
  }

  if (upcoming === 'true') {
    query += featured === 'true' ? ' AND date >= DATE("now")' : ' WHERE date >= DATE("now")';
  }

  query += ' ORDER BY date DESC, time ASC';

  db.all(query, params, (err, events) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(events);
  });
});

// Get event by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM events WHERE id = ?', [id], (err, event) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  });
});

// Create new event (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('date').isDate().withMessage('Valid date is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, time, is_featured } = req.body;
    const image_url = req.file ? `/uploads/events/${req.file.filename}` : null;

    db.run(
      'INSERT INTO events (title, description, date, time, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, time, image_url, is_featured || 0],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create event' });
        }
        
        db.get('SELECT * FROM events WHERE id = ?', [this.lastID], (err, event) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to retrieve created event' });
          }
          res.status(201).json(event);
        });
      }
    );
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update event (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('date').isDate().withMessage('Valid date is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, date, time, is_featured } = req.body;
    const image_url = req.file ? `/uploads/events/${req.file.filename}` : undefined;

    let query = 'UPDATE events SET title = ?, description = ?, date = ?, time = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [title, description, date, time, is_featured || 0];

    if (image_url) {
      query += ', image_url = ?';
      params.push(image_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update event' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      db.get('SELECT * FROM events WHERE id = ?', [id], (err, event) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated event' });
        }
        res.json(event);
      });
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete event (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete event' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

module.exports = router; 