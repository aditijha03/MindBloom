import FAQItem from '../../components/FAQItem/FAQItem';
import styles from './FAQ.module.css';

export default function FAQ() {
  const faqs = [
    { question: 'When should I consider child counselling?', answer: 'Counselling may help if your child shows prolonged behavioral changes, emotional distress, or difficulties in learning or social interaction.' },
    { question: 'What is child psychology?', answer: 'Child psychology is the study of how children develop physically, emotionally, cognitively, and socially.' },
    { question: 'How can parents support their child at home?', answer: 'Consistent routines, open communication, and validating your child\'s emotions can significantly support development.' },
    { question: 'At what age should I seek help?', answer: 'There is no specific age — if you notice persistent behavioural or emotional changes, early support is always beneficial regardless of age.' },
    { question: 'Is this platform a substitute for therapy?', answer: 'No. MindBloom provides general guidance only and does not replace professional diagnosis or in-person therapy.' },
  ];

  return (
    <div className={styles.faqContainer}>
      <header className={styles.header}>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about child development and our platform.</p>
      </header>
      
      <div className={styles.faqList}>
        {faqs.map((item, i) => (
          <FAQItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
