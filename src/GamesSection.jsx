import React from 'react';
import { motion } from 'framer-motion';
import styles from './GamesSection.module.css';

const games = [
  {
    name: 'Pool Table',
    icon: '🕹️',
    prices: [
      { label: '₹500/hour' },
      { label: '₹300/30 min' },
    ],
    contact: '9274696969',
    cta: [
      { label: 'Call Now', href: 'tel:9274696969' },
      { label: 'Book on WhatsApp', href: 'https://wa.me/919274696969?text=I%20want%20to%20book%20a%20Pool%20Table%20slot%20at%20KIIK%2069' },
    ],
  },
  {
    name: 'Bowling',
    icon: '🎳',
    prices: [
      { label: '₹300 (Mon–Thu)' },
      { label: '₹400 (Fri–Sun)' },
    ],
    contact: '7799900012',
    cta: [
      { label: 'Call Now', href: 'tel:7799900012' },
      { label: 'Book on WhatsApp', href: 'https://wa.me/917799900012?text=I%20want%20to%20book%20a%20Bowling%20slot%20at%20KIIK%2069' },
    ],
  },
  {
    name: 'Darts',
    icon: '🎯',
    prices: [
      { label: '₹200 per game' },
    ],
    contact: '9274696969',
    cta: [
      { label: 'Call Now', href: 'tel:9274696969' },
      { label: 'Book on WhatsApp', href: 'https://wa.me/919274696969?text=I%20want%20to%20book%20a%20Darts%20game%20at%20KIIK%2069' },
    ],
  },
  {
    name: 'Foosball',
    icon: '🕹️',
    prices: [
      { label: '₹200 per game' },
    ],
    contact: '9274696969',
    cta: [
      { label: 'Call Now', href: 'tel:9274696969' },
      { label: 'Book on WhatsApp', href: 'https://wa.me/919274696969?text=I%20want%20to%20book%20a%20Foosball%20game%20at%20KIIK%2069' },
    ],
  },
];

export default function GamesSection() {
  return (
    <section className={styles.gamesSection} id="games">
      <h2 className={styles.title}>🎮 Games at KIIK 69</h2>
      <div className={styles.cardsGrid}>
        {games.map((game) => (
          <motion.div
            className={styles.gameCard}
            key={game.name}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <div className={styles.icon}>{game.icon}</div>
            <div className={styles.gameName}>{game.name}</div>
            <div className={styles.prices}>
              {game.prices.map((p, i) => (
                <div className={styles.priceRow} key={i}>{p.label}</div>
              ))}
            </div>
            <div className={styles.ctaBtns}>
              {game.cta.map((btn, i) => (
                <a
                  key={i}
                  href={btn.href}
                  className={styles.ctaBtn}
                  target={btn.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {btn.label}
                </a>
              ))}
            </div>
            <div className={styles.contact}>📞 {game.contact}</div>
          </motion.div>
        ))}
      </div>
      <div className={styles.footerNote}>
        <span role="img" aria-label="bowling">🎳</span> Bowling is first come, first serve. If you want to skip the wait, pre-book now!
      </div>
    </section>
  );
} 