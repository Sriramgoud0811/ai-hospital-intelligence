/**
 * Protected Route Wrapper
 * Checks user authentication state and redirects unauthenticated users to /signin
 * Preserves the attempted URL in location state for seamless post-login redirect
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg mb-4">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">Verifying Clinician Session</h3>
        <p className="text-xs text-slate-400 mt-1">Resolving secure authentication credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
