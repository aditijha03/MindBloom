import { Sprout, ShieldCheck, Book, Users } from 'lucide-react';
import ValueCard from '../../components/ValueCard/ValueCard';
import TeamCard from '../../components/TeamCard/TeamCard';
import styles from './About.module.css';

import psychImg from '../../assets/expert-psych.png';
import familyImg from '../../assets/expert-counsellor.png';
import eduImg from '../../assets/expert-educator.png';

export default function About() {
  const values = [
    { icon: Sprout, title: 'Compassion', text: 'We offer a nurturing environment for development.' },
    { icon: ShieldCheck, title: 'Trust & Privacy', text: 'Confidential care without compromise.' },
    { icon: Book, title: 'Evidence-Based Care', text: 'Solutions driven by the latest clinical research.' },
    { icon: Users, title: 'Family-Centred', text: 'Empowering families to grow together.' },
  ];

  const team = [
    { img: psychImg, name: 'Dr. Sarah', role: 'Child Psychologist' },
    { img: familyImg, name: 'Dr. John', role: 'Family Counsellor' },
    { img: eduImg, name: 'Ms. Emily', role: 'Child Educator' },
  ];

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.introBox}>
        <h1>About MindBloom</h1>
        <p>Our mission is to support parents and educators in guiding the emotional and social development of children.</p>
      </div>

      <section className={styles.missionSection}>
        <div className={styles.missionBox}>
          <h2>Our Mission</h2>
          <p>We aim to equip every parent and educator with the tools and knowledge necessary to help every child thrive in a supportive, loving environment.</p>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <h2>Our Core Values</h2>
        <div className={styles.valuesGrid}>
          {values.map(v => <ValueCard key={v.title} {...v} />)}
        </div>
      </section>

      <section className={styles.teamSection}>
        <h2>Meet Our Experts</h2>
        <div className={styles.teamGrid}>
          {team.map(t => <TeamCard key={t.name} {...t} />)}
        </div>
      </section>

      <div className={styles.disclaimerBox}>
        <p><strong>Note:</strong> MindBloom is intended for educational purposes and should not replace professional medical diagnosis.</p>
      </div>
    </div>
  );
}
