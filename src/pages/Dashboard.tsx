import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { sendNotification } from '../lib/utils';
import { 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  MoreHorizontal,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Plus,
  MessageSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

import { useToast } from '../context/ToastContext';

const StatCard = ({ icon, label, value, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm group hover:shadow-xl transition-all duration-300"
  >
    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl dark:shadow-none transition-transform group-hover:scale-110 shrink-0", color)}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">{label}</p>
      <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mt-1 truncate tracking-tighter">{value}</p>
    </div>
  </motion.div>
);

import { PomodoroTimer } from '../components/PomodoroTimer';
import { addDoc, serverTimestamp } from 'firebase/firestore';

export const Dashboard = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const [quickTask, setQuickTask] = useState('');

  const addQuickTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quickTask.trim() || subjects.length === 0) {
      if (subjects.length === 0) showToast(language === 'ar' ? 'أضف مواد أولاً' : 'Add subjects first', 'info');
      return;
    }
    
    try {
      await addDoc(collection(db, 'tasks'), {
        title: quickTask,
        userId: user.uid,
        subjectId: subjects[0].id, // Default to first subject
        priority: 'medium',
        completed: false,
        createdAt: serverTimestamp()
      });
      setQuickTask('');
      showToast(language === 'ar' ? "تمت إضافة المهمة!" : "Task added!", 'success');
    } catch (error) {
      showToast(language === 'ar' ? "فشل إضافة المهمة" : "Failed to add task", 'error');
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Set daily quote
    const quotes = (t('affirmations') as any) || [];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const qTasks = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const qExams = query(collection(db, 'exams'), where('userId', '==', user.uid), orderBy('date'), limit(3));
    const qSubjects = query(collection(db, 'subjects'), where('userId', '==', user.uid));

    const unsubTasks = onSnapshot(qTasks, (snap) => setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubExams = onSnapshot(qExams, (snap) => setExams(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubSubjects = onSnapshot(qSubjects, (snap) => setSubjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    setLoading(false);
    return () => {
      unsubTasks();
      unsubExams();
      unsubSubjects();
    };
  }, [user]);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { completed: !currentStatus });
      if (!currentStatus) {
        showToast(language === 'ar' ? "رائع! تم إنجاز المهمة ✨" : "Awesome! Task completed ✨", 'success');
        sendNotification(language === 'ar' ? "تم إنجاز المهمة! ✅" : "Task Completed! ✅", {
          body: language === 'ar' ? "عمل ممتاز! استمر في التقدم." : "Great job! Keep up the momentum.",
          icon: "/favicon.ico"
        });
      }
    } catch (e) {
      showToast(language === 'ar' ? "فشل التحديث" : "Update failed", 'error');
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mock data for the chart
  const chartData = [
    { name: language === 'en' ? 'Mon' : 'الاثنين', hours: 4 },
    { name: language === 'en' ? 'Tue' : 'الثلاثاء', hours: 6 },
    { name: language === 'en' ? 'Wed' : 'الأربعاء', hours: 3 },
    { name: language === 'en' ? 'Thu' : 'الخميس', hours: 8 },
    { name: language === 'en' ? 'Fri' : 'الجمعة', hours: 5 },
    { name: language === 'en' ? 'Sat' : 'السبت', hours: 7 },
    { name: language === 'en' ? 'Sun' : 'الأحد', hours: 4 },
  ];

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0];

  const aiTips = [
    { en: "Try the Pomodoro technique for 25 minutes of focused work.", ar: "جرب تقنية البومودورو لمدة 25 دقيقة من العمل المركز." },
    { en: "Active recall is 3x more effective than re-reading notes.", ar: "الاسترجاع النشط أكثر فعالية بـ 3 مرات من إعادة قراءة الملاحظات." },
    { en: "Take a 5-minute walk after 1 hour of studying to boost memory.", ar: "امشِ لمدة 5 دقائق بعد ساعة من الدراسة لتعزيز الذاكرة." },
    { en: "Explain what you learned to someone else to master the topic.", ar: "اشرح ما تعلمته لشخص آخر لتتقن الموضوع." },
    { en: "Keep your phone in another room to avoid distractions.", ar: "ضع هاتفك في غرفة أخرى لتجنب التشتت." },
    { en: "Hydration is key! Drink water every 30 minutes.", ar: "الترطيب هو المفتاح! اشرب الماء كل 30 دقيقة." }
  ];

  const dailyTip = aiTips[new Date().getDate() % aiTips.length];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('welcome')}, {firstName}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {language === 'ar' ? `هناك ${tasks.filter(t => !t.completed).length} مهام معلقة تقترب مواعيدها.` : `${t('pendingTasks')} ${tasks.filter(t => !t.completed).length} ${t('deadlines')} ${t('approaching')}.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
            <Zap className="text-indigo-600 animate-pulse" size={18} />
            <div className="text-xs">
              <p className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-tighter">{t('aiTip')}</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">{dailyTip[language]}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm hover:shadow-md transition-all">
            <CalendarIcon size={18} />
            {t('mySchedule')}
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none">
            <Plus size={18} />
            {t('newTask')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Zap size={28} />} 
          label={t('streak')} 
          value={language === 'en' ? "12 Days" : "١٢ يوم"} 
          color="bg-amber-500"
          delay={0}
        />
        <StatCard 
          icon={<Target size={28} />} 
          label={t('goal')} 
          value={`${completionRate}%`} 
          color="bg-emerald-500"
          delay={0.1}
        />
        <StatCard 
          icon={<Clock size={28} />} 
          label={t('focus')} 
          value={language === 'en' ? "32.5h" : "٣٢.٥ س"} 
          color="bg-blue-500"
          delay={0.2}
        />
        <StatCard 
          icon={<TrendingUp size={28} />} 
          label={t('status')} 
          value={t('statusValue') || "Perfect"} 
          color="bg-indigo-500"
          delay={0.3}
        />
      </div>

      {/* Daily Motivation Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <MessageSquare size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
              {language === 'ar' ? 'إلهام اليوم' : 'Daily Inspiration'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight max-w-2xl">
            "{quote}"
          </h2>
          <button 
            onClick={() => setActiveTab('inspiration')}
            className="mt-6 flex items-center gap-2 text-sm font-bold bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all shadow-lg"
          >
            {language === 'ar' ? 'عرض ميزات التحفيز' : 'Explore Motivation'}
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Study Activity Chart */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('studyActivity')}</h3>
              <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-semibold p-2 outline-none dark:text-slate-300">
                <option>{language === 'en' ? 'Last 7 Days' : 'آخر ٧ أيام'}</option>
                <option>{language === 'en' ? 'Last Month' : 'الشهر الماضي'}</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec1d4c" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ec1d4c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    orientation={language === 'ar' ? 'right' : 'left'}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#ec1d4c" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Subjects Grid */}
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('activeSubjects')}</h3>
              <button 
                onClick={() => setActiveTab('tasks')}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline">{t('manageAll')}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.length === 0 ? (
                <div className="col-span-full py-10 text-center bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <BookOpen className="mx-auto text-slate-400 mb-2" size={32} />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{t('noSubjects') || 'No subjects added yet'}</p>
                </div>
              ) : (
                subjects.map((sub, i) => (
                  <motion.div 
                    key={sub.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActiveTab('tasks')}
                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0", sub.color || "bg-indigo-500")}>
                        <BookOpen size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-white truncate">{sub.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">
                          {tasks.filter(t => t.subjectId === sub.id && !t.completed).length} {t('deadlines')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={cn("text-slate-300 group-hover:text-slate-600 transition-colors shrink-0", language === 'ar' && "rotate-180")} size={20} />
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <PomodoroTimer />

          {/* Upcoming Exams */}
          <section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-bold mb-6">{t('upcomingExams')}</h3>
            <div className="space-y-4">
              {exams.length === 0 ? (
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <AlertTriangle size={20} className="shrink-0" />
                  <span className="text-sm font-medium">{t('noExams')}</span>
                </div>
              ) : (
                exams.map((exam, i) => (
                  <div key={exam.id} className="bg-white/15 p-4 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold truncate pr-2">{exam.title}</h4>
                      <div className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{new Date(exam.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : undefined, {month: 'short', day: 'numeric'})}</div>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <Clock size={12} />
                      <span>{new Date(exam.date).toLocaleTimeString(language === 'ar' ? 'ar-EG' : [], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button 
              onClick={() => setActiveTab('tasks')}
              className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors">
              {t('addNewExam')}
            </button>
          </section>

          {/* Daily Checklist */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('currentTasks')}</h3>
              <MoreHorizontal className="text-slate-400 cursor-pointer" size={20} />
            </div>

            <form onSubmit={addQuickTask} className="mb-6 group">
              <div className="relative">
                <input 
                  type="text"
                  value={quickTask}
                  onChange={(e) => setQuickTask(e.target.value)}
                  placeholder={language === 'ar' ? 'أضف مهمة سريعة...' : 'Quick add task...'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center opacity-0 group-focus-within:opacity-100 transition-opacity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {tasks.filter(t => !t.completed).slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-4 py-2 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors truncate">{task.title}</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1 font-bold tracking-wider truncate">
                      {subjects.find(s => s.id === task.subjectId)?.name || 'General'}
                    </p>
                  </div>
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className="w-8 h-8 border-2 border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer shrink-0">
                    <CheckCircle2 size={16} className="text-slate-100 dark:text-slate-800 group-hover:text-indigo-500 transition-all" />
                  </button>
                </div>
              ))}
              {tasks.filter(t => !t.completed).length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={32} />
                  <p className="text-sm text-slate-500">{language === 'ar' ? 'تم إنجاز جميع المهام! ✨' : 'All tasks completed! ✨'}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
