import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Layout from './components/Layout/Layout';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import Guide from './pages/Guide/Guide';
import WhyUs from './pages/WhyUs/WhyUs';
import Privacy from './pages/Privacy/Privacy';
import Quiz from './pages/Quiz/Quiz';
import ProfileView from './pages/Profile/ProfileView';
import ProfileEdit from './pages/Profile/ProfileEdit';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Intro from './pages/Intro/Intro';
import Dashboard from './pages/Dashboard/Dashboard';

// New Feature Modules
import ActivityLibrary from './pages/ActivityLibrary/ActivityLibrary';
import ScreeningModule from './pages/ScreeningModule/ScreeningModule';
import ProgressTracking from './pages/ProgressTracking/ProgressTracking';
import WeeklyPlanGenerator from './pages/WeeklyPlanGenerator/WeeklyPlanGenerator';
import ParentGuidance from './pages/ParentGuidance/ParentGuidance';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';

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
  const location = useLocation();
  const hasProfile = localStorage.getItem('mbChildProfile');

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasProfile) {
    return <Navigate to="/profile" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}


function AppRoutes() {
  return (
    <BrowserRouter>
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
            <Route path="/parent" element={<ParentGuidance />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/why-us" element={<WhyUs />} />
          </Route>
        </Route>

        {/* Main layout group (Public) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/quiz" element={<Quiz />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
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
