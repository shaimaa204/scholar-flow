import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Settings as SettingsIcon, 
  LogOut, 
  Moon, 
  Sun,
  Plus,
  BookOpen,
  Sparkles,
  Bell,
  Search,
  ChevronRight,
  Clock,
  AlertCircle,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { signOut } from 'firebase/auth';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ icon, label, active, onClick, collapsed }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20" 
        : "text-slate-500 hover:bg-indigo-50 dark:hover:bg-slate-800 dark:text-slate-400"
    )}
  >
    <div className={cn("transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")}>
      {icon}
    </div>
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
  </button>
);

export const Layout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { user, userData } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSignOut = () => signOut(auth);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 80 : 260,
          left: language === 'ar' ? 'auto' : 24,
          right: language === 'ar' ? 24 : 'auto'
        }}
        className="fixed top-6 bottom-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 z-50 flex flex-col pt-10 hidden lg:flex"
      >
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm z-50 hover:bg-slate-50 transition-all",
            language === 'ar' && "right-auto -left-3 rotate-180"
          )}
        >
          <ChevronRight size={14} className={cn("transition-transform duration-300", collapsed ? "" : "rotate-180")} />
        </button>

        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-xl text-slate-800 dark:text-white tracking-tight"
            >
              ScholarFlow
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-6">
          <SidebarItem 
            icon={<LayoutDashboard size={24} />} 
            label={t('dashboard')} 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={<Calendar size={24} />} 
            label={t('schedule')} 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={<CheckSquare size={24} />} 
            label={t('tasks')} 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={<Sparkles size={24} />} 
            label={t('inspiration')} 
            active={activeTab === 'inspiration'} 
            onClick={() => setActiveTab('inspiration')}
            collapsed={collapsed}
          />
        </nav>

        <div className="p-4 mt-auto mb-6 border-slate-100 dark:border-slate-800 space-y-2">
          <SidebarItem 
            icon={<Languages size={24} />} 
            label={language === 'en' ? 'العربية' : 'English'} 
            active={false} 
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={darkMode ? <Sun size={24} /> : <Moon size={24} />} 
            label={darkMode ? t('lightMode') : t('darkMode')} 
            onClick={() => setDarkMode(!darkMode)}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={<LogOut size={24} />} 
            label={t('signOut')} 
            onClick={handleSignOut}
            collapsed={collapsed}
          />
        </div>
      </motion.aside>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50 flex items-center justify-around h-16 lg:hidden px-2 pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={cn("p-2 rounded-xl transition-all", activeTab === 'dashboard' ? "text-indigo-600" : "text-slate-400")}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActiveTab('schedule')} className={cn("p-2 rounded-xl transition-all", activeTab === 'schedule' ? "text-indigo-600" : "text-slate-400")}>
          <Calendar size={24} />
        </button>
        <button onClick={() => setActiveTab('tasks')} className={cn("p-2 rounded-xl transition-all", activeTab === 'tasks' ? "text-indigo-600" : "text-slate-400")}>
          <CheckSquare size={24} />
        </button>
        <button onClick={() => setActiveTab('inspiration')} className={cn("p-2 rounded-xl transition-all", activeTab === 'inspiration' ? "text-indigo-600" : "text-slate-400")}>
          <Sparkles size={24} />
        </button>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-400">
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </nav>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen pb-20 lg:pb-0",
          collapsed 
            ? (language === 'ar' ? "lg:mr-32 lg:ml-0" : "lg:ml-32 lg:mr-0") 
            : (language === 'ar' ? "lg:mr-[286px] lg:ml-0" : "lg:ml-[286px] lg:mr-0"),
          "lg:block"
        )}
      >
        <header className="h-20 lg:h-24 z-40 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="lg:hidden w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <BookOpen size={20} />
             </div>
             <div>
                <h1 className="text-xl lg:text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
                   {t(activeTab)}
                </h1>
                <p className="text-slate-500 font-medium text-[10px] lg:text-sm">
                   {t('focusToday')}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full text-indigo-700 dark:text-indigo-400 font-semibold text-xs border border-indigo-100 dark:border-indigo-800">
               <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
               AI Insights Active
            </div>
            
            <button className="p-3 transition-colors hover:bg-white dark:hover:bg-slate-800 rounded-2xl relative text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.displayName}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{t('premium')}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden p-0.5">
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 pb-12">
          {children}
        </div>
      </main>
    </div>
  );
};
