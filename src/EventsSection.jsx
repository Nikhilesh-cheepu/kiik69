import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './EventsSection.module.css';

// Updated to include all 7 events, with the newest listed first.
const allEvents = [
  { title: 'Event 7', date: 'Date to be announced', img: '/events/event 7 kiik 69.jpg' },
  { title: 'Event 6', date: 'Date to be announced', img: '/events/event 6 kiik 69.jpg' },
  { title: 'Event 5', date: 'Date to be announced', img: '/events/event 5 kiik.jpg' },
  { title: 'Event 4', date: 'Date to be announced', img: '/events/event 4 kiik.jpg' },
  { title: 'Event 3', date: 'Date to be announced', img: '/events/event 3 kiik.jpg' },
  { title: 'Event 2', date: 'Date to be announced', img: '/events/event 2 kiik.jpg' },
  { title: 'Event 1', date: 'Date to be announced', img: '/events/Event 1 kiik.jpg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } },
};

function EventCard({ event }) {
  const whatsappLink = "https://wa.me/9274696969?text=Hey!%20I%20want%20to%20join%20this%20event.%20What's%20the%20next%20step%3F";

  return (
    <motion.div className={styles.cardWrapper} variants={itemVariants}>
      <div className={styles.eventCard}>
        <div className={styles.cardInner}>
          <div className={`${styles.cardFace} ${styles.cardFaceFront}`}>
            <img src={event.img} alt={event.title} className={styles.eventImage} />
            <h3>{event.title}</h3>
            <p>{event.date}</p>
          </div>
          <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
            <p>Excited to join this event?</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.joinButton}>
              Join Now
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EventsModal({ onClose, events }) {
  return (
    <motion.div
      className={styles.modalBackdrop}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>All Upcoming Events</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalGrid}>
          {events.map(event => <EventCard event={event} key={event.title} />)}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EventsSection() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    document.body.style.overflow = 'hidden';
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    document.body.style.overflow = 'auto';
    setModalOpen(false);
  };

  return (
    <>
      <motion.section
        className={styles.eventsSection}
        id="events"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 className={styles.title} variants={itemVariants}>
          Upcoming Events
        </motion.h2>
        <motion.div className={styles.eventsContainer} variants={containerVariants}>
          {allEvents.slice(0, 4).map(event => (
            <EventCard event={event} key={event.title} />
          ))}
        </motion.div>
        {allEvents.length > 4 && (
          <motion.button
            className={styles.seeMoreButton}
            onClick={handleOpenModal}
            variants={itemVariants}
          >
            See More
          </motion.button>
        )}
      </motion.section>

      <AnimatePresence>
        {isModalOpen && <EventsModal onClose={handleCloseModal} events={allEvents} />}
      </AnimatePresence>
    </>
  );
} 