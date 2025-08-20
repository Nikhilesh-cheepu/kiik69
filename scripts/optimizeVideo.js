const fs = require('fs');
const path = require('path');

console.log('🎬 Video Optimization Script');
console.log('============================');

const videoPath = path.join(__dirname, '../public/videos/hero.mp4');
const optimizedPath = path.join(__dirname, '../public/videos/hero-optimized.mp4');

// Check if video exists
if (!fs.existsSync(videoPath)) {
  console.error('❌ Hero video not found at:', videoPath);
  process.exit(1);
}

const stats = fs.statSync(videoPath);
const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`📹 Current video size: ${fileSizeInMB} MB`);
console.log(`📍 Location: ${videoPath}`);

if (fileSizeInMB > 2) {
  console.log('⚠️  Video is larger than 2MB - this may cause loading issues in production');
  console.log('💡 Recommendations:');
  console.log('   1. Compress video to under 2MB');
  console.log('   2. Use WebM format for better compression');
  console.log('   3. Reduce video resolution to 720p');
  console.log('   4. Consider using a CDN for video hosting');
} else {
  console.log('✅ Video size is optimal for production');
}

console.log('\n🔧 To optimize the video manually:');
console.log('   1. Use FFmpeg: ffmpeg -i hero.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset medium hero-optimized.mp4');
console.log('   2. Use online tools like HandBrake or CloudConvert');
console.log('   3. Target file size: under 2MB');
console.log('   4. Resolution: 1280x720 or lower');
console.log('   5. Format: MP4 with H.264 codec');

console.log('\n📱 Production considerations:');
console.log('   - Mobile users may have slower connections');
console.log('   - Consider lazy loading for video');
console.log('   - Add fallback background image');
console.log('   - Use preload="metadata" for faster initial load');
