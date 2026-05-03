import styles from './TeamCard.module.css';

export default function TeamCard({ img, name, role }) {
  return (
    <div className={styles.teamCard}>
      <img src={img} alt={`${name} - ${role}`} className={styles.teamImg} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}
