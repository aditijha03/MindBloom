import useBloomBotStore from '../../store/useBloomBotStore';
import styles from './BloomBot.module.css';
import WelcomeScreen from './WelcomeScreen';
import EmotionCheckIn from './EmotionCheckIn';
import ChatInterface from './ChatInterface';
import CrisisScreen from './CrisisScreen';
import { MessageCircle, X, RefreshCcw, Flower } from 'lucide-react';

const BloomBotWidget = () => {
  const { isOpen, setIsOpen, currentScreen, clearSession } = useBloomBotStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'emotion-checkin':
        return <EmotionCheckIn />;
      case 'chat':
        return <ChatInterface />;
      case 'crisis':
        return <CrisisScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {isOpen && (
        <div className={styles.botWindow}>
          <div className={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flower size={18} /> Bloom Bot
            </div>
            <div className={styles.headerControls}>
              <button onClick={clearSession} title="Restart Session">
                <RefreshCcw size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} title="Close">
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Main content area based on current screen */}
          {renderScreen()}
        </div>
      )}

      {!isOpen && (
        <button 
          className={styles.toggleButton} 
          onClick={() => setIsOpen(true)}
          title="Open Bloom Bot"
        >
          <Flower size={28} />
        </button>
      )}
    </div>
  );
};

export default BloomBotWidget;
