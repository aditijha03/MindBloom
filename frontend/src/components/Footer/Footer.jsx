import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div>
          <h3>MindBloom</h3>
          <p>Supporting parents and educators in understanding children's emotional and mental development.</p>
        </div>
        <div className={styles.footerLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/why-us">Why Us</Link></li>
            <li><Link to="/quiz">Quiz</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: support@mindbloom.com</p>
          <p>Phone: +91 90000 00000</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 MindBloom | Caring for young minds 💗</p>
      </div>
    </footer>
  );
}
