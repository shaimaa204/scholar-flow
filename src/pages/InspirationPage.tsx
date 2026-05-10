import React, { useState, useEffect } from 'react';
import { Sparkles, Quote, Clock, Bell, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { sendNotification } from '../lib/utils';

export const InspirationPage = () => {
  const { t, language } = useLanguage();
  const [interval, setIntervalTime] = useState(() => {
    return parseInt(localStorage.getItem('motivation_interval') || '5');
  });
  const [currentQuote, setCurrentQuote] = useState('');
  const [saved, setSaved] = useState(false);

  const quotes = (t('affirmations') as any) || [];

  useEffect(() => {
    // Set a random initial quote
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      
      // Trigger notification
      sendNotification(language === 'ar' ? "رسالة تحفيزية لك ✨" : "Quick Inspiration ✨", {
        body: randomQuote,
        icon: "/favicon.ico"
      });
    }, interval * 60000);

    return () => clearInterval(timer);
  }, [interval, quotes, language]);

  const saveSettings = () => {
    localStorage.setItem('motivation_interval', interval.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <header className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-6"
        >
          <Sparkles size={40} />
        </motion.div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('inspiration')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
          {language === 'ar' ? 'ابدأ يومك بنظرة إيجابية وطاقة متجددة' : 'Start your day with a positive outlook and renewed energy'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quote Card */}
        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[300px]">
          <Quote className="absolute top-8 left-8 text-indigo-500/10" size={120} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative z-10"
            >
              <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-snug text-center italic">
                "{currentQuote}"
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-8 flex justify-center">
             <button 
                onClick={() => setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
             >
               {language === 'ar' ? 'عبارة أخرى' : 'Another Quote'}
             </button>
          </div>
        </section>

        {/* Settings Card */}
        <section className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <h3 className="text-xl font-bold">{language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}</h3>
            </div>
            
            <p className="text-indigo-100 mb-8 font-medium">
              {language === 'ar' ? 'كل كم تريد أن تظهر لك عبارة إيجابية؟' : 'How often would you like to see a positive quote?'}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[5, 15, 30, 60, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setIntervalTime(mins)}
                  className={`py-3 rounded-2xl font-bold transition-all ${
                    interval === mins 
                    ? "bg-white text-indigo-600 scale-105 shadow-lg" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {mins} <span className="text-[10px] block opacity-70 uppercase">{t('minutes')}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={saveSettings}
            className="mt-10 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            {saved ? <Check size={20} /> : <Clock size={20} />}
            {saved ? t('motivationSaved') : (language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings')}
          </button>
        </section>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] p-8 border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200 dark:shadow-none">
          <Sparkles size={28} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
            {language === 'ar' ? 'لماذا العبارات الإيجابية؟' : 'Why positive affirmations?'}
          </h4>
          <p className="text-emerald-700/80 dark:text-emerald-400/80 text-sm mt-1">
            {language === 'ar' 
              ? 'تساعدك على تقليل التوتر، وزيادة التركيز، والحفاظ على مزاج رائع خلال ساعات الدراسة الطويلة.' 
              : 'They help reduce stress, increase focus, and maintain a great mood during long study hours.'}
          </p>
        </div>
      </div>
    </div>
  );
};
