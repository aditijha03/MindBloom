import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Layout from './components/Layout/Layout';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Services = lazy(() => import('./pages/Services/Services'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const FAQ = lazy(() => import('./pages/FAQ/FAQ'));
const Guide = lazy(() => import('./pages/Guide/Guide'));
const WhyUs = lazy(() => import('./pages/WhyUs/WhyUs'));
const Privacy = lazy(() => import('./pages/Privacy/Privacy'));
const Quiz = lazy(() => import('./pages/Quiz/Quiz'));
const ProfileView = lazy(() => import('./pages/Profile/ProfileView'));
const ProfileEdit = lazy(() => import('./pages/Profile/ProfileEdit'));
const Login = lazy(() => import('./pages/Login/Login'));
const Signup = lazy(() => import('./pages/Signup/Signup'));
const Intro = lazy(() => import('./pages/Intro/Intro'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));

// New Feature Modules
const ActivityLibrary = lazy(() => import('./pages/ActivityLibrary/ActivityLibrary'));
const ScreeningModule = lazy(() => import('./pages/ScreeningModule/ScreeningModule'));
const ProgressTracking = lazy(() => import('./pages/ProgressTracking/ProgressTracking'));
const WeeklyPlanGenerator = lazy(() => import('./pages/WeeklyPlanGenerator/WeeklyPlanGenerator'));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';
import useProfileStore from './store/profileStore';

// Custom CSS spinner for dynamic route loading fallback
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      width: '100%',
      fontFamily: 'sans-serif',
      color: '#6d5dfc',
      fontSize: '1.2rem',
      fontWeight: '600'
    }}>
      <div className="spinner-loader" style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #6d5dfc',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        marginRight: '12px'
      }}></div>
      <style>{`
        .spinner-loader {
          animation: spin-loader 1s linear infinite;
        }
        @keyframes spin-loader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      Loading MindBloom...
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ProtectedRoute component (Standard Auth)
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children || <Outlet />;
}

// ProfileRequiredRoute component (Auth + Profile exists)
function ProfileRequiredRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const profiles = useProfileStore(state => state.profiles);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (profiles.length === 0) {
    return <Navigate to="/profile" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}


function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Standalone — no Navbar/Footer */}
          <Route path="/intro" element={<Intro />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Authenticated routes inside DashboardLayout */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />

            {/* Profile required for these routes */}
            <Route element={<ProfileRequiredRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<ActivityLibrary />} />
              <Route path="/screening" element={<ScreeningModule />} />
              <Route path="/progress" element={<ProgressTracking />} />
              <Route path="/weekly" element={<WeeklyPlanGenerator />} />
              <Route path="/guide" element={<Guide />} />
            </Route>
          </Route>

          {/* Main layout group (Public) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/contact" element={<Contact />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <QuizProvider>
          <AppRoutes />
        </QuizProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
