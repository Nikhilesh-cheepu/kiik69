const fs = require('fs');
const path = require('path');

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const manifestPath = path.join(process.cwd(), 'src', 'gallery-manifest.json');

const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

try {
  // Ensure the gallery directory exists, or create an empty manifest
  if (!fs.existsSync(galleryDir)) {
    console.warn('⚠️ `public/gallery` directory not found. Creating an empty manifest.');
    fs.writeFileSync(manifestPath, JSON.stringify([], null, 2));
    process.exit(0);
  }
  
  const files = fs.readdirSync(galleryDir);

  const mediaFiles = files
    .map(file => {
      const extension = path.extname(file).toLowerCase();
      if (videoExtensions.includes(extension)) {
        return { type: 'video', src: `/gallery/${file}` };
      } else if (imageExtensions.includes(extension)) {
        return { type: 'image', src: `/gallery/${file}` };
      }
      return null;
    })
    .filter(Boolean); // Remove null entries for any unsupported file types

  fs.writeFileSync(manifestPath, JSON.stringify(mediaFiles, null, 2));
  console.log(`✅ Gallery manifest generated successfully with ${mediaFiles.length} items.`);

} catch (error) {
  console.error('❌ Error generating gallery manifest:', error);
  // Create an empty manifest on error to prevent the app from crashing
  fs.writeFileSync(manifestPath, JSON.stringify([], null, 2));
  process.exit(1);
} 