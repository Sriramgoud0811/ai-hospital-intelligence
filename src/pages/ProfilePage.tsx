/**
 * Clinician Profile Page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, LogOut, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, signOut, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({ type: 'info', title: 'Signed Out', message: 'You have been logged out.' });
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          Clinician Analyst Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your session credentials and clinical access permissions.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.displayName || 'Clinical Analyst'}</h2>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/40">
                <ShieldCheck className="w-3 h-3" />
                {isDemoMode ? 'Demo Lead Clinician Session' : 'Firebase Authenticated'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px]">USER IDENTIFIER</span>
            <span className="font-mono text-slate-300 text-xs break-all">{user?.uid}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px]">SESSION MODE</span>
            <span className="font-semibold text-teal-300 text-xs">
              {isDemoMode ? 'Client-Side Session (Demo)' : 'Cloud Persistent Auth'}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
