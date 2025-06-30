import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

  // If loading takes too long, show error and redirect
  if (timeoutReached && loading) {
    console.error('Authentication timeout reached');
    return <Navigate to="/auth" state={{ from: location, error: 'Authentication timeout' }} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <p className="text-white text-lg mb-2">Loading...</p>
          <div className="w-48 bg-white/20 rounded-full h-2 mx-auto">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-gray-300 text-sm mt-4">Connecting to your loops...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;