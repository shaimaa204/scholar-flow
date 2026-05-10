import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { generateStudySchedule, SchedulePlan } from '../services/geminiService';
import { sendNotification } from '../lib/utils';
import { 
  Sparkles, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  BookOpen, 
  BrainCircuit,
  Settings,
  ChevronRight,
  RefreshCw,
  Loader2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SchedulePage = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableHours, setAvailableHours] = useState(6);
  const [dailyGoal, setDailyGoal] = useState('');

  useEffect(() => {
    if (!user) return;

    const qPlans = query(collection(db, 'schedules'), where('userId', '==', user.uid));
    const qSubjects = query(collection(db, 'subjects'), where('userId', '==', user.uid));
    const qTasks = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const qExams = query(collection(db, 'exams'), where('userId', '==', user.uid));

    const unsubPlans = onSnapshot(qPlans, (snap) => setPlans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubSubjects = onSnapshot(qSubjects, (snap) => setSubjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubTasks = onSnapshot(qTasks, (snap) => setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubExams = onSnapshot(qExams, (snap) => setExams(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    return () => {
      unsubPlans();
      unsubSubjects();
      unsubTasks();
      unsubExams();
    };
  }, [user]);

  const handleGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const plan = await generateStudySchedule({
        availableHours,
        dailyGoal,
        subjects: subjects.map(s => s.name),
        tasks: tasks.filter(t => !t.completed).map(t => t.title),
        exams: exams.map(e => `${e.title} on ${new Date(e.date).toLocaleDateString()}`)
      });

      if (plan && plan.length > 0) {
        await addDoc(collection(db, 'schedules'), {
          userId: user.uid,
          date: new Date().toISOString().split('T')[0],
          plan,
          createdAt: serverTimestamp()
        });
        showToast(language === 'ar' ? "تم إنشاء جدولك الذكي! 📚" : "Study Plan Ready! 📚", 'success');
        sendNotification(language === 'ar' ? "خطة الدراسة جاهزة! 📚" : "Study Plan Ready! 📚", {
          body: language === 'ar' ? "تم إنشاء جدول دراستك المدعوم بالذكاء الاصطناعي بنجاح." : "Your AI-powered study schedule has been generated successfully.",
          icon: "/favicon.ico"
        });
      }
    } catch (error) {
      console.error(error);
      showToast(language === 'ar' ? "فشل إنشاء الجدول" : "Failed to generate schedule", 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
      showToast(language === 'ar' ? "تم حذف الجدول" : "Schedule deleted", 'info');
    } catch (e) {
      showToast(language === 'ar' ? "فشل الحذف" : "Delete failed", 'error');
    }
  };

  const currentPlan = plans.sort((a,b) => b.createdAt?.seconds - a.createdAt?.seconds)[0];

  const updateActivity = async (planId: string, index: number, newActivity: string) => {
    const planDoc = plans.find(p => p.id === planId);
    if (!planDoc) return;
    
    const updatedPlan = [...planDoc.plan];
    updatedPlan[index] = { ...updatedPlan[index], activity: newActivity };
    
    try {
      await updateDoc(doc(db, 'schedules', planId), {
        plan: updatedPlan
      });
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  const updateTime = async (planId: string, index: number, field: 'startTime' | 'endTime', newValue: string) => {
    const planDoc = plans.find(p => p.id === planId);
    if (!planDoc) return;
    
    const updatedPlan = [...planDoc.plan];
    updatedPlan[index] = { ...updatedPlan[index], [field]: newValue };
    
    try {
      await updateDoc(doc(db, 'schedules', planId), {
        plan: updatedPlan
      });
    } catch (error) {
      console.error("Failed to update time:", error);
    }
  };

  const renderInsights = () => {
    if (!currentPlan) return null;
    
    const studyMins = currentPlan.plan.filter((it: any) => it.type === 'study').length * 50;
    const breakMins = currentPlan.plan.filter((it: any) => it.type === 'break').length * 10;
    const studyHours = (studyMins / 60).toFixed(1);
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{language === 'ar' ? 'إجمالي الدراسة' : 'Total Study'}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{studyHours}</span>
            <span className="text-xs font-bold text-indigo-500">{t('hoursAbbr')}</span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'ar' ? 'إجمالي الاستراحة' : 'Total Breaks'}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{breakMins}</span>
            <span className="text-xs font-bold text-slate-500">{t('minutes')}</span>
          </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/50">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{language === 'ar' ? 'تحليل التركيز' : 'Focus Score'}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">92%</span>
            <span className="text-xs font-bold text-emerald-500">{language === 'ar' ? 'ممتاز' : 'Great'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Sparkles className="text-indigo-600" />
            {t('aiPlanner')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('focusToday')}</p>
          
          <div className="mt-4 max-w-xl group relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute -top-2 left-4 px-2 bg-slate-50 dark:bg-slate-950 z-10">
              {t('dailyGoalLabel')}
            </label>
            <textarea 
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              placeholder={t('dailyGoalPlaceholder')}
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 pt-5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-700 dark:text-slate-200 transition-all resize-none shadow-sm"
              rows={2}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 self-start md:self-center shrink-0">
          <div className="px-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{t('availableHours')}</p>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setAvailableHours(Math.max(1, availableHours - 1))}
                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              >
                -
              </button>
              <span className="text-lg font-bold w-6 text-center tabular-nums dark:text-white">{availableHours}</span>
              <button 
                onClick={() => setAvailableHours(Math.min(16, availableHours + 1))}
                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>
          <button 
            disabled={isGenerating || subjects.length === 0}
            onClick={handleGenerate}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 whitespace-nowrap"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <BrainCircuit size={18} />}
            {currentPlan ? t('reGenerate') : t('generatePlan')}
          </button>
        </div>
      </header>

      {subjects.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 rounded-3xl flex items-center gap-4 text-amber-800 dark:text-amber-300">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800/50 rounded-2xl flex items-center justify-center">
            <AlertCircle className="text-amber-600" />
          </div>
          <div>
            <p className="font-bold">{language === 'ar' ? 'مواد مفقودة' : 'Missing Subjects'}</p>
            <p className="text-sm opacity-90">{language === 'ar' ? 'يرجى إضافة موادك في علامة تبويب المهام قبل إنشاء الجدول.' : 'Please add your subjects in the Tasks tab before generating a schedule.'}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Column */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!currentPlan ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[500px] bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-10 text-center"
              >
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
                  <Clock size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{language === 'ar' ? 'لا يوجد خطة دراسة نشطة' : 'No active study plan'}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">{language === 'ar' ? 'هل أنت مستعد لتكون منتجاً؟ اضبط ساعاتك المتاحة واترك الذكاء الاصطناعي ينشئ خطة متوازنة لك.' : 'Ready to be productive? Set your available hours and let AI create a balanced plan for you.'}</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {renderInsights()}
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-2 shadow-sm">
                  <div className="p-8 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{language === 'ar' ? 'جدول اليوم' : "Today's Schedule"}</h2>
                      <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">{new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : undefined, {weekday: 'long', month: 'long', day: 'numeric'})}</p>
                    </div>
                    <button 
                      onClick={() => deletePlan(currentPlan.id)}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {currentPlan.plan.map((item: SchedulePlan, i: number) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          "p-5 rounded-2xl border flex items-center gap-6 group transition-all hover:shadow-md",
                          item.type === 'study' ? "bg-white dark:bg-slate-900 border-indigo-100 dark:border-slate-800" :
                          item.type === 'break' ? "bg-slate-50 dark:bg-slate-800/50 border-transparent" :
                          "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30"
                        )}
                      >
                        <div className="w-20 text-center">
                          <input 
                            value={item.startTime}
                            onChange={(e) => updateTime(currentPlan.id, i, 'startTime', e.target.value)}
                            className="text-lg font-bold text-slate-900 dark:text-white leading-none bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-500/30 rounded p-0 text-center w-full hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-text"
                          />
                          <input 
                            value={item.endTime}
                            onChange={(e) => updateTime(currentPlan.id, i, 'endTime', e.target.value)}
                            className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-500/30 rounded p-0 text-center w-full hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-text"
                          />
                        </div>

                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: item.type === 'break' ? '#94a3b8' : item.type === 'exam' ? '#ef4444' : '#4f46e5', color: 'white'}}>
                          {item.type === 'study' ? <BookOpen size={18} /> : item.type === 'break' ? <RefreshCw size={18} /> : <Zap size={18} />}
                        </div>

                        <div className="flex-1">
                          <input 
                            value={item.activity}
                            onChange={(e) => updateActivity(currentPlan.id, i, e.target.value)}
                            className="w-full font-bold text-slate-800 dark:text-white underline decoration-rose-500/30 decoration-2 underline-offset-4 bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-500/30 rounded p-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-text"
                          />
                          <p className={cn("text-[9px] font-black uppercase tracking-wider mt-1.5", 
                            item.type === 'study' ? "text-indigo-600 dark:text-indigo-400" : 
                            item.type === 'break' ? "text-slate-500" : "text-red-600"
                          )}>
                            {t(item.type + 'Session')}
                          </p>
                        </div>

                        <div className={cn("opacity-0 group-hover:opacity-100 transition-opacity", language === 'ar' ? 'mr-auto' : 'ml-auto')}>
                          <CheckCircle2 className="text-slate-200 dark:text-slate-800" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips / Context Column */}
        <div className="space-y-6">
          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100/50 dark:shadow-none overflow-hidden relative">
             <div className="relative z-10">
               <BrainCircuit className="mb-4 opacity-80" size={32} />
               <h3 className="text-xl font-bold mb-3">{language === 'ar' ? 'اقتراحات الذكاء الاصطناعي' : 'AI Suggestions'}</h3>
               <ul className="space-y-4">
                 {[
                   language === 'ar' ? "ابدأ بأصعب المواد أولاً بينما يكون عقلك نشطاً." : "Tackle your hardest subject first while your brain is fresh.",
                   language === 'ar' ? "لا تتخطى استراحات الـ 10 دقائق للحفاظ على التركيز طويل الأمد." : "Don't skip the 10-minute breaks to maintain long-term focus.",
                   language === 'ar' ? "ابقَ رطباً وجهز وجبات خفيفة للجلسات المكثفة." : "Stay hydrated and have snacks ready for intense sessions."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed">
                     <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">•</span>
                     {tip}
                   </li>
                 ))}
               </ul>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t('statistics')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{language === 'ar' ? 'إجمالي وقت الدراسة' : 'Total Study Time'}</span>
                <span className="font-bold dark:text-white tabular-nums">12h 45m</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{language === 'ar' ? 'مجموعات البومودورو اليوم' : 'Pomodoros Today'}</span>
                <span className="font-bold dark:text-white tabular-nums">8 {language === 'ar' ? 'مجموعات' : 'Sets'}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
