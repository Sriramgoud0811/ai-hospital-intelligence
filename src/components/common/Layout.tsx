/**
 * Root Layout Component
 * Provides global navigation, main container, hospital background backdrop,
 * side footer, and responsive bottom footer
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SideFooter } from './SideFooter';
import { NovaWidget } from '../nova/NovaWidget';
import hospitalBg from '../../assets/images/hospital_bg_1789730438692.jpg';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200 relative overflow-x-hidden">
      {/* Hospital Architectural Background Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{ backgroundImage: `url(${hospitalBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95" />

      {/* Main App Content Stack */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Side Footer */}
      <SideFooter />

      {/* Persistent Nova AI Clinical Assistant Widget */}
      <NovaWidget />
    </div>
  );
};

