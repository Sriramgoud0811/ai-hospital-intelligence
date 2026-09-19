/**
 * Sign Up Page
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const SignUpPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      toast({ type: 'warning', title: 'Missing Information', message: 'All fields are required.' });
      return;
    }

    if (password.length < 6) {
      toast({ type: 'warning', title: 'Weak Password', message: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName);
      toast({ type: 'success', title: 'Account Created', message: 'Clinician profile created successfully.' });
      navigate('/predict');
    } catch (err: any) {
      toast({ type: 'error', title: 'Registration Failed', message: err.message || 'Unable to register.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-500/20">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">Register Clinician Account</h1>
        <p className="text-xs text-slate-400">
          Create an analyst profile to persist audits and collaborate on risk cohorts.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Dr. Alex Morgan"
                className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 px-3 py-2 pl-9 text-white"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Institutional Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@healthsystem.org"
                className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 px-3 py-2 pl-9 text-white"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 px-3 py-2 pl-9 text-white"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/signin" className="text-cyan-400 hover:underline font-semibold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
