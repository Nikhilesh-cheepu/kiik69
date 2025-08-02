import React from 'react';
import { motion } from 'framer-motion';

const WhatsInsideSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section style={{
      padding: '80px 2rem',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{
          maxWidth: '800px',
          textAlign: 'center',
          width: '100%'
        }}
      >
        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '400',
            color: 'var(--color-primary)',
            marginBottom: '2rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textShadow: '0 4px 20px rgba(255, 0, 60, 0.3)'
          }}
        >
          WHAT'S INSIDE?
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            lineHeight: 1.8,
            color: 'var(--color-white)',
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto',
            fontWeight: '400',
            letterSpacing: '0.02em'
          }}
        >
          Imagine a place where the energy of a match meets the chill of your favorite beer.
          <br /><br />
          Big screens. Louder cheers. Cold drinks. Hot bites.
          <br /><br />
          And maybe even a surprise dance move or two from your friend after that 3rd pint 🍻
          <br /><br />
          We're still putting together the ultimate showcase — stay tuned, it's gonna be wild.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default WhatsInsideSection; 