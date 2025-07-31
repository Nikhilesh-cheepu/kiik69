import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import CapsuleNavbar from './CapsuleNavbar';
import PartyPackages from './PartyPackages';
import MenuSection from './MenuSection';
import EventsSection from './EventsSection';
import GallerySection from './GallerySection';
import FaqSection from './FaqPage';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import GamesSection from './GamesSection';
import AdminLogin from './components/AdminLogin';

function CursorFollower() {
  const followerRef = useRef(null);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const followerPosition = useRef({ x: 0, y: 0 });
  const followerSize = 24; // The width/height of the follower

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorPosition.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const animate = () => {
      const { x: targetX, y: targetY } = cursorPosition.current;
      const { x: currentX, y: currentY } = followerPosition.current;

      const newX = currentX + (targetX - currentX) * 0.1;
      const newY = currentY + (targetY - currentY) * 0.1;

      followerPosition.current = { x: newX, y: newY };

      if (followerRef.current) {
        // Center the follower on the cursor
        followerRef.current.style.transform = `translate3d(${newX - followerSize / 2}px, ${newY - followerSize / 2}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={followerRef} style={styles.cursorFollower} />;
}

// Audio Toggle Button
function MusicToggle({ isPlaying, isMuted, onToggle, onNextTrack, onPrevTrack, trackName }) {
  const [showPanel, setShowPanel] = React.useState(false);
  const isSoundOn = isPlaying && !isMuted;
  return (
    <div
      style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1002 }}
      onMouseEnter={() => setShowPanel(true)}
      onMouseLeave={() => setShowPanel(false)}
      onTouchStart={() => setShowPanel(true)}
      onTouchEnd={() => setShowPanel(false)}
    >
      <motion.button
        onClick={onToggle}
        style={styles.musicToggle}
        className={isSoundOn ? 'glowing' : ''}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isSoundOn ? 'Mute music' : 'Play music'}
      >
        {isSoundOn ? '🔊' : '🔇'}
      </motion.button>
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 60,
              right: 0,
              minWidth: 240,
              background: 'rgba(20,20,20,0.7)',
              borderRadius: 18,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              border: '1.5px solid rgba(255,255,255,0.13)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: '#fff',
              padding: '1.1rem 1.2rem 1.1rem 1.2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              zIndex: 1003,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '1.05rem', textAlign: 'center', marginBottom: 4, textShadow: '0 2px 8px #0008' }}>
              {trackName}
            </div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <motion.button
                onClick={onPrevTrack}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  color: '#fff',
                  fontSize: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px #0004',
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous track"
              >⏮️</motion.button>
              <motion.button
                onClick={onNextTrack}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  color: '#fff',
                  fontSize: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px #0004',
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next track"
              >⏭️</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getHeroVideo() {
  return localStorage.getItem('kiik69_hero_video') || '';
}

// Hero Section
function Hero() {
  const [animation, setAnimation] = useState('initial');
  const animationTypes = ['pulse', 'rotate', 'flicker', 'shake'];
  const heroVideo = getHeroVideo();

  function isYouTube(url) {
    return /youtu\.be|youtube\.com/.test(url);
  }
  function isVimeo(url) {
    return /vimeo\.com/.test(url);
  }

  let videoBg;
  if (heroVideo.startsWith('data:video')) {
    videoBg = (
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/assets/images/hero-fallback.jpg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          minHeight: '100%',
          minWidth: '100%',
        }}
        src={heroVideo}
      />
    );
  } else if (isYouTube(heroVideo)) {
    const match = heroVideo.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const id = match ? match[1] : null;
    videoBg = id ? (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        title="Hero Video"
      />
    ) : null;
  } else if (isVimeo(heroVideo)) {
    const match = heroVideo.match(/vimeo\.com\/(\d+)/);
    const id = match ? match[1] : null;
    videoBg = id ? (
      <iframe
        width="100%"
        height="100%"
        src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`}
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        title="Hero Video"
      />
    ) : null;
  } else {
    videoBg = (
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/assets/images/hero-fallback.jpg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          minHeight: '100%',
          minWidth: '100%',
        }}
      >
        <source src="/videos/home.mp4" type="video/mp4" />
        <img src="/assets/images/hero-fallback.jpg" alt="KIIK 69" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </video>
    );
  }

  const animationVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },
    rotate: {
      rotate: [0, 3, -3, 0],
      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
    },
    flicker: {
      opacity: [1, 0.85, 1],
      transition: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' },
    },
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  const draggableProps = {
    drag: true,
    dragElastic: 0.2,
    dragSnapToOrigin: true,
    dragTransition: { bounceStiffness: 500, bounceDamping: 15 },
    whileTap: { cursor: 'grabbing' },
  };

  const handleHoverStart = () => {
    const randomType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    setAnimation(randomType);
  };

  const handleHoverEnd = () => {
    setAnimation('initial');
  };

  return (
    <section className="section" id="home" style={{ ...styles.heroWrapper, position: 'relative', overflow: 'hidden' }}>
      {/* Video background */}
      {videoBg}
      {/* Dark overlay for text readability */}
      <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 2 }} />
      <div style={{ ...styles.meshBg, zIndex: 2 }} />
      <div style={{ ...styles.heroInner, zIndex: 4 }}>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={styles.heroHeadline}
        >
          <span style={styles.staticWord}>Welcome to</span>
          <motion.span
            {...draggableProps}
            style={styles.kiik69Highlight}
            variants={animationVariants}
            animate={animation}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          >
            KIIK 69
          </motion.span>
          <motion.span {...draggableProps} style={styles.draggableWord}>
            Sports
          </motion.span>
          <motion.span {...draggableProps} style={styles.draggableWord}>
            Bar
          </motion.span>
        </motion.h1>

        <motion.div
          style={styles.subheadlineContainer}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.3,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {["Eat.", "Play.", "Repeat."].map((word, index) => (
            <motion.span
              key={index}
              style={styles.subheadlineWord}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          style={styles.heroSubtext}
        >
          "Not just a place to hang out — it's where food, games, and good times collide."
        </motion.p>
      </div>
    </section>
  );
}

function OpenHoursClock() {
  const [time, setTime] = React.useState(() => new Date());
  const [magnet, setMagnet] = React.useState({ x: 0, y: 0 });
  const panelRef = React.useRef(null);

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Time logic
  const pad = (n) => n.toString().padStart(2, '0');
  let hours = time.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const timeString = `${pad(hours)}:${minutes}:${seconds}`;

  // Open/closed logic
  const isOpen = time.getHours() >= 11 && time.getHours() < 24;
  const mainHeading = isOpen ? (
    <span className="openNowHeading">
      <span className="openNowEmoji">
        <span className="emojiClock">⏰</span>
        <span className="emojiPulseDot" />
      </span>
      <span className="openNowText">We're Open Now!</span>
    </span>
  ) : (
    <span className="closedHeading">
      <span className="closedDot">🔴</span>
      <span className="closedText">Sorry, We're Closed!</span>
    </span>
  );
  const subtext = isOpen
    ? 'From 11 AM to 12 AM · Come hang out!'
    : 'Open Daily · 11 AM to 12 AM';

  // Magnetic effect handlers
  function handleMouseMove(e) {
    const rect = panelRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setMagnet({ x: x * 0.18, y: y * 0.18 });
  }
  function handleMouseLeave() {
    setMagnet({ x: 0, y: 0 });
  }

  return (
    <div
      className="openHoursClockPanel enhancedClockPanel"
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '800px', margin: '4.5rem auto 4.5rem auto' }}
    >
      <motion.div
        animate={{ x: magnet.x, y: magnet.y }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        style={{ willChange: 'transform', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div className="openHoursMainHeading">{mainHeading}</div>
        <div className="openHoursSubtext" style={{ marginBottom: '1.2rem', marginTop: '0.2rem' }}>{subtext}</div>
        <div className="digitalClock digitalFont">
          <span className="clockDigits">{timeString}</span>
          <span className="clockAMPM">{ampm}</span>
        </div>
      </motion.div>
    </div>
  );
}

function RequireAuth({ children }) {
  const isAuth = localStorage.getItem('kiik69_admin_auth') === 'true';
  const location = useLocation();
  if (!isAuth) return <Navigate to="/admin" state={{ from: location }} replace />;
  return children;
}

export default function App() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [trackIdx, setTrackIdx] = React.useState(0);
  const wasPlayingBeforeHidden = useRef(false);

  // Playlist of local tracks
  const playlist = [
    { src: '/music/kiik-vibe-new.mp3', name: 'KIIK Vibe' },
    { src: '/music/Epic Uplifting Rock Sports Music for Promos, Ads & Trailers [Royalty Free Music].mp3', name: 'Epic Uplifting Rock Sports' },
  ];

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(e => console.error("Audio play failed on toggle:", e));
    }
    audio.muted = !audio.muted;
  };

  // Switch to next/prev track in playlist
  const nextTrack = () => setTrackIdx(idx => (idx + 1) % playlist.length);
  const prevTrack = () => setTrackIdx(idx => (idx - 1 + playlist.length) % playlist.length);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(audio.muted);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.volume = 0.2;
    audio.muted = true; 
    audio.play().catch(() => {
      console.log("Autoplay was prevented. User must interact to start music.");
    });
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // When trackIdx changes, update audio src and play
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playlist[trackIdx].src;
    audio.load();
    if (!isMuted) {
      audio.play().catch(e => console.error("Audio play failed on track switch:", e));
    }
  }, [trackIdx]);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.visibilityState === 'hidden') {
        wasPlayingBeforeHidden.current = !audio.paused;
        audio.pause();
      } else {
        if (wasPlayingBeforeHidden.current) {
          audio.play().catch(e => console.error("Audio play failed on visibility change:", e));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={
          <div>
            <CursorFollower />
            <audio ref={audioRef} src={playlist[trackIdx].src} loop preload="auto" />
            <MusicToggle
              isPlaying={isPlaying}
              isMuted={isMuted}
              onToggle={toggleMute}
              onNextTrack={nextTrack}
              onPrevTrack={prevTrack}
              trackName={playlist[trackIdx].name}
            />
            <CapsuleNavbar />
            <AdminLogin />
            <Hero />
            <OpenHoursClock />
            <PartyPackages />
            <MenuSection />
            <GamesSection />
            <EventsSection />
            <GallerySection />
            <FaqSection id="faq" />
          </div>
        } />
        <Route path="/faq" element={<FaqSection />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

// Add to styles object:
const styles = {
  cursorFollower: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(255, 0, 60, 0.4)',
    borderRadius: '50%',
    boxShadow: '0 0 15px 5px rgba(255, 0, 60, 0.7)',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  musicToggle: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1001,
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1.5rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--kiik-black)',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'var(--kiik-white)',
    textDecoration: 'none',
    transition: 'color 0.3s',
    '&:hover': {
      color: 'var(--kiik-red)',
    },
  },
  meshBg: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    background: 'transparent',
  },
  gradient1: {
    position: 'absolute',
    width: '80vw',
    height: '80vw',
    left: '-20vw',
    top: '-20vw',
    background: 'radial-gradient(circle at 30% 30%, #ff003c 0%, transparent 70%)',
    filter: 'blur(80px)',
    opacity: 0.7,
    animation: 'move1 12s ease-in-out infinite alternate',
    zIndex: 0,
  },
  gradient2: {
    position: 'absolute',
    width: '70vw',
    height: '70vw',
    right: '-15vw',
    top: '10vw',
    background: 'radial-gradient(circle at 70% 20%, #7d2ae8 0%, transparent 70%)',
    filter: 'blur(80px)',
    opacity: 0.6,
    animation: 'move2 14s ease-in-out infinite alternate',
    zIndex: 0,
  },
  gradient3: {
    position: 'absolute',
    width: '60vw',
    height: '60vw',
    left: '20vw',
    bottom: '-10vw',
    background: 'radial-gradient(circle at 50% 80%, #0a0a0a 0%, transparent 70%)',
    filter: 'blur(60px)',
    opacity: 0.8,
    animation: 'move3 16s ease-in-out infinite alternate',
    zIndex: 0,
  },
  heroWrapper: {
    position: 'relative',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    padding: 0,
    boxSizing: 'border-box',
  },
  heroInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    gap: 36,
  },
  heroHeadline: {
    fontSize: 'clamp(1.2rem, 5vw, 4rem)',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '16px',
    letterSpacing: '1px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.4em',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  staticWord: {
    display: 'inline-block',
    marginRight: '0.4em',
    fontWeight: 400,
    color: '#fff',
    fontSize: 'inherit',
    letterSpacing: 'inherit',
    userSelect: 'none',
  },
  kiik69Highlight: {
    display: 'inline-block',
    color: 'var(--kiik-red)',
    textShadow: '0 0 8px rgba(255, 0, 60, 0.7), 0 0 16px rgba(255, 0, 60, 0.5)',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontWeight: 700,
  },
  draggableWord: {
    display: 'inline-block',
    cursor: 'grab',
    fontSize: 'inherit',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: 'inherit',
  },
  subheadlineContainer: {
    display: 'flex',
    gap: '1.5rem',
    textAlign: 'center',
    marginBottom: '24px',
  },
  subheadlineWord: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    color: '#fff',
    display: 'inline-block',
  },
  heroSubtext: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#eee',
    fontWeight: 300,
    textAlign: 'center',
    maxWidth: '600px',
    lineHeight: 1.6,
  },
};