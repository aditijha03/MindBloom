import styles from './ServiceCard.module.css';

export default function ServiceCard({ title, icon: Icon, description }) {
  return (
    <div className={styles.serviceCard}>
      <div className={styles.icon}>
        <Icon size={32} color="#8c2a30" />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
