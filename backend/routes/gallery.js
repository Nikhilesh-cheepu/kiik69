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
    cb(null, 'uploads/gallery/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Get all gallery items
router.get('/', (req, res) => {
  const { category, featured } = req.query;
  let query = 'SELECT * FROM gallery_items';
  let params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (featured === 'true') {
    query += category ? ' AND is_featured = 1' : ' WHERE is_featured = 1';
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(items);
  });
});

// Get gallery item by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM gallery_items WHERE id = ?', [id], (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json(item);
  });
});

// Create new gallery item (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required')
], upload.single('file'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const { title, description, category, is_featured } = req.body;
    const fileUrl = `/uploads/gallery/${req.file.filename}`;
    const isVideo = /\.(mp4|mov|avi)$/i.test(req.file.originalname);
    
    const image_url = isVideo ? null : fileUrl;
    const video_url = isVideo ? fileUrl : null;

    db.run(
      'INSERT INTO gallery_items (title, description, image_url, video_url, category, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image_url, video_url, category || 'general', is_featured || 0],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create gallery item' });
        }
        
        db.get('SELECT * FROM gallery_items WHERE id = ?', [this.lastID], (err, item) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to retrieve created item' });
          }
          res.status(201).json(item);
        });
      }
    );
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update gallery item (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required')
], upload.single('file'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, category, is_featured } = req.body;

    let query = 'UPDATE gallery_items SET title = ?, description = ?, category = ?, is_featured = ?';
    let params = [title, description, category || 'general', is_featured || 0];

    if (req.file) {
      const fileUrl = `/uploads/gallery/${req.file.filename}`;
      const isVideo = /\.(mp4|mov|avi)$/i.test(req.file.originalname);
      
      if (isVideo) {
        query += ', video_url = ?, image_url = NULL';
        params.push(fileUrl);
      } else {
        query += ', image_url = ?, video_url = NULL';
        params.push(fileUrl);
      }
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update gallery item' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Gallery item not found' });
      }
      
      db.get('SELECT * FROM gallery_items WHERE id = ?', [id], (err, item) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated item' });
        }
        res.json(item);
      });
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete gallery item (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM gallery_items WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete gallery item' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted successfully' });
  });
});

// Get gallery categories
router.get('/categories/list', (req, res) => {
  db.all('SELECT DISTINCT category FROM gallery_items ORDER BY category', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories.map(cat => cat.category));
  });
});

module.exports = router; 