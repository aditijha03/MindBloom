import { useEffect } from 'react';
import useBloomBotStore from '../../store/useBloomBotStore';
import styles from './BloomBot.module.css';

const EMOTIONS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Angry', emoji: '😡' },
  { label: 'Worried', emoji: '😟' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Confused', emoji: '😕' },
  { label: 'Excited', emoji: '🤩' },
  { label: "I don't know", emoji: '🤷' },
  { label: 'Other', emoji: '💬' }
];

const EmotionCheckIn = () => {
  const { startSession, sendMessage, setScreen } = useBloomBotStore();

  useEffect(() => {
    // Start session when component mounts to get the disclaimer/opening
    startSession();
  }, [startSession]);

  const handleEmotionClick = (emotion) => {
    setScreen('chat');
    sendMessage(`I am feeling ${emotion}`);
  };

  return (
    <div className={styles.welcomeScreen} style={{ padding: '0 16px' }}>
      <h3 style={{ margin: '0' }}>How are you feeling today?</h3>
      
      <div className={styles.emotionGrid}>
        {EMOTIONS.map((emo) => (
          <button 
            key={emo.label} 
            className={styles.emotionBtn}
            onClick={() => handleEmotionClick(emo.label)}
          >
            <span>{emo.emoji}</span>
            <small>{emo.label}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionCheckIn;
