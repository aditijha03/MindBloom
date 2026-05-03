import { 
  Brain, 
  BookOpen, 
  Users, 
  Heart, 
  CloudRain, 
  Monitor,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import styles from './Services.module.css';

export default function Services() {
  const services = [
    { title: 'Emotional & Behavioural Support', icon: Brain, description: "Guidance and therapies tailored to your child's emotional growth and behavioural challenges." },
    { title: 'Learning & Attention Guidance', icon: BookOpen, description: 'Strategies to enhance focus, reduce distractions, and support unique learning styles.' },
    { title: 'Social Skills Development', icon: Users, description: 'Helping children build meaningful connections and communicate effectively with peers.' },
    { title: 'Parent Guidance', icon: Heart, description: 'Empathetic coaching for parents navigating parenting challenges with confidence.' },
    { title: 'Anxiety & Stress Support', icon: CloudRain, description: 'Tools and safe spaces to help children manage daily anxieties and stressors.' },
    { title: 'Online Counselling Support', icon: Monitor, description: 'Accessible virtual sessions providing professional support remotely.' },
  ];

  return (
    <div className={styles.servicesContainer}>
      <Link to="/" className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <header className={styles.header}>
        <h1>Our Services</h1>
        <p>Comprehensive support tailored to nurture every aspect of your child's well-being.</p>
      </header>
      
      <div className={styles.servicesGrid}>
        {services.map(s => <ServiceCard key={s.title} {...s} />)}
      </div>
    </div>
  );
}
