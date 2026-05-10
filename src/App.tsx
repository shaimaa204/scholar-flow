/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { SchedulePage } from './pages/SchedulePage';
import { TaskPage } from './pages/TaskPage';
import { InspirationPage } from './pages/InspirationPage';
import { useState, useEffect } from 'react';
import { requestNotificationPermission } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './context/LanguageContext';

function AppContent() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user) {
      requestNotificationPermission();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {(() => {
            switch (activeTab) {
              case 'dashboard':
                return <Dashboard setActiveTab={setActiveTab} />;
              case 'schedule':
                return <SchedulePage />;
              case 'tasks':
                return <TaskPage />;
              case 'inspiration':
                return <InspirationPage />;
              default:
                return <Dashboard setActiveTab={setActiveTab} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
