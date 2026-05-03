import styles from './Guide.module.css';

export default function Guide() {
  const pillars = [
    'Physical Development',
    'Cognitive Development',
    'Language & Communication',
    'Social & Emotional Well-being'
  ];

  const disorders = [
    { name: 'ADHD', category: 'Behavioural', desc: 'Attention-Deficit/Hyperactivity Disorder affects focus, self-control, and the ability to sit still.' },
    { name: 'ASD', category: 'Developmental', desc: 'Autism Spectrum Disorder impacts communication, social interactions, and behavior.' },
    { name: 'Learning Disorders', category: 'Cognitive', desc: 'Conditions like Dyslexia or Dyscalculia affecting reading, writing, or math skills.' },
    { name: 'Dyspraxia', category: 'Motor Skills', desc: 'Developmental Coordination Disorder affecting physical coordination and motor planning.' },
    { name: 'ODD', category: 'Behavioural', desc: 'Oppositional Defiant Disorder characterized by a pattern of anger, irritability, and defiance.' },
    { name: 'SPD', category: 'Sensory', desc: 'Sensory Processing Disorder where the brain has trouble receiving and responding to information.' }
  ];

  return (
    <div className={styles.guideContainer}>
      <header className={styles.header}>
        <h1>Child Development Guide</h1>
        <p>A comprehensive resource for understanding key developmental milestones and common challenges.</p>
      </header>

      <section className={styles.section}>
        <h2>The 4 Pillars of Development</h2>
        <ul className={styles.pillarList}>
          {pillars.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Understanding Common Disorders</h2>
        <div className={styles.disordersGrid}>
          {disorders.map(d => (
            <div key={d.name} className={styles.disorderCard}>
              <span className={styles.categoryTag}>{d.category}</span>
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Red Flags to Watch For</h2>
        <ul className={styles.redFlagList}>
          <li><strong>By 6 months:</strong> No warm, joyful expressions or smiles.</li>
          <li><strong>By 12 months:</strong> No babbling or reciprocal gestures (pointing, reaching).</li>
          <li><strong>By 24 months:</strong> No meaningful two-word phrases.</li>
          <li><strong>Any Age:</strong> Loss of previously acquired speech, babbling, or social skills.</li>
        </ul>
      </section>
    </div>
  );
}
