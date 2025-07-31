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
    cb(null, 'uploads/packages/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'package-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all party packages
router.get('/', (req, res) => {
  const { available } = req.query;
  let query = 'SELECT * FROM party_packages';
  let params = [];

  if (available === 'true') {
    query += ' WHERE is_available = 1';
  }

  query += ' ORDER BY price ASC';

  db.all(query, params, (err, packages) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(packages);
  });
});

// Get party package by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM party_packages WHERE id = ?', [id], (err, package) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!package) {
      return res.status(404).json({ error: 'Party package not found' });
    }
    res.json(package);
  });
});

// Create new party package (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, includes, is_available } = req.body;
    const image_url = req.file ? `/uploads/packages/${req.file.filename}` : null;

    db.run(
      'INSERT INTO party_packages (name, description, price, includes, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, includes, image_url, is_available || 1],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create party package' });
        }
        
        db.get('SELECT * FROM party_packages WHERE id = ?', [this.lastID], (err, package) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to retrieve created package' });
          }
          res.status(201).json(package);
        });
      }
    );
  } catch (error) {
    console.error('Create party package error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update party package (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, includes, is_available } = req.body;
    const image_url = req.file ? `/uploads/packages/${req.file.filename}` : undefined;

    let query = 'UPDATE party_packages SET name = ?, description = ?, price = ?, includes = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [name, description, price, includes, is_available || 1];

    if (image_url) {
      query += ', image_url = ?';
      params.push(image_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update party package' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Party package not found' });
      }
      
      db.get('SELECT * FROM party_packages WHERE id = ?', [id], (err, package) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated package' });
        }
        res.json(package);
      });
    });
  } catch (error) {
    console.error('Update party package error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete party package (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM party_packages WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete party package' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Party package not found' });
    }
    res.json({ message: 'Party package deleted successfully' });
  });
});

module.exports = router; 