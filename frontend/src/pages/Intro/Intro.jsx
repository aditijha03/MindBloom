import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Intro.module.css';

export default function Intro() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const slides = [
    { 
      id: 1, 
      heading: 'WHAT IS\nCHILD DEVELOPMENT?', 
      body: 'Child development refers to how children grow physically, emotionally, socially, and cognitively from birth through adolescence.' 
    },
    { 
      id: 2, 
      heading: 'WHY DOES IT\nMATTER?', 
      body: 'Early development plays a crucial role in building confidence, resilience, and lifelong learning capabilities.' 
    },
    { 
      id: 3, 
      heading: 'HOW CAN\nWE HELP?', 
      body: 'MindBloom provides simple, research-based insights and professional connections tailored to your family\'s needs.',
      hasCTA: true 
    },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id); // CRITICAL: cleanup on unmount
  }, [slides.length]);

  return (
    <div className={styles.introContainer}>
      <Link to="/" className={styles.backBtn}>&larr; Back to Home</Link>
      {slides.map((slide, i) => (
        <div key={slide.id} className={`${styles.slide} ${i === current ? styles.active : ''}`}>
          <h1 className={styles.heading}>{slide.heading}</h1>
          <p className={styles.body}>{slide.body}</p>
          {slide.hasCTA && (
            <div className={styles.ctaGroup}>
              <button onClick={() => navigate('/')} className={styles.ctaBtn}>
                Explore MindBloom
              </button>
              <Link to="/services" className={styles.servicesBtn}>
                Know Our Services
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
