import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import styles from './GallerySection.module.css';
import mediaFiles from './gallery-manifest.json';
import { motion } from 'framer-motion';

// The array is duplicated multiple times to ensure the track is long enough for a seamless, infinite loop on any screen size.
const extendedMedia = (mediaFiles.length > 0) ? [...mediaFiles, ...mediaFiles, ...mediaFiles, ...mediaFiles] : [];

export default function GallerySection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading completion with better timing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const handleVideoLoad = () => {
    setLoadedVideos(prev => prev + 1);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  if (mediaFiles.length === 0) {
    return null; // Don't render the gallery if it's empty
  }

  return (
    <section className={styles.gallerySection} id="gallery">
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.9, delay: 0, ease: 'easeOut' }}
      >
        Gallery
      </motion.h2>
      
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ minHeight: '400px' }} // Ensure minimum height to prevent layout shifts
        >
          <Marquee
            speed={isMobile ? 30 : 50}
            gradient={true}
            gradientColor={[14, 14, 14]}
            gradientWidth={isMobile ? 100 : 150}
            pauseOnHover={!isMobile}
            pauseOnClick={true}
            style={{ 
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {extendedMedia.map((media, index) => (
              <motion.div
                key={`${media.src}-${index}`}
                className={styles.mediaItem}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, delay: 0.2 + index * 0.05, ease: 'easeOut' }}
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }}
              >
                {media.type === 'video' ? (
                  <video
                    src={media.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.media}
                    loading="lazy"
                    preload="metadata"
                    onLoadStart={() => console.log(`Loading video: ${media.src}`)}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      backgroundColor: '#1a1a1a', // Fallback background
                    }}
                  />
                ) : (
                  <img 
                    src={media.src} 
                    alt="" 
                    className={styles.media}
                    loading="lazy"
                    decoding="async"
                    onLoad={handleVideoLoad}
                    onError={handleVideoError}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      backgroundColor: '#1a1a1a', // Fallback background
                    }}
                  />
                )}
                
                {/* Loading overlay */}
                {loadedVideos < extendedMedia.length && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '14px',
                  }}>
                    Loading...
                  </div>
                )}
              </motion.div>
            ))}
          </Marquee>
          
          {/* Error state */}
          {hasError && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#ff6b6b',
              fontSize: '16px',
            }}>
              Some gallery items failed to load. Please refresh the page.
            </div>
          )}
        </motion.div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          color: '#fff',
          fontSize: '18px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,0,60,0.3)',
            borderTop: '3px solid #ff003c',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '12px',
          }} />
          Loading Gallery...
        </div>
      )}
    </section>
  );
} 