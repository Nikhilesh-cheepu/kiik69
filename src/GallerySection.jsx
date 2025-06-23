import React from 'react';
import Marquee from 'react-fast-marquee';
import styles from './GallerySection.module.css';
import mediaFiles from './gallery-manifest.json';

// The array is duplicated multiple times to ensure the track is long enough for a seamless, infinite loop on any screen size.
const extendedMedia = (mediaFiles.length > 0) ? [...mediaFiles, ...mediaFiles, ...mediaFiles, ...mediaFiles] : [];

export default function GallerySection() {
  if (mediaFiles.length === 0) {
    return null; // Don't render the gallery if it's empty
  }

  return (
    <section className={styles.gallerySection} id="gallery">
      <h2 className={styles.title}>Gallery</h2>
      <Marquee
        speed={50} // Adjust for a medium pace
        gradient={true}
        gradientColor={[14, 14, 14]} // Match the background color
        gradientWidth={150}
      >
        {extendedMedia.map((media, index) => (
          <div key={`${media.src}-${index}`} className={styles.mediaItem}>
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
          </div>
        ))}
      </Marquee>
    </section>
  );
} 