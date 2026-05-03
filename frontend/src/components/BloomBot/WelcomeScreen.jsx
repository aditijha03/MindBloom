import useBloomBotStore from '../../store/useBloomBotStore';
import styles from './BloomBot.module.css';

const WelcomeScreen = () => {
  const { setScreen, setUserType, setAgeTier, userType } = useBloomBotStore();

  if (!userType) {
    return (
      <div className={styles.welcomeScreen}>
        <h2>Hi! I'm Bloom</h2>
        <p>Your friendly feelings helper.</p>
        <p>Are you a child or a grown-up?</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className={styles.btnPrimary} onClick={() => setUserType('child')}>
            I'm a child
          </button>
          <button className={styles.btnPrimary} onClick={() => setUserType('parent')}>
            I'm a parent
          </button>
        </div>
      </div>
    );
  }

  if (userType === 'child') {
    return (
      <div className={styles.welcomeScreen}>
        <h2>How old are you?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className={styles.btnPrimary} onClick={() => { setAgeTier('early'); setScreen('emotion-checkin'); }}>
            5 - 7 years old
          </button>
          <button className={styles.btnPrimary} onClick={() => { setAgeTier('middle'); setScreen('emotion-checkin'); }}>
            8 - 11 years old
          </button>
          <button className={styles.btnPrimary} onClick={() => { setAgeTier('tween'); setScreen('emotion-checkin'); }}>
            12 - 14 years old
          </button>
        </div>
      </div>
    );
  }

  // Parent consent/welcome
  return (
    <div className={styles.welcomeScreen} style={{ padding: '0 20px' }}>
      <h2>Parent Guidance</h2>
      <p style={{ fontSize: '14px', textAlign: 'left' }}>
        Bloom Bot provides evidence-informed guidance to help you support your child's emotional wellbeing. 
        It does not provide medical diagnoses or replace professional therapy.
      </p>
      <button 
        className={styles.btnPrimary} 
        onClick={() => { setScreen('chat'); }}
        style={{ marginTop: '20px' }}
      >
        I understand, let's start
      </button>
    </div>
  );
};

export default WelcomeScreen;
