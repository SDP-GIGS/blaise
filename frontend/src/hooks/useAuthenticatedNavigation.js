import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to ensure proper navigation and page restoration on refresh
 * Handles role-based redirects and maintains intended path
 */
export const useAuthenticatedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  const roleDashboards = {
    student: '/student',
    workplace_supervisor: '/supervisor/workplace',
    academic_supervisor: '/supervisor/academic',
    admin: '/admin',
  };

  // On first load or when auth state changes, validate and restore session
  useEffect(() => {
    if (loading) return; // Still loading auth state

    const publicPaths = ['/', '/login', '/signup', '/overview'];
    const isPublicPath = publicPaths.includes(location.pathname);

    // If user is authenticated but on public path, redirect to dashboard
    if (isAuthenticated && user && isPublicPath) {
      const dashboard = roleDashboards[user.role] || '/student';
      navigate(dashboard, { replace: true });
      return;
    }

    // If user is not authenticated and on protected path, redirect to login
    if (!isAuthenticated && !isPublicPath) {
      // Store the intended path for redirect after login
      sessionStorage.setItem('intendedPath', location.pathname);
      navigate('/login', { replace: true });
      return;
    }

    // If authenticated but no user object, try to restore from session
    if (isAuthenticated && !user && !isPublicPath) {
      // Auth context should handle this, just wait
      return;
    }
  }, [isAuthenticated, user, loading, location.pathname, navigate]);

  return { isAuthenticated, user, loading };
};

export default useAuthenticatedNavigation;
