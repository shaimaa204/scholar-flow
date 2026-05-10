import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const PomodoroTimer = () => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');

  const getModeTime = useCallback((m: 'focus' | 'short' | 'long') => {
    switch (m) {
      case 'focus': return 25 * 60;
      case 'short': return 5 * 60;
      case 'long': return 15 * 60;
      default: return 25 * 60;
    }
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      const message = mode === 'focus' 
        ? (language === 'ar' ? "انتهت فترة التركيز! خذ استراحة ☕️" : "Focus time is over! Take a break ☕️")
        : (language === 'ar' ? "انتهت الاستراحة! لنعد للعمل 💪" : "Break is over! Let's get back to work 💪");
      showToast(message, 'success');
      
      // Simple beep sound could be added here if needed, but the toast is good enough
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, language, showToast]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getModeTime(mode));
  };

  const changeMode = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(getModeTime(newMode));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Clock size={160} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Brain className="text-rose-500" />
            {t('pomodoro')}
          </h3>
          <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
             <button 
              onClick={() => changeMode('focus')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                mode === 'focus' ? "bg-white dark:bg-slate-700 text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
             >
               {t('focusTime')}
             </button>
             <button 
              onClick={() => changeMode('short')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                mode === 'short' ? "bg-white dark:bg-slate-700 text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
             >
               {t('shortBreak')}
             </button>
          </div>
        </div>

        <div className="text-center py-4">
          <motion.div 
            key={timeLeft}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            {mode === 'focus' ? 'STAY FOCUSED' : 'REST TIME'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={toggleTimer}
            className="w-16 h-16 rounded-3xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
          >
            {isActive ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
          </button>
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};
