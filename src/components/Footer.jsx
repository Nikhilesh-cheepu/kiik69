import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: '+91 9274696969',
      href: 'tel:+919274696969'
    },
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      value: '+91 9274696969',
      href: 'https://wa.me/919274696969'
    },
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'info@kiik69.com',
      href: 'mailto:info@kiik69.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'Address',
      value: 'Gachibowli, Hyderabad, Telangana, India',
      href: 'https://share.google/BXjbfRXWSfciwBVIS'
    }
  ];

  const socialLinks = [
    { icon: <FaInstagram />, href: 'https://www.instagram.com/kiik69sportsbar.gachibowli/', label: 'Instagram' },
    { icon: <FaFacebook />, href: 'https://www.facebook.com/kiik69sportsbar/', label: 'Facebook' }
  ];

  const quickLinks = [
    { label: "What's Inside", href: '#whats-inside' },
    { label: 'Menu', href: '#menu' },
    { label: 'Gallery', href: '#vibes' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'About', href: '#about' }
  ];

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(255, 0, 60, 0.1) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '4rem 0 2rem',
        marginTop: '4rem'
      }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 style={{
              fontSize: '2rem',
              marginBottom: '1.5rem',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-heading)'
            }}>
              Get In Touch
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'var(--color-white)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    padding: '0.5rem',
                    borderRadius: '8px'
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 0, 60, 0.1)',
                    transform: 'translateX(5px)'
                  }}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <span style={{
                    fontSize: '1.2rem',
                    color: 'var(--color-primary)',
                    minWidth: '20px'
                  }}>
                    {contact.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginBottom: '0.2rem' }}>
                      {contact.label}
                    </div>
                    <div style={{ fontSize: '1rem' }}>
                      {contact.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 style={{
              fontSize: '2rem',
              marginBottom: '1.5rem',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-heading)'
            }}>
              Quick Links
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.5rem'
            }}>
              {quickLinks.map((link, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleScrollToSection(link.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-white)',
                    textAlign: 'left',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 0, 60, 0.1)',
                    transform: 'translateX(5px)'
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 style={{
              fontSize: '2rem',
              marginBottom: '1.5rem',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-heading)'
            }}>
              Follow Us
            </h3>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--color-white)',
                    textDecoration: 'none',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'visible'
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 0, 60, 0.8)',
                    boxShadow: '0 3px 15px rgba(255, 0, 60, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>
              © {currentYear} KIIK69. All rights reserved.
            </div>
            <div style={{
              display: 'flex',
              gap: '2rem',
              fontSize: '0.9rem'
            }}>
              <a
                href="#"
                style={{
                  color: 'var(--color-gray)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-gray)'}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                style={{
                  color: 'var(--color-gray)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-gray)'}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 