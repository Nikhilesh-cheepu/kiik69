import React from 'react';
import { motion } from 'framer-motion';
import styles from './PartyPackages.module.css';

const packages = [
  {
    icon: '🍹',
    title: 'The Chill Starter',
    features: [
      'For light, relaxed hangouts',
      'Includes mocktails, soft drinks, sodas & food',
      'Ideal for non-drinkers or warm-ups',
    ],
    price: '₹1,400',
    waMsg: 'Hi! I want to book The Chill Starter package at KIIK 69 for ₹1,400.',
  },
  {
    icon: '🍻',
    title: 'The Buzz Beginz',
    features: [
      'Step up with vodka, rum & beer',
      'Includes everything in Chill Starter',
      'Great for casual celebrations',
    ],
    price: '₹2,200',
    waMsg: 'Hi! I want to book The Buzz Beginz package at KIIK 69 for ₹2,200.',
  },
  {
    icon: '🔥',
    title: 'The Weekend Warrior',
    features: [
      'Adds premium brands like 100 Pipers',
      'All drinks + more food combos',
      'Perfect for a Friday or Saturday blast',
    ],
    price: '₹2,500',
    waMsg: 'Hi! I want to book The Weekend Warrior package at KIIK 69 for ₹2,500.',
  },
  {
    icon: '🪩',
    title: 'The Lit League',
    features: [
      'Big booze list: Vodka, Gin, Breezers, Beer',
      'Everything from Buzz + custom cocktails',
      'Best for wild group nights',
    ],
    price: '₹3,000',
    waMsg: 'Hi! I want to book The Lit League package at KIIK 69 for ₹3,000.',
  },
  {
    icon: '👑',
    title: 'The Royal Treatment',
    features: [
      'Premium: Chivas, Jameson, Absolut & more',
      'Cocktails, beers, mocktails, full buffet',
      'All-out vibe. No holding back.',
    ],
    price: '₹3,500',
    waMsg: 'Hi! I want to book The Royal Treatment package at KIIK 69 for ₹3,500.',
  },
  {
    icon: '🎊',
    title: 'The VIP Secret (Limited Custom Package)',
    features: [
      'For birthdays, reunions, big vibes only',
      'Tell us what you need. We\'ll make it grand.',
      'No fixed cost — just magic',
    ],
    price: null,
    waMsg: "Hi! I want to book a custom VIP Secret package at KIIK 69. Here's what I have in mind:",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function PartyPackages() {
  return (
    <motion.section
      className={styles.partyPackagesSection}
      id="packages"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div className={styles.partyIntro} variants={itemVariants}>
        <h2 className={styles.title}>🥳 Unlimited Party Packages</h2>
        <p className={styles.partySubtext}>
          Choose the vibe that suits you best. Each package is crafted for a perfect night out — minimum 20 people required to book a party package.
        </p>
      </motion.div>
      <motion.div
        className={styles.packagesContainer}
        variants={containerVariants}
      >
        {packages.map((pkg, idx) => (
          <motion.div key={pkg.title} className={styles.packageCard} variants={itemVariants}>
            <h3>{pkg.icon} {pkg.title}</h3>
            <ul>
              {pkg.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {pkg.price ? (
              <a
                className={styles.packageButton}
                href={`https://wa.me/919274696969?text=${encodeURIComponent(pkg.waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book for {pkg.price}
              </a>
            ) : (
              <a
                className={styles.packageButton}
                href={`https://wa.me/919274696969?text=${encodeURIComponent(pkg.waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Custom Plan
              </a>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
} 