import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        🌸 MindBloom
      </Link>

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
        <li>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/why-us" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ''}>
            Why Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/quiz" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ''}>
            Quiz
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ''}>
            Contact
          </NavLink>
        </li>
        {user && (
          <li>
            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </li>
        )}
        {!user && (
          <>
            <li>
              <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ''}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ''}>
                Signup
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
