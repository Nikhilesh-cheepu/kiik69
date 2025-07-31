import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApiService from '../services/api';

const AssetManager = ({ onClose }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    category: 'general',
    description: '',
    tags: '',
    is_featured: false,
    is_public: true
  });
  const [filter, setFilter] = useState({
    category: '',
    type: '',
    featured: false
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAssets();
    loadStats();
  }, [filter]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.type) params.append('type', filter.type);
      if (filter.featured) params.append('featured', 'true');
      
      const response = await ApiService.getAssets(params);
      setAssets(response);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ApiService.getAssetStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', uploadForm.category);
      formData.append('description', uploadForm.description);
      formData.append('tags', uploadForm.tags);
      formData.append('is_featured', uploadForm.is_featured);
      formData.append('is_public', uploadForm.is_public);

      await ApiService.uploadAsset(formData);
      
      // Reset form
      setSelectedFile(null);
      setUploadForm({
        category: 'general',
        description: '',
        tags: '',
        is_featured: false,
        is_public: true
      });
      
      // Reload assets
      loadAssets();
      loadStats();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImportExisting = async () => {
    try {
      setUploading(true);
      await ApiService.importExistingAssets();
      loadAssets();
      loadStats();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;

    try {
      await ApiService.deleteAsset(id);
      loadAssets();
      loadStats();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getFileIcon = (fileType) => {
    const icons = {
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
      mp4: '🎥', mov: '🎥', avi: '🎥',
      mp3: '🎵', wav: '🎵', ogg: '🎵',
      pdf: '📄', doc: '📄', docx: '📄'
    };
    return icons[fileType] || '📁';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background: 'rgba(0,0,0,0.95)',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'white',
        width: '100%',
        maxWidth: '1200px',
        minWidth: '300px',
        maxHeight: 'calc(100vh - 40px)',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#ff003c' }}>Asset Manager</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px'
        }}>
          <div>
            <strong>Total Assets:</strong> {stats.total}
          </div>
          <div>
            <strong>Featured:</strong> {stats.featured}
          </div>
          {stats.byType?.map(type => (
            <div key={type.file_type}>
              <strong>{type.file_type.toUpperCase()}:</strong> {type.count}
            </div>
          ))}
        </div>
      )}

      {/* Upload Section */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#ff003c' }}>Upload New Asset</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>File:</label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
            <select
              value={uploadForm.category}
              onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}
            >
              <option value="general">General</option>
              <option value="events">Events</option>
              <option value="gallery">Gallery</option>
              <option value="menu">Menu</option>
              <option value="music">Music</option>
              <option value="videos">Videos</option>
              <option value="logos">Logos</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
            <input
              type="text"
              value={uploadForm.description}
              onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              placeholder="Asset description"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Tags:</label>
            <input
              type="text"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
              placeholder="tag1, tag2, tag3"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={uploadForm.is_featured}
              onChange={(e) => setUploadForm({...uploadForm, is_featured: e.target.checked})}
            />
            Featured
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={uploadForm.is_public}
              onChange={(e) => setUploadForm({...uploadForm, is_public: e.target.checked})}
            />
            Public
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{
              background: '#ff003c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Asset'}
          </button>
          
          <button
            onClick={handleImportExisting}
            disabled={uploading}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            Import Existing Files
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({...filter, category: e.target.value})}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white'
            }}
          >
            <option value="">All Categories</option>
            <option value="events">Events</option>
            <option value="gallery">Gallery</option>
            <option value="menu">Menu</option>
            <option value="music">Music</option>
            <option value="videos">Videos</option>
            <option value="logos">Logos</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
          <select
            value={filter.type}
            onChange={(e) => setFilter({...filter, type: e.target.value})}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white'
            }}
          >
            <option value="">All Types</option>
            <option value="jpg">Images</option>
            <option value="mp4">Videos</option>
            <option value="mp3">Audio</option>
            <option value="pdf">Documents</option>
          </select>
        </div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={filter.featured}
            onChange={(e) => setFilter({...filter, featured: e.target.checked})}
          />
          Featured Only
        </label>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading assets...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '15px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {assets.map(asset => (
            <div
              key={asset.id}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '15px',
                borderRadius: '8px',
                border: asset.is_featured ? '2px solid #ff003c' : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ fontSize: '24px' }}>
                  {getFileIcon(asset.file_type)}
                </div>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>{asset.original_name}</strong>
              </div>
              
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                <div>Type: {asset.file_type.toUpperCase()}</div>
                <div>Size: {formatFileSize(asset.file_size)}</div>
                <div>Category: {asset.category}</div>
                {asset.is_featured && <div style={{ color: '#ff003c' }}>⭐ Featured</div>}
              </div>
              
              {asset.description && (
                <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                  {asset.description}
                </div>
              )}
              
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                Added: {new Date(asset.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {assets.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
          No assets found. Upload some files or import existing ones!
        </div>
      )}
    </motion.div>
  );
};

export default AssetManager; 