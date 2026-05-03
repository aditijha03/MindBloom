import { createContext, useContext, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // On mount, sync with localStorage if needed (for initial load only)
  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem('mbUser');
        if (stored) {
          const userData = JSON.parse(stored);
          // Note: In a real app, we'd verify the token here
          // For now, we'll just set it to allow the UI to load
          setAuth(userData, localStorage.getItem('mbAccessToken'));
        }
      } catch (e) {
        console.error('Failed to parse mbUser', e);
      }
    }
  }, []);

  const login = (userData) => {
    setAuth(userData, 'temp-token'); // useLogin mutation handles the real logic
    localStorage.setItem('mbUser', JSON.stringify(userData));
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem('mbUser');
    localStorage.removeItem('mbAccessToken');
    localStorage.removeItem('mbChildProfile');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
