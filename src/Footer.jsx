import React from 'react';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const logo = '/logos/logo.PNG';

export default function Footer() {
  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className={styles.utilityFooterContent}>
        <div className={styles.utilityLeft}>
          <div className={styles.logoAboutWrapper}>
            <img src={logo} alt="KIIK 69 Logo" className={styles.logo} />
            <p className={styles.aboutUs}>
              KIIK 69 Sports Bar is your all-in-one hangout spot in Gachibowli — where good food, great drinks, and fun games come together. Whether you're here to chill, party, or play, we've got a vibe for every mood and every squad.
            </p>
          </div>
          <div className={styles.logoCopyrightWrapper}>
            <div className={styles.copyright}>© 2025 KIIK 69 Sports Bar. All rights reserved.</div>
          </div>
        </div>
        <div className={styles.utilityRight}>
          <a className={styles.utilityBtn} href="https://www.instagram.com/kiik69sportsbar.gachibowli" target="_blank" rel="noopener noreferrer">
            <svg className={styles.utilityIcon} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
            <div className={styles.utilityTextGroup}>
              <span className={styles.utilityLabel}>Follow us on Instagram</span>
              <span className={styles.utilityDetail}>@kiik69sportsbar.gachibowli</span>
            </div>
          </a>
          <a className={styles.utilityBtn} href="https://wa.me/919274696969?text=Hi%2C%20I%E2%80%99d%20like%20to%20book%20a%20party%20package!" target="_blank" rel="noopener noreferrer">
            <svg className={styles.utilityIcon} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.05 11.34a9 9 0 1 0-3.26 7.19l2.35.64a1 1 0 0 0 1.23-1.23l-.64-2.35a8.96 8.96 0 0 0 .32-4.25z"/><path d="M8.29 13.31a6.5 6.5 0 0 1 7.42-7.42"/></svg>
            <div className={styles.utilityTextGroup}>
              <span className={styles.utilityLabel}>Message us on WhatsApp</span>
              <span className={styles.utilityDetail}>+91 92746 96969</span>
            </div>
          </a>
          <a className={styles.utilityBtn} href="tel:9274696969">
            <svg className={styles.utilityIcon} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.29a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.06.35 2.16.59 3.29.72A2 2 0 0 1 22 16.92z"/></svg>
            <div className={styles.utilityTextGroup}>
              <span className={styles.utilityLabel}>Call us</span>
              <span className={styles.utilityDetail}>+91 92746 96969</span>
            </div>
          </a>
          <a className={styles.utilityBtn} href="mailto:info@kiik69.com">
            <svg className={styles.utilityIcon} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
            <div className={styles.utilityTextGroup}>
              <span className={styles.utilityLabel}>Email us</span>
              <span className={styles.utilityDetail}>info@kiik69.com</span>
            </div>
          </a>
          <a className={styles.utilityBtn} href="https://maps.app.goo.gl/jMMuHgGinp6JUSmHA" target="_blank" rel="noopener noreferrer">
            <svg className={styles.utilityIcon} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div className={styles.utilityTextGroup}>
              <span className={styles.utilityLabel}>Locate us</span>
              <span className={styles.utilityDetail}>Gachibowli, Hyderabad</span>
            </div>
          </a>
        </div>
      </div>
    </motion.footer>
  );
} 