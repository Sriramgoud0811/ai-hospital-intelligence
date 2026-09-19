/**
 * Sign In Page
 * Supports instant demo mode access as well as Firebase Auth credentials
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithDemo, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname || '/predict';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ type: 'warning', title: 'Missing Credentials', message: 'Please enter both email and password.' });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast({ type: 'success', title: 'Signed In', message: 'Welcome back to AI Hospital Intelligence.' });
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({ type: 'error', title: 'Authentication Failed', message: err.message || 'Invalid credentials provided.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    signInWithDemo();
    toast({ type: 'success', title: 'Demo Access Granted', message: 'Signed in as Demo Lead Clinician.' });
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-500/20">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">Clinician Portal Sign In</h1>
        <p className="text-xs text-slate-400">
          Access secure prediction pipelines, custom encounter audits, and model intelligence.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl space-y-5">
        {/* Instant Demo Access Button */}
        <button
          id="btn-demo-login"
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 border border-teal-500/40 text-teal-300 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>1-Click Instant Demo Clinician Access</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] text-slate-500 uppercase font-mono">Or with credentials</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@hospital.org"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 hover:underline font-semibold">
            Register Clinician
          </Link>
        </div>
      </div>
    </div>
  );
};
