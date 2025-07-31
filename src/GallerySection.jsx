import React from 'react';
import Marquee from 'react-fast-marquee';
import styles from './GallerySection.module.css';
import mediaFiles from './gallery-manifest.json';
import { motion } from 'framer-motion';

// The array is duplicated multiple times to ensure the track is long enough for a seamless, infinite loop on any screen size.
const extendedMedia = (mediaFiles.length > 0) ? [...mediaFiles, ...mediaFiles, ...mediaFiles, ...mediaFiles] : [];

export default function GallerySection() {
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
      <Marquee
        speed={50}
        gradient={true}
        gradientColor={[14, 14, 14]}
        gradientWidth={150}
      >
        {extendedMedia.map((media, index) => (
          <motion.div
            key={`${media.src}-${index}`}
            className={styles.mediaItem}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, delay: 0.2 + index * 0.05, ease: 'easeOut' }}
          >
            {media.type === 'video' ? (
              <video
                src={media.src}
                autoPlay
                loop
                muted
                playsInline
                className={styles.media}
              />
            ) : (
              <img src={media.src} alt="" className={styles.media} />
            )}
          </motion.div>
        ))}
      </Marquee>
    </section>
  );
} 