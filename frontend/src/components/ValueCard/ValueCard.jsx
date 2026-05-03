import styles from './ValueCard.module.css';

export default function ValueCard({ icon: Icon, title, text }) {
  return (
    <div className={styles.valueCard}>
      <div className={styles.icon}>
        <Icon size={32} color="#8c2a30" />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
