import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';
import useAuthStore from '../../store/authStore';

export default function Layout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  const isStandaloneQuiz = location.pathname === '/quiz' && isAuthenticated;

  if (isStandaloneQuiz) {
    return (
      <div className={styles.layout}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
