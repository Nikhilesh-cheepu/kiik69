const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Get all active party packages
router.get('/', async (req, res) => {
  try {
    const packages = await db.all('SELECT * FROM party_packages WHERE is_active = 1 ORDER BY price ASC');
    
    res.json({
      success: true,
      packages: packages.map(pkg => ({
        ...pkg,
        features: pkg.features ? (typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features) : []
      }))
    });
  } catch (error) {
    console.error('Error fetching party packages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch party packages' 
    });
  }
});

// Get party package by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const package = await db.get('SELECT * FROM party_packages WHERE id = ? AND is_active = 1', [id]);
    
    if (!package) {
      return res.status(404).json({ 
        success: false, 
        message: 'Party package not found' 
      });
    }
    
    res.json({
      success: true,
      package: {
        ...package,
        features: package.features ? (typeof package.features === 'string' ? JSON.parse(package.features) : package.features) : []
      }
    });
  } catch (error) {
    console.error('Error fetching party package:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch party package' 
    });
  }
});

// Create new party package (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, features, image_url } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and price are required' 
      });
    }
    
    const featuresJson = Array.isArray(features) ? JSON.stringify(features) : features;
    
    const result = await db.run(
      'INSERT INTO party_packages (name, description, price, features, image_url) VALUES (?, ?, ?, ?, ?)', 
      [name, description, price, featuresJson, image_url]
    );
    
    res.json({
      success: true,
      message: 'Party package created successfully',
      packageId: result.lastID
    });
  } catch (error) {
    console.error('Error creating party package:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create party package' 
    });
  }
});

// Update party package (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, features, image_url, is_active } = req.body;
    
    const updateFields = [];
    const updateValues = [];
    
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (features !== undefined) {
      updateFields.push('features = ?');
      updateValues.push(Array.isArray(features) ? JSON.stringify(features) : features);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }
    
    updateFields.push('updated_at = ?');
    updateValues.push(new Date());
    updateValues.push(id);
    
    const result = await db.run(
      `UPDATE party_packages SET ${updateFields.join(', ')} WHERE id = ?`, 
      updateValues
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Party package not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Party package updated successfully'
    });
  } catch (error) {
    console.error('Error updating party package:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update party package' 
    });
  }
});

// Delete party package (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.run('DELETE FROM party_packages WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Party package not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Party package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting party package:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete party package' 
    });
  }
});

module.exports = router;
