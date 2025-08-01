import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './global.css'

// Performance monitoring
if (import.meta.env.DEV) {
  console.log('🚀 KIIK 69 - Performance Optimized Loading');
  
  // Monitor video loading performance
  const videoLoadStart = performance.now();
  window.addEventListener('load', () => {
    const videoLoadTime = performance.now() - videoLoadStart;
    console.log(`📹 Video load time: ${videoLoadTime.toFixed(2)}ms`);
  });
}

// Optimize React rendering
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
