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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoading(false), 500);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

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
        >
          <Marquee
            speed={isMobile ? 30 : 50}
            gradient={true}
            gradientColor={[14, 14, 14]}
            gradientWidth={isMobile ? 100 : 150}
            pauseOnHover={!isMobile}
            pauseOnClick={true}
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
                  />
                ) : (
                  <img 
                    src={media.src} 
                    alt="" 
                    className={styles.media}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </motion.div>
            ))}
          </Marquee>
        </motion.div>
      )}
    </section>
  );
} 