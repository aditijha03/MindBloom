import useBloomBotStore from '../../store/useBloomBotStore';
import styles from './BloomBot.module.css';

const CrisisScreen = () => {
  const { setScreen } = useBloomBotStore();

  return (
    <div className={styles.crisisScreen}>
      <h3 style={{ marginTop: 0 }}>Bloom Bot - I'm here with you</h3>
      <p style={{ textAlign: 'left', fontSize: '15px' }}>
        I heard what you said, and I'm really glad you told me. What you're feeling matters.
      </p>
      <p style={{ textAlign: 'left', fontSize: '15px' }}>
        This is something important to talk about with a grown-up you trust - like a parent, teacher, or school counsellor.
      </p>
      
      <div className={styles.crisisCard}>
        <strong>iCall India:</strong> <a href="tel:9152987821">9152987821</a>
      </div>
      <div className={styles.crisisCard}>
        <strong>Vandrevala Foundation:</strong> <a href="tel:18602662345">1860-2662-345</a> (24/7)
      </div>

      <button 
        className={styles.btnPrimary} 
        style={{ marginTop: '24px', backgroundColor: '#e6a845' }}
        onClick={() => setScreen('chat')}
      >
        Keep talking to Bloom
      </button>
    </div>
  );
};

export default CrisisScreen;
