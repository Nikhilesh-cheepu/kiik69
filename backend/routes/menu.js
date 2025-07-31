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
    cb(null, 'uploads/menu/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'menu-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// Get all menu items
router.get('/', (req, res) => {
  const { category, available } = req.query;
  let query = 'SELECT * FROM menu_items';
  let params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (available === 'true') {
    query += category ? ' AND is_available = 1' : ' WHERE is_available = 1';
  }

  query += ' ORDER BY category, name';

  db.all(query, params, (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(items);
  });
});

// Get menu item by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM menu_items WHERE id = ?', [id], (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  });
});

// Create new menu item (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, is_available } = req.body;
    const image_url = req.file ? `/uploads/menu/${req.file.filename}` : null;

    db.run(
      'INSERT INTO menu_items (name, description, price, category, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image_url, is_available || 1],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create menu item' });
        }
        
        db.get('SELECT * FROM menu_items WHERE id = ?', [this.lastID], (err, item) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to retrieve created item' });
          }
          res.status(201).json(item);
        });
      }
    );
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, category, is_available } = req.body;
    const image_url = req.file ? `/uploads/menu/${req.file.filename}` : undefined;

    let query = 'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [name, description, price, category, is_available || 1];

    if (image_url) {
      query += ', image_url = ?';
      params.push(image_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update menu item' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      
      db.get('SELECT * FROM menu_items WHERE id = ?', [id], (err, item) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated item' });
        }
        res.json(item);
      });
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM menu_items WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete menu item' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  });
});

// Get menu categories
router.get('/categories/list', (req, res) => {
  db.all('SELECT DISTINCT category FROM menu_items ORDER BY category', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories.map(cat => cat.category));
  });
});

module.exports = router; 