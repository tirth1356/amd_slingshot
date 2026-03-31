import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050f] flex items-center justify-center p-20">
        <LoadingSpinner size="lg" message="Authenticating..." />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Final validation will happen in Onboarding check if needed
  return children ? children : <Outlet />;
}
