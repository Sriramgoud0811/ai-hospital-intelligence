/**
 * Responsive Navigation Bar
 * Features: Route highlights, API health status, Theme toggle, Auth controls, Mobile drawer
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Layers,
  FileText,
  Cpu,
  Database,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ApiStatusBadge } from './ApiStatusBadge';
import { openNovaChat } from '../../services/novaService';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isDemoMode } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard', highlight: true },
    { label: 'Hospital Ward', path: '/realtime-ward', isLive: true },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname.startsWith('/predict');
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link
            id="brand-logo-link"
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.35)] group-hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                AI Hospital Intelligence
                <span className="hidden md:inline-flex items-center text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                  Live Care
                </span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Clinical Risk & Stay Duration Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-nav"
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1 text-sm font-medium"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs font-semibold flex items-center gap-1.5 ${
                    active
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  {link.isLive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Health Status, Nova Trigger, Theme, Auth / CTA */}
          <div className="flex items-center gap-2.5">
            <ApiStatusBadge compact />

            {/* Nova AI Assistant Trigger */}
            <button
              type="button"
              id="navbar-nova-assistant-btn"
              onClick={() => openNovaChat()}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-500/40 bg-teal-950/40 hover:bg-teal-900/60 text-teal-300 text-xs font-semibold transition cursor-pointer shadow-xs"
              title="Open Nova AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Nova AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* User Session or Sign In */}
            {user ? (
              <div className="relative flex items-center gap-2">
                <Link
                  id="user-profile-btn"
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800/80 text-xs font-medium text-slate-200 transition"
                  title="View Clinician Profile"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center text-[11px] text-white font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user.displayName || 'Clinician'}</span>
                </Link>
                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 border border-slate-800 transition"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  id="btn-signin-nav"
                  to="/signin"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  id="btn-launch-studio-nav"
                  to="/predict"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white shadow-[0_0_12px_rgba(20,184,166,0.3)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Studio</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="xl:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  id={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  to={link.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {link.isLive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              type="button"
              id="mobile-nova-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openNovaChat();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-teal-500/40 bg-teal-950/40 text-teal-300 font-semibold text-sm shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Ask Nova AI Assistant</span>
            </button>

            <Link
              id="mobile-cta-studio"
              to="/predict"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Launch Prediction Studio
            </Link>

            {!user ? (
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link
                  id="mobile-signin"
                  to="/signin"
                  className="text-center py-2 rounded-lg border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  id="mobile-signup"
                  to="/signup"
                  className="text-center py-2 rounded-lg border border-cyan-800/60 bg-cyan-950/50 text-cyan-300 text-xs font-semibold hover:bg-cyan-950"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium truncate">{user.email}</span>
                </div>
                <button
                  id="mobile-logout-btn"
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
