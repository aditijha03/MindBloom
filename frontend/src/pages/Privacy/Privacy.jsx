import styles from './Privacy.module.css';

export default function Privacy() {
  const policies = [
    { q: '1. Is my child’s data confidential?', a: 'Yes, all data entered into MindBloom is stored securely and is completely confidential.' },
    { q: '2. What kind of data do you collect?', a: 'We collect minimal profile information (name, age, optional concerns) strictly to personalize your experience on the platform.' },
    { q: '3. Is the AI chatbot safe for my child?', a: 'Our chatbots are designed for parents and educators, not for direct use by children. They follow strict safety guardrails.' },
    { q: '4. Do you share information with third parties?', a: 'No. We never sell, rent, or share your personal information with third-party advertisers.' },
    { q: '5. How can I delete my data?', a: 'You can delete your account and all associated child profiles at any time from the Profile settings.' },
    { q: '6. Is MindBloom a substitute for therapy?', a: 'No, MindBloom provides educational resources and general guidance. It does not provide medical diagnoses.' },
    { q: '7. What should I do in an emergency?', a: 'If your child is in immediate danger or experiencing a crisis, please contact local emergency services or a dedicated helpline immediately.' }
  ];

  return (
    <div className={styles.privacyContainer}>
      <header className={styles.header}>
        <h1>Privacy Policy & Guidelines</h1>
        <p>Your trust is our top priority. We are committed to protecting your family's privacy.</p>
      </header>

      <div className={styles.policyList}>
        {policies.map((p, i) => (
          <div key={i} className={styles.privacyBox}>
            <h3>{p.q}</h3>
            <p>{p.a}</p>
          </div>
        ))}
      </div>

      <div className={styles.footerNote}>
        <p>By using MindBloom, you agree to these guidelines. If you have any concerns, please contact our support team.</p>
      </div>
    </div>
  );
}
