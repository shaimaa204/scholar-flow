import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Target, Zap, Clock, ChevronRight, Play } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export const LandingPage = () => {
  const handleStart = () => {
    signInWithPopup(auth, googleProvider);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <BookOpen size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white">ScholarFlow</span>
          </div>
          <button 
            onClick={handleStart}
            className="text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Sparkles size={14} />
            AI-Powered Academic Assistant
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6"
          >
            Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Smarter</span>, <br /> Not Harder.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            ScholarFlow uses Gemini AI to organize your subjects, track your progress, and generate the perfect daily study schedule tailored to your deadlines.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={handleStart}
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all group"
            >
              Start Planning Now
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
              <Play size={18} className="fill-current" />
              How it works
            </button>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none opacity-20 dark:opacity-10 blur-3xl">
          <div className="w-64 h-64 bg-indigo-600 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none opacity-20 dark:opacity-10 blur-3xl">
          <div className="w-96 h-96 bg-violet-600 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Target />, title: "Goal Focused", desc: "Prioritize what matters most. ScholarFlow helps you stay on top of your toughest subjects." },
            { icon: <Clock />, title: "Time Optimized", desc: "Our AI considers your available hours to build a balanced session and break routine." },
            { icon: <Zap />, title: "Instant Schedule", desc: "Stop planning and start doing. Generate a daily plan in seconds with one click." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800"
            >
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 font-bold">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <p className="text-5xl font-black text-white mb-2">10k+</p>
                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Students Helped</p>
              </div>
              <div>
                <p className="text-5xl font-black text-white mb-2">250k+</p>
                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Schedules Created</p>
              </div>
              <div>
                <p className="text-5xl font-black text-white mb-2">95%</p>
                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Productivity Increase</p>
              </div>
           </div>
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent)]"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 dark:border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <BookOpen size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">ScholarFlow</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 ScholarFlow AI. Built for the future of learning.</p>
          <div className="flex gap-6">
             <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Twitter</a>
             <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Discord</a>
             <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
