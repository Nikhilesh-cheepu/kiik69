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
    cb(null, 'uploads/games/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'game-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all games
router.get('/', (req, res) => {
  const { type, available } = req.query;
  let query = 'SELECT * FROM games';
  let params = [];

  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }

  if (available === 'true') {
    query += type ? ' AND is_available = 1' : ' WHERE is_available = 1';
  }

  query += ' ORDER BY name ASC';

  db.all(query, params, (err, games) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(games);
  });
});

// Get game by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM games WHERE id = ?', [id], (err, game) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  });
});

// Create new game (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Name is required'),
  body('type').notEmpty().withMessage('Type is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, type, is_available } = req.body;
    const image_url = req.file ? `/uploads/games/${req.file.filename}` : null;

    db.run(
      'INSERT INTO games (name, description, type, image_url, is_available) VALUES (?, ?, ?, ?, ?)',
      [name, description, type, image_url, is_available || 1],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create game' });
        }
        
        db.get('SELECT * FROM games WHERE id = ?', [this.lastID], (err, game) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to retrieve created game' });
          }
          res.status(201).json(game);
        });
      }
    );
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update game (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Name is required'),
  body('type').notEmpty().withMessage('Type is required')
], upload.single('image'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, type, is_available } = req.body;
    const image_url = req.file ? `/uploads/games/${req.file.filename}` : undefined;

    let query = 'UPDATE games SET name = ?, description = ?, type = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [name, description, type, is_available || 1];

    if (image_url) {
      query += ', image_url = ?';
      params.push(image_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update game' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      db.get('SELECT * FROM games WHERE id = ?', [id], (err, game) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated game' });
        }
        res.json(game);
      });
    });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete game (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM games WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete game' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  });
});

// Get game types
router.get('/types/list', (req, res) => {
  db.all('SELECT DISTINCT type FROM games ORDER BY type', (err, types) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(types.map(type => type.type));
  });
});

module.exports = router; 