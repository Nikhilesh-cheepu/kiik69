import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MenuSection.module.css';

const foodMenu = '/menu/FoodMenu.jpeg';
const liquorMenu = '/menu/LIquorMenu.jpeg';

function MenuModal({ src, onClose }) {
  return (
    <motion.div
      className={styles.modalBackdrop}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.img
        src={src}
        className={styles.modalImage}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      />
      <button onClick={onClose} className={styles.closeButton}>&times;</button>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function MenuSection() {
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    if (selectedMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedMenu]);

  const menuItems = [
    { title: 'Food Menu', image: foodMenu },
    { title: 'Spirits & Cocktails', image: liquorMenu },
  ];

  return (
    <>
      <motion.section
        className={styles.menuSection}
        id="menu"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 className={styles.title} variants={itemVariants}>
          Our Menu
        </motion.h2>
        <motion.div
          className={styles.menuContainer}
          variants={containerVariants}
        >
          {menuItems.map((item) => (
            <motion.div
              key={item.title}
              className={styles.menuCard}
              variants={itemVariants}
              onClick={() => setSelectedMenu(item.image)}
            >
              <img
                src={item.image}
                alt={item.title}
                className={styles.menuImage}
              />
              <div className={styles.overlay}>
                <h3>{item.title}</h3>
                <p>Click to View</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      <AnimatePresence>
        {selectedMenu && <MenuModal src={selectedMenu} onClose={() => setSelectedMenu(null)} />}
      </AnimatePresence>
    </>
  );
} 