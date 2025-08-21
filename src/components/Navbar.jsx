import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaComments } from 'react-icons/fa';
import Chat from './Chat';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDesktop, setIsDesktop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);


  // Handle screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Check initially
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Scrollspy effect - detect active section
      const sections = ['home', 'menu-section', 'party-packages', 'contact-section'];
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle chat toggle
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };



  // Handle navigation click
  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      if (sectionId === 'home') {
        // Smooth scroll to top for home
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // Try multiple ways to find the element
      let element = document.getElementById(sectionId);
      
      // If not found, try alternative selectors
      if (!element) {
        element = document.querySelector(`[id="${sectionId}"]`);
      }
      if (!element) {
        element = document.querySelector(`section[id="${sectionId}"]`);
      }
      
      if (element) {
        // Calculate offset for navbar height
        const navbarHeight = 100; // Approximate navbar height
        const elementPosition = element.offsetTop - navbarHeight;
        
        // Try different scroll methods
        try {
          // Method 1: window.scrollTo
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
          
          // Method 2: element.scrollIntoView as fallback
          setTimeout(() => {
            if (window.scrollY < elementPosition - 50) {
              element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 100);
          
          // Add highlight effect
          element.style.transition = 'all 0.3s ease';
          element.style.boxShadow = '0 0 30px rgba(255, 0, 60, 0.3)';
          
          setTimeout(() => {
            element.style.boxShadow = '';
          }, 2000);
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu-section', label: 'Menu' },
    { id: 'party-packages', label: 'Party Packages' },
    { id: 'contact-section', label: 'Contact' }
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '2rem',
        right: '2rem',
        zIndex: 1000,
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      {/* Glassmorphism Container */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(15px)',
        borderRadius: '50px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: '1rem 2rem',
        transition: 'all 0.3s ease'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          position: 'relative'
        }}>
          {/* Logo - Always visible, bigger size */}
          <motion.div
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -2, 2, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '0.5rem',
              flexShrink: 0
            }}
            onClick={() => handleNavClick('home')}
          >
            <img 
              src="/logos/logo.PNG" 
              alt="KIIK69 Sports Bar Logo" 
              style={{
                height: '50px',
                width: 'auto'
              }}
            />
          </motion.div>

          {/* Desktop Navigation - Center */}
          {isDesktop && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              flex: 1,
              marginLeft: '2rem',
              marginRight: '2rem'
            }}>
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    y: -3, 
                    scale: 1.08,
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 8px 25px rgba(255, 0, 60, 0.3)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeSection === link.id ? 'var(--color-primary)' : 'var(--color-white)',
                    fontSize: '0.9rem',
                    fontWeight: activeSection === link.id ? '600' : '400',
                    cursor: 'pointer',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '25px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                    position: 'relative',
                    overflow: 'hidden',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--color-primary)',
                        borderRadius: '1px'
                      }}
                    />
                  )}
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--color-primary)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left'
                    }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  {/* Enhanced glow effect on hover */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle, rgba(255, 0, 60, 0.1) 0%, transparent 70%)',
                      borderRadius: '25px',
                      opacity: 0
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>
          )}

          {/* Right Side - Chat Button and Mobile Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Chat Button - Desktop Only */}
            {isDesktop && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ 
                  y: -3, 
                  scale: 1.05,
                  boxShadow: '0 8px 25px rgba(255, 0, 60, 0.4)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--color-white)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-body)',
                  position: 'relative',
                  overflow: 'hidden',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                <FaComments style={{ fontSize: '1rem' }} />
                Chat
              </motion.button>
            )}

            {/* Mobile Menu Button - Only visible on mobile */}
            {!isDesktop && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  color: 'var(--color-white)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </motion.button>
            )}
          </div>


        </nav>
      </div>

      {/* Popup Chat */}
      <AnimatePresence>
        {isChatOpen && (
          <Chat onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>

      {/* Floating Chat Button for Mobile - Bottom Right Corner */}
      {!isDesktop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 8px 25px rgba(255, 0, 60, 0.4)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '50%',
            color: 'var(--color-white)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            // Add a subtle glow effect
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))'
          }}
          aria-label="Open chat"
        >
          <FaComments />
        </motion.button>
      )}

      {/* Mobile Menu Drawer - Only visible on mobile */}
      {!isDesktop && (
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                marginTop: '0.5rem',
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeSection === link.id ? 'var(--color-primary)' : 'var(--color-white)',
                      fontSize: '1rem',
                      fontWeight: activeSection === link.id ? '600' : '400',
                      cursor: 'pointer',
                      padding: '1rem',
                      textAlign: 'left',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <motion.div
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                          marginLeft: 'auto'
                        }}
                      />
                    )}
                  </motion.button>
                ))}
                
                {/* Chat Button in Mobile Menu */}
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2, delay: navLinks.length * 0.1 + 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toggleChat();
                    setIsMenuOpen(false);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 60, 0.8), rgba(0, 0, 120, 0.8))',
                    border: '1px solid rgba(0, 0, 60, 0.3)',
                    color: 'var(--color-white)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '1rem',
                    textAlign: 'left',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaComments />
                  Chat with KIKKI
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Chat Modal */}
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.header>
  );
};

export default Navbar; 