import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FAQItem.module.css';

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.faq} ${open ? styles.active : ''}`}>
      <button 
        className={styles.faqQuestion} 
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className={styles.icon}>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <div 
        className={styles.faqAnswer}
        style={{ maxHeight: open ? '500px' : '0' }}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}
