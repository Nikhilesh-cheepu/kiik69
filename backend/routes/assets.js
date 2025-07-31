const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/assets/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'asset-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|mov|avi|mp3|wav|ogg|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, video, audio, and document files are allowed!'));
    }
  }
});

// Create assets table if it doesn't exist
const createAssetsTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      file_type VARCHAR(50) NOT NULL,
      category VARCHAR(100) DEFAULT 'general',
      file_size INTEGER,
      mime_type VARCHAR(100),
      description TEXT,
      tags TEXT,
      is_featured BOOLEAN DEFAULT false,
      is_public BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Initialize table
createAssetsTable();

// Get all assets
router.get('/', (req, res) => {
  const { category, type, featured, public } = req.query;
  let query = 'SELECT * FROM assets';
  let params = [];
  let conditions = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (type) {
    conditions.push('file_type = ?');
    params.push(type);
  }

  if (featured === 'true') {
    conditions.push('is_featured = true');
  }

  if (public === 'true') {
    conditions.push('is_public = true');
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, assets) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(assets);
  });
});

// Get asset by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM assets WHERE id = ?', [id], (err, asset) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  });
});

// Upload new asset (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('category').optional(),
  body('description').optional(),
  body('tags').optional(),
  body('is_featured').optional().isBoolean(),
  body('is_public').optional().isBoolean()
], upload.single('file'), (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const { category, description, tags, is_featured, is_public } = req.body;
    const fileUrl = `/uploads/assets/${req.file.filename}`;
    const fileType = path.extname(req.file.originalname).toLowerCase().substring(1);
    
    db.run(
      `INSERT INTO assets (filename, original_name, file_path, file_url, file_type, category, file_size, mime_type, description, tags, is_featured, is_public) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.file.filename,
        req.file.originalname,
        req.file.path,
        fileUrl,
        fileType,
        category || 'general',
        req.file.size,
        req.file.mimetype,
        description || '',
        tags || '',
        is_featured === 'true' || false,
        is_public !== 'false'
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        db.get('SELECT * FROM assets WHERE id = ?', [this.lastID], (err, asset) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(201).json(asset);
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update asset (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('category').optional(),
  body('description').optional(),
  body('tags').optional(),
  body('is_featured').optional().isBoolean(),
  body('is_public').optional().isBoolean()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { category, description, tags, is_featured, is_public } = req.body;

    db.run(
      `UPDATE assets SET category = ?, description = ?, tags = ?, is_featured = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [category, description, tags, is_featured, is_public, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Asset not found' });
        }
        
        db.get('SELECT * FROM assets WHERE id = ?', [id], (err, asset) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json(asset);
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete asset (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM assets WHERE id = ?', [id], (err, asset) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(asset.file_path)) {
      fs.unlinkSync(asset.file_path);
    }

    // Delete from database
    db.run('DELETE FROM assets WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Asset deleted successfully' });
    });
  });
});

// Import existing files from public folders
router.post('/import-existing', [authenticateToken, requireAdmin], (req, res) => {
  const { category } = req.body;
  const publicFolders = ['public/events', 'public/gallery', 'public/logos', 'public/menu', 'public/music', 'public/videos'];
  const importedFiles = [];

  publicFolders.forEach(folder => {
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder);
      files.forEach(file => {
        const filePath = path.join(folder, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
          const fileType = path.extname(file).toLowerCase().substring(1);
          const fileUrl = `/${folder.replace('public/', '')}/${file}`;
          
          // Check if file already exists in database
          db.get('SELECT id FROM assets WHERE file_path = ?', [filePath], (err, existing) => {
            if (!existing) {
              db.run(
                `INSERT INTO assets (filename, original_name, file_path, file_url, file_type, category, file_size, mime_type, description, tags, is_featured, is_public) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  file,
                  file,
                  filePath,
                  fileUrl,
                  fileType,
                  category || folder.replace('public/', ''),
                  stats.size,
                  'application/octet-stream',
                  `Imported from ${folder}`,
                  `imported,${folder.replace('public/', '')}`,
                  false,
                  true
                ],
                function(err) {
                  if (!err) {
                    importedFiles.push(file);
                  }
                }
              );
            }
          });
        }
      });
    }
  });

  setTimeout(() => {
    res.json({ 
      message: 'Import completed', 
      imported_count: importedFiles.length,
      imported_files: importedFiles 
    });
  }, 2000);
});

// Get asset statistics
router.get('/stats/overview', [authenticateToken, requireAdmin], (req, res) => {
  const stats = {};
  
  // Total assets
  db.get('SELECT COUNT(*) as total FROM assets', (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.total = result.total;
    
    // Assets by type
    db.all('SELECT file_type, COUNT(*) as count FROM assets GROUP BY file_type', (err, types) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.byType = types;
      
      // Assets by category
      db.all('SELECT category, COUNT(*) as count FROM assets GROUP BY category', (err, categories) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.byCategory = categories;
        
        // Featured assets
        db.get('SELECT COUNT(*) as count FROM assets WHERE is_featured = true', (err, featured) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          stats.featured = featured.count;
          
          res.json(stats);
        });
      });
    });
  });
});

module.exports = router; 