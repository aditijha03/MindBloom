import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Home.module.css';

// imported generated assets 
import heroImg from '../../assets/hero-bg.png';
import flowerImg from '../../assets/flower-diagram.png';
import kidChalkImg from '../../assets/kid-chalk.png';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.heroSection} style={{ backgroundImage: `url(${heroImg})` }}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>Understanding Little Minds</h1>
          <h2>Helping children grow emotionally, mentally & happily</h2>
          <p className={styles.slogan}>"Nurturing minds today for a healthier tomorrow"</p>
          <button className={styles.aboutBtn} onClick={() => navigate('/intro')}>
            What is MindBloom
          </button>
        </div>
      </header>

      <section className={styles.quizSection}>
        <div className={styles.quizCard}>
          <h3>Child Emotion Quiz</h3>
          <p>Take a quick quiz to understand emotional and behavioral signs in children.</p>
          <button className={styles.startQuizBtn} onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      </section>

      <section className={styles.infoSection}>
        <h2>Why Child Psychology Matters</h2>
        <p>Child psychology studies how children think, feel, and behave as they grow. Understanding emotional and cognitive development helps parents and teachers support children during their most important learning years.</p>
      </section>

      <section className={styles.cardsSection}>
        <div className={styles.card}>
          <div className={styles.cardImgWrapper}>
            <img src={flowerImg} alt="Child Developmental Needs Diagram" className={styles.cardImg} />
          </div>
          <div className={styles.cardContent}>
            <h3>Emotional Development</h3>
            <p>Children learn to manage emotions and build confidence.</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardImgWrapper}>
            <img src={kidChalkImg} alt="Toddler playing with chalk" className={styles.cardImg} />
          </div>
          <div className={styles.cardContent}>
            <h3>Social Skills</h3>
            <p>Build friendships, communication, and empathy.</p>
          </div>
        </div>
      </section>

      <section className={styles.awarenessSection}>
        <h2>Creating Awareness</h2>
        <p>Early awareness helps parents guide children toward healthy development.</p>
      </section>
    </div>
  );
}
