import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FaqPage.module.css';

const faqData = [
  {
    question: 'What are your opening hours?',
    answer: 'We are open every day from 12 PM to 1 AM, including weekends and holidays.',
  },
  {
    question: 'Do you host private parties or events?',
    answer: 'Yes, we do! You can choose from our special party packages and reserve private sections.',
  },
  {
    question: 'Is there an entry fee?',
    answer: 'There is no entry fee on most days. However, special events or weekends may have cover charges.',
  },
  {
    question: 'Do you serve both veg and non-veg food?',
    answer: 'Absolutely! Our menu offers a variety of veg and non-veg starters, mains, and desserts.',
  },
  {
    question: 'Is there a dress code?',
    answer: 'We recommend smart casuals. Slippers or sleeveless vests are not allowed.',
  },
  {
    question: 'How can I book a table or package?',
    answer: 'Just click the Book Now button on the top right, or message us on WhatsApp at 9274696969.',
  },
];

const FaqItem = ({ item, onClick, isOpen }) => {
  return (
    <motion.div className={styles.faqItem} onClick={onClick}>
      <motion.div className={styles.questionHeader}>
        <h3 className={styles.questionText}>{item.question}</h3>
        <motion.span
          className={styles.icon}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.answerContainer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <p className={styles.answerText}>{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection} id="faq">
      <h2 className={styles.title}>Frequently Asked Questions</h2>
      <div className={styles.faqList}>
        {faqData.map((item, index) => (
          <FaqItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </section>
  );
} 