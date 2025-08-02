import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaVolumeUp, FaMusic } from 'react-icons/fa';
import { MdMusicNote, MdMusicOff } from 'react-icons/md';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isHovering, setIsHovering] = useState(false);
  const [wasPlayingBeforeHidden, setWasPlayingBeforeHidden] = useState(false);
  const audioRef = useRef(null);

  const tracks = [
    {
      name: "Kiik Vibe",
      file: "/music/kiik-vibe-new.mp3"
    },
    {
      name: "Epic Uplifting Rock",
      file: "/music/Epic Uplifting Rock Sports Music for Promos, Ads & Trailers [Royalty Free Music].mp3"
    }
  ];

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].file;
      if (isPlaying) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }
        }, 100);
      }
    }
  }, [currentTrack]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying) {
          setWasPlayingBeforeHidden(true);
          audioRef.current?.pause();
          setIsPlaying(false);
        }
      } else {
        if (wasPlayingBeforeHidden) {
          audioRef.current?.play().catch(e => console.log('Audio play failed:', e));
          setIsPlaying(true);
          setWasPlayingBeforeHidden(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, wasPlayingBeforeHidden]);

  // Auto-close popup after 7 seconds of inactivity
  useEffect(() => {
    if (showPopup && !isHovering) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, isHovering]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleIconClick = () => {
    // Toggle play/pause
    togglePlayPause();
    // Toggle popup visibility
    setShowPopup(!showPopup);
  };

  const switchTrack = (trackIndex) => {
    setCurrentTrack(trackIndex);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
      }, 100);
    }
  };

  const handleTrackEnd = () => {
    // Loop the current track
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };



  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* Fixed Music Toggle Icon */}
      <motion.button
        onClick={handleIconClick}
        style={{
          position: 'fixed',
          bottom: 'clamp(1rem, 4vw, 2rem)',
          right: 'clamp(1rem, 4vw, 2rem)',
          width: 'clamp(42px, 6vw, 50px)',
          height: 'clamp(42px, 6vw, 50px)',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: isPlaying ? 'var(--color-primary)' : 'var(--color-white)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          boxShadow: isPlaying 
            ? '0 4px 20px rgba(255, 0, 60, 0.4)' 
            : '0 4px 16px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        whileHover={{ 
          scale: 1.05,
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isPlaying ? [1, 1.02, 1] : 1,
          boxShadow: isPlaying 
            ? ['0 4px 20px rgba(255, 0, 60, 0.4)', '0 6px 25px rgba(255, 0, 60, 0.6)', '0 4px 20px rgba(255, 0, 60, 0.4)']
            : '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}
        transition={{
          scale: { duration: 0.8, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" },
          boxShadow: { duration: 0.8, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }
        }}
      >
        {isPlaying ? <MdMusicNote /> : <MdMusicOff />}
      </motion.button>



      {/* Music Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: 'fixed',
              bottom: 'clamp(4.5rem, 12vw, 5.5rem)',
              right: 'clamp(1rem, 4vw, 2rem)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: 'clamp(0.6rem, 2vw, 0.8rem)',
              width: 'clamp(180px, 18vw, 220px)',
              zIndex: 1001,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Popup Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-white)',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                <FaMusic />
                <span>Music</span>
              </div>
              <motion.button
                onClick={closePopup}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gray)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '0.25rem'
                }}
                whileHover={{ color: 'var(--color-white)' }}
              >
                <FaTimes />
              </motion.button>
            </div>

            {/* Current Track Display */}
            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{
                color: 'var(--color-gray)',
                fontSize: '0.65rem',
                marginBottom: '0.25rem',
                fontWeight: '500'
              }}>
                Now Playing:
              </div>
              <div style={{
                color: 'var(--color-white)',
                fontSize: '0.75rem',
                fontWeight: '500',
                padding: '0.3rem 0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {tracks[currentTrack].name}
              </div>
            </div>

            {/* Track Selector */}
            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{
                color: 'var(--color-gray)',
                fontSize: '0.65rem',
                marginBottom: '0.25rem',
                fontWeight: '500'
              }}>
                Select Track:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {tracks.map((track, index) => (
                  <motion.button
                    key={index}
                    onClick={() => switchTrack(index)}
                    style={{
                      padding: '0.3rem 0.5rem',
                      background: currentTrack === index 
                        ? 'rgba(255, 0, 60, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: currentTrack === index 
                        ? '1px solid rgba(255, 0, 60, 0.5)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      color: currentTrack === index 
                        ? 'var(--color-primary)' 
                        : 'var(--color-white)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.65rem',
                      fontWeight: currentTrack === index ? '600' : '400',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{
                      background: currentTrack === index 
                        ? 'rgba(255, 0, 60, 0.3)' 
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {track.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Volume Control */}
            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.25rem'
              }}>
                <span style={{
                  color: 'var(--color-gray)',
                  fontSize: '0.65rem',
                  fontWeight: '500'
                }}>
                  🔊 Volume:
                </span>
                <FaVolumeUp style={{ color: 'var(--color-gray)', fontSize: '0.65rem' }} />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: 'var(--color-primary)'
                }}
              />
            </div>

            {/* Play/Pause Button */}
            <motion.button
              onClick={togglePlayPause}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'var(--color-primary)',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--color-white)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
              whileHover={{ background: 'rgba(255, 0, 60, 0.8)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <MdMusicNote /> : <MdMusicOff />}
              {isPlaying ? 'Playing' : 'Play'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer; 