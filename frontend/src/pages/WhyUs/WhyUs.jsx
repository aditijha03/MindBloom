import { 
  Heart, 
  ShieldCheck, 
  Dna, 
  Users, 
  MessageCircle, 
  Globe, 
  Scale 
} from 'lucide-react';
import styles from './WhyUs.module.css';

export default function WhyUs() {
  const features = [
    { icon: Heart, title: 'Child-Centred Approach', text: 'Every strategy is designed with the unique needs of a developing child in mind.' },
    { icon: ShieldCheck, title: 'Privacy First', text: 'We adhere to strict data protection standards to keep your family\'s information secure.' },
    { icon: Dna, title: 'Evidence-Based', text: 'Our content is backed by established developmental psychology research.' },
    { icon: Users, title: 'Parental Collaboration', text: 'We believe active parent involvement is key to a child\'s progress.' },
    { icon: MessageCircle, title: 'Empathetic Communication', text: 'Resources are delivered in a clear, supportive, and encouraging manner.' },
    { icon: Globe, title: 'Accessible Services', text: 'Our platform makes essential guidance available anytime, anywhere.' },
    { icon: Scale, title: 'Ethical Standards', text: 'We provide guidance and awareness, never online medical diagnoses.' }
  ];

  return (
    <div className={styles.whyUsContainer}>
      <section className={styles.hero}>
        <h1>Why Choose MindBloom?</h1>
        <p>We combine modern technology with trusted psychological principles to provide a supportive environment for your family.</p>
      </section>

      <div className={styles.featuresGrid}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className={styles.featureCard}>
              <div className={styles.iconBox}>
                <Icon size={32} color="#8c2a30" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          );
        })}
      </div>

      <section className={styles.missionSection}>
        <h2>Our Mission</h2>
        <p>To empower parents with the knowledge and tools they need to nurture their child's emotional and mental well-being, fostering a generation of resilient and happy individuals.</p>
      </section>
    </div>
  );
}
