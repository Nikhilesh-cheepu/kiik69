import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import styles from './CapsuleNavbar.module.css';

const logo = '/logos/logo.PNG';

const navLinksData = [
  { href: '#home', text: 'Home' },
  { href: '#packages', text: 'Packages' },
  { href: '#menu', text: 'Menu' },
  { href: '#games', text: 'Games' },
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

export default function CapsuleNavbar({ onAdminClick }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.body.classList.contains('light-theme');
    }
    return false;
  });

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const toggleSettings = () => setSettingsOpen(prev => !prev);
  const closeSettings = () => setSettingsOpen(false);
  const toggleMobileSettings = () => setMobileSettingsOpen(prev => !prev);

  const handleThemeToggle = () => {
    const body = document.body;
    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      setIsLightTheme(false);
    } else {
      body.classList.add('light-theme');
      setIsLightTheme(true);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    if (!isMobileMenuOpen) setMobileSettingsOpen(false);
  }, [isMobileMenuOpen]);

  // Scroll to section and close menu
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const section = document.getElementById(href.replace('#', ''));
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Close dropdown on outside click (desktop)
  useEffect(() => {
    if (!settingsOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.' + styles.dropdown)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [settingsOpen]);

  return (
    <>
      <nav className={styles.capsuleNavbar}>
        <a href="#home" className={styles.logoLink} onClick={(e) => {
          e.preventDefault();
          if (onAdminClick) {
            onAdminClick();
          } else {
            handleNavClick(e, '#home');
          }
        }}>
          <img src={logo} alt="KIIK 69 Logo" className={styles.logoImg} />
        </a>
        
        <div className={styles.desktopNav}>
          <div className={styles.centerNavLinks}>
            {navLinksData.map((link, index) => (
              <a
                href={link.href}
                className={styles.menuLink}
                key={index}
                onClick={e => handleNavClick(e, link.href)}
              >
                {link.text}
              </a>
            ))}
            {/* Settings Dropdown */}
            <div className={`${styles.dropdown} ${settingsOpen ? styles.dropdownOpen : ''}`} tabIndex={-1}>
              <button
                className={`${styles.dropdownBtn} ${settingsOpen ? styles.dropdownBtnActive : ''}`}
                onClick={toggleSettings}
                aria-haspopup="true"
                aria-expanded={settingsOpen}
                type="button"
              >
                Settings <FaChevronDown style={{ fontSize: '0.9em', marginLeft: 4, transition: 'transform 0.2s', transform: settingsOpen ? 'rotate(-180deg)' : 'none' }} />
              </button>
              <motion.div
                className={styles.dropdownMenu}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={settingsOpen ? { opacity: 1, y: 0, scale: 1 } : {}}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                style={{ display: settingsOpen ? 'block' : 'none' }}
              >
                <button className={styles.dropdownItem} type="button" onClick={handleThemeToggle}>
                  {isLightTheme ? 'Dark Theme' : 'Light Theme'}
                </button>
                <button className={styles.dropdownItem} type="button" onClick={() => {
                  if (onAdminClick) {
                    onAdminClick();
                    setSettingsOpen(false);
                  }
                }}>Admin</button>
              </motion.div>
            </div>
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
                <motion.a
                  href={link.href}
                  className={styles.mobileMenuLink}
                  key={link.href}
                  onClick={e => handleNavClick(e, link.href)}
                  custom={i}
                  variants={navLinkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {link.text}
                </motion.a>
              ))}
              {/* Mobile Settings Dropdown */}
              <div className={styles.dropdown} style={{ width: '100%' }}>
                <button
                  className={styles.dropdownBtn}
                  onClick={toggleMobileSettings}
                  aria-haspopup="true"
                  aria-expanded={mobileSettingsOpen}
                  type="button"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  Settings <FaChevronDown style={{ fontSize: '1em', marginLeft: 4, transition: 'transform 0.2s', transform: mobileSettingsOpen ? 'rotate(-180deg)' : 'none' }} />
                </button>
                <AnimatePresence>
                  {mobileSettingsOpen && (
                    <motion.div
                      className={styles.dropdownMenu}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    >
                      <button className={styles.dropdownItem} type="button" onClick={handleThemeToggle}>
                        {isLightTheme ? 'Dark Theme' : 'Light Theme'}
                      </button>
                      <button className={styles.dropdownItem} type="button" onClick={() => {
                        if (onAdminClick) {
                          onAdminClick();
                          setMobileSettingsOpen(false);
                          setMobileMenuOpen(false);
                        }
                      }}>Admin</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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