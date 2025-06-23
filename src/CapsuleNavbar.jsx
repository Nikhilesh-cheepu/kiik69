import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CapsuleNavbar.module.css';

const logo = '/logos/logo.PNG';

const navLinksData = [
  { href: '#home', text: 'Home' },
  { href: '#packages', text: 'Packages' },
  { href: '#menu', text: 'Menu' },
  { href: '#events', text: 'Events' },
  { href: '#gallery', text: 'Gallery' },
  { href: '#faq', text: 'FAQ' },
];

const mobileMenuVariants = {
  hidden: { x: '100%' },
  visible: { x: '0%', transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
  exit: { x: '100%', transition: { duration: 0.3, ease: [0.5, 0, 0.75, 0] } },
};

const navLinkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08 + 0.3, ease: 'easeOut' },
  }),
};

export default function CapsuleNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  // Scroll to #home and close menu
  const handleHomeClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const hero = document.getElementById('home');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={styles.capsuleNavbar}>
        <a href="#home" className={styles.logoLink} onClick={handleHomeClick}>
          <img src={logo} alt="KIIK 69 Logo" className={styles.logoImg} />
        </a>
        
        <div className={styles.desktopNav}>
          <div className={styles.centerNavLinks}>
            {navLinksData.map((link, index) => (
              link.text === 'Home' ? (
                <a href="#home" className={styles.menuLink} key={index} onClick={handleHomeClick}>
                  {link.text}
                </a>
              ) : (
                <a href={link.href} className={styles.menuLink} key={index}>
                  {link.text}
                </a>
              )
            ))}
          </div>
          <a href="#booking" className={styles.bookNowBtn}>Book Now</a>
        </div>

        {!isMobileMenuOpen && (
          <button 
            className={styles.hamburger}
            onClick={toggleMobileMenu} 
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            style={{zIndex: 2001}}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className={styles.overlay} 
              onClick={toggleMobileMenu} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
            />
            <motion.div 
              className={styles.mobileMenu}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button className={styles.closeBtn} onClick={toggleMobileMenu} aria-label="Close menu">&times;</button>
              {navLinksData.map((link, i) => (
                link.text === 'Home' ? (
                  <motion.a
                    href="#home"
                    className={styles.mobileMenuLink}
                    key={link.href}
                    onClick={handleHomeClick}
                    custom={i}
                    variants={navLinkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {link.text}
                  </motion.a>
                ) : (
                  <motion.a
                    href={link.href}
                    className={styles.mobileMenuLink}
                    key={link.href}
                    onClick={toggleMobileMenu}
                    custom={i}
                    variants={navLinkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {link.text}
                  </motion.a>
                )
              ))}
              <motion.a 
                href="#booking" 
                className={styles.mobileBookNowBtn}
                custom={navLinksData.length}
                variants={navLinkVariants}
                initial="hidden"
                animate="visible"
                onClick={toggleMobileMenu}
              >
                Book Now
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 