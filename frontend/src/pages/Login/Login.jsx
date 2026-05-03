import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../hooks/useAuth';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error: apiError } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    login({ email, password });
  };

  return (
    <div className={styles.loginContainer}>
      <Link to="/" className={styles.backBtn}>← Back to Home</Link>
      
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Welcome Back</h2>
          <p>Login to MindBloom to continue</p>
        </div>

        {(error || apiError) && (
          <div className={styles.errorAlert}>
            {error || apiError.response?.data?.error?.message || 'Login failed'}
          </div>
        )}

        <div className={styles.formWrapper}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isPending}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.links}>
            <Link to="/forgot-password" className={styles.resetLink}>Forgot password? Reset</Link>
          </div>

          <button 
            onClick={handleSubmit} 
            className={styles.loginBtn}
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className={styles.footer}>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
