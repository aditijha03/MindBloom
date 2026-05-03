import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Palette, 
  Search, 
  LineChart, 
  Calendar, 
  Heart, 
  Home, 
  Info, 
  LifeBuoy, 
  LogOut,
  Menu,
  X,
  Pencil
} from 'lucide-react';
import { useLogout } from '../../hooks/useAuth';
import useAuthStore from '../../store/authStore';
import styles from './DashboardLayout.module.css';
import BloomBotWidget from '../BloomBot/BloomBotWidget';
export default function DashboardLayout() {
  const user = useAuthStore(state => state.user);
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mbChildProfile'));
    if (saved) setProfile(saved);
    setIsMobileMenuOpen(false);
  }, [location]);

  const childName = profile?.name || 'Your Child';
  const childAge = profile?.age || '—';
  const avatar = profile?.avatar;

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    {
      group: 'Main', items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/quiz', label: 'Take Quiz', icon: FileText },
        { to: '/guide', label: 'Milestones', icon: CheckCircle },
      ]
    },
    {
      group: 'Tools', items: [
        { to: '/activities', label: 'Activity Library', icon: Palette },
        { to: '/screening', label: 'Screening', icon: Search },
        { to: '/progress', label: 'Progress', icon: LineChart },
        { to: '/weekly', label: 'Weekly Plan', icon: Calendar },
        { to: '/parent', label: 'Parent Guidance', icon: Heart },
      ]
    },
    {
      group: 'Info', items: [
        { to: '/', label: 'Home Page', icon: Home },
        { to: '/why-us', label: 'Why Us', icon: Info },
        { to: '/contact', label: 'Help & Support', icon: LifeBuoy },
      ]
    }
  ];

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <Link to="/dashboard" className={styles.logo}>🌸 MindBloom</Link>
        <button
          className={styles.menuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <Link to="/dashboard" className={styles.logoLink}>
            <h2 className={styles.logo}>🌸 MindBloom</h2>
          </Link>

          <Link to="/profile" className={styles.profileSection}>
            <div className={styles.avatar}>
              {avatar
                ? <img src={avatar} alt={childName} />
                : <span>{childName[0]?.toUpperCase()}</span>
              }
              <div className={styles.editBadge}>
                <Pencil size={12} />
              </div>
            </div>
            <div className={styles.profileInfo}>
              <h3>{childName}</h3>
              <span>Age {childAge}</span>
            </div>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((group) => (
            <div key={group.group} className={styles.navGroup}>
              <span className={styles.groupLabel}>{group.group}</span>
              {group.items.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                  <link.icon size={18} className={styles.navIcon} />
                  <span className={styles.linkLabel}>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      <BloomBotWidget />
    </div>
  );
}
