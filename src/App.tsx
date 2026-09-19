/**
 * AI Hospital Intelligence - Application Root
 * Configures routing, theme provider, auth provider, toast notifications, and protected routes.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { RealTimeWardPage } from './pages/RealTimeWardPage';
import { PredictionStudioPage } from './pages/PredictionStudioPage';
import { ModelIntelligencePage } from './pages/ModelIntelligencePage';
import { DataSciencePage } from './pages/DataSciencePage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { DocumentationPage } from './pages/DocumentationPage';
import { SessionHistoryPage } from './pages/SessionHistoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                {/* Public Discovery Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/realtime-ward" element={<RealTimeWardPage />} />
                <Route path="/realtime" element={<Navigate to="/realtime-ward" replace />} />
                <Route path="/model-intelligence" element={<ModelIntelligencePage />} />
                <Route path="/data-science" element={<DataSciencePage />} />
                <Route path="/architecture" element={<ArchitecturePage />} />
                <Route path="/documentation" element={<DocumentationPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Prediction Studio Workspace */}
                <Route path="/predict" element={<PredictionStudioPage />} />
                <Route
                  path="/predict/length-of-stay"
                  element={<PredictionStudioPage initialTab="length-of-stay" />}
                />
                <Route
                  path="/predict/readmission"
                  element={<PredictionStudioPage initialTab="readmission" />}
                />

                {/* Model Path Aliases */}
                <Route path="/models" element={<Navigate to="/predict" replace />} />
                <Route
                  path="/models/length-of-stay"
                  element={<Navigate to="/predict/length-of-stay" replace />}
                />
                <Route
                  path="/models/readmission"
                  element={<Navigate to="/predict/readmission" replace />}
                />
                <Route path="/dashboard" element={<Navigate to="/predict" replace />} />

                {/* Session Logs & Audit */}
                <Route path="/history" element={<SessionHistoryPage />} />

                {/* Authentication Routes */}
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected Clinician Profile */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <span className="text-5xl font-black text-teal-400 font-mono">404</span>
                      <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                        Clinical Page Not Found
                      </h2>
                      <p className="text-xs text-slate-400 max-w-sm">
                        The requested resource does not exist or has been relocated.
                      </p>
                      <a
                        href="/"
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition"
                      >
                        Return to Homepage
                      </a>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
