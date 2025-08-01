import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './global.css'

// Performance monitoring and mobile optimization
if (import.meta.env.DEV) {
  console.log('🚀 KIIK 69 - Performance Optimized Loading');
  
  // Monitor video loading performance
  const videoLoadStart = performance.now();
  window.addEventListener('load', () => {
    const videoLoadTime = performance.now() - videoLoadStart;
    console.log(`📹 Video load time: ${videoLoadTime.toFixed(2)}ms`);
  });
}

// Mobile scroll optimization
const optimizeMobileScroll = () => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Prevent scroll snapping
    document.documentElement.style.scrollSnapType = 'none';
    document.body.style.scrollSnapType = 'none';
    
    // Optimize touch scrolling
    document.documentElement.style.webkitOverflowScrolling = 'touch';
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
};

// Initialize mobile optimizations
if (typeof window !== 'undefined') {
  optimizeMobileScroll();
  window.addEventListener('resize', optimizeMobileScroll);
}

// Optimize React rendering
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
