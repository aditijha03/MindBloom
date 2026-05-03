import styles from './BloomBot.module.css';

const ActivityCard = ({ title, description, onAccept, onDecline }) => {
  return (
    <div className={styles.chatMessage} style={{ backgroundColor: '#e8f0ea', color: '#2c4230', alignSelf: 'flex-start', border: '1px solid #8fb996' }}>
      <h4 style={{ margin: '0 0 8px 0' }}>{title}</h4>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>{description}</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className={styles.btnPrimary} 
          style={{ padding: '6px 12px', fontSize: '13px' }}
          onClick={onAccept}
        >
          Yes, let's try it!
        </button>
        <button 
          className={styles.btnPrimary} 
          style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: 'transparent', color: '#8fb996', border: '1px solid #8fb996' }}
          onClick={onDecline}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
