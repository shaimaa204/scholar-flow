import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { BookOpen, Plus, Trash2, CheckCircle2, ChevronRight, X, Calendar as CalendarIcon, Tag, AlertCircle, StickyNote, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const TaskPage = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [stickyNotes, setStickyNotes] = useState<any[]>([]);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: 'bg-rose-500' });
  const [newTask, setNewTask] = useState({ title: '', subjectId: '', priority: 'medium', dueDate: '' });
  const [newExam, setNewExam] = useState({ title: '', subjectId: '', date: '', notes: '' });

  const colors = [
    'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 
    'bg-blue-500', 'bg-violet-500', 'bg-teal-500', 'bg-orange-500'
  ];

  useEffect(() => {
    if (!user) return;
    const qSubjects = query(collection(db, 'subjects'), where('userId', '==', user.uid));
    const qTasks = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const qExams = query(collection(db, 'exams'), where('userId', '==', user.uid));
    const qNotes = query(collection(db, 'stickyNotes'), where('userId', '==', user.uid));

    const unsubSubjects = onSnapshot(qSubjects, (snap) => setSubjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubTasks = onSnapshot(qTasks, (snap) => setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubExams = onSnapshot(qExams, (snap) => setExams(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    const unsubNotes = onSnapshot(qNotes, (snap) => setStickyNotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    return () => {
      unsubSubjects();
      unsubTasks();
      unsubExams();
      unsubNotes();
    };
  }, [user]);

  const addStickyNote = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'stickyNotes'), {
        content: '',
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      showToast(language === 'ar' ? "فشل في إضافة الملاحظة" : "Failed to add note", 'error');
    }
  };

  const updateStickyNote = async (id: string, content: string) => {
    await updateDoc(doc(db, 'stickyNotes', id), { content });
  };

  const toggleStickyNote = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, 'stickyNotes', id), { completed: !completed });
  };

  const deleteStickyNote = async (id: string) => {
    await deleteDoc(doc(db, 'stickyNotes', id));
  };

  const addExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newExam.title || !newExam.subjectId || !newExam.date) return;
    try {
      await addDoc(collection(db, 'exams'), {
        ...newExam,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewExam({ title: '', subjectId: '', date: '', notes: '' });
      setIsAddingExam(false);
      showToast(language === 'ar' ? "تمت إضافة الاختبار!" : "Exam added!", 'success');
    } catch (e) {
      showToast(language === 'ar' ? "فشل في إضافة الاختبار" : "Failed to add exam", 'error');
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'exams', id));
      showToast(language === 'ar' ? "تم حذف الاختبار" : "Exam deleted", 'info');
    } catch (e) {
       showToast(language === 'ar' ? "فشل الحذف" : "Delete failed", 'error');
    }
  };

  const addSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSubject.name) return;
    try {
      await addDoc(collection(db, 'subjects'), {
        ...newSubject,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewSubject({ name: '', color: 'bg-indigo-500' });
      setIsAddingSubject(false);
      showToast(language === 'ar' ? "تمت إضافة المادة!" : "Subject added!", 'success');
    } catch (e) {
       showToast(language === 'ar' ? "فشل في إضافة المادة" : "Failed to add subject", 'error');
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.title || !newTask.subjectId) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        userId: user.uid,
        completed: false,
        createdAt: serverTimestamp()
      });
      setNewTask({ title: '', subjectId: '', priority: 'medium', dueDate: '' });
      setIsAddingTask(false);
      showToast(language === 'ar' ? "تمت إضافة المهمة!" : "Task added!", 'success');
    } catch (e) {
       showToast(language === 'ar' ? "فشل في إضافة المهمة" : "Failed to add task", 'error');
    }
  };

  const toggleTask = async (task: any) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
      if (!task.completed) {
        showToast(language === 'ar' ? "رائع! تم إنجاز المهمة ✨" : "Awesome! Task completed ✨", 'success');
      }
    } catch (e) {
       showToast(language === 'ar' ? "فشل التحديث" : "Update failed", 'error');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      showToast(language === 'ar' ? "تم حذف المهمة" : "Task deleted", 'info');
    } catch (e) {
       showToast(language === 'ar' ? "فشل الحذف" : "Delete failed", 'error');
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'subjects', id));
      showToast(language === 'ar' ? "تم حذف المادة" : "Subject deleted", 'info');
    } catch (e) {
       showToast(language === 'ar' ? "فشل الحذف" : "Delete failed", 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('focusToday')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsAddingSubject(true)}
            className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Plus size={18} />
            {t('newSubject')}
          </button>
          <button 
            onClick={() => setIsAddingExam(true)}
            className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <AlertCircle size={18} />
            {t('newExam')}
          </button>
          <button 
            onClick={() => setIsAddingTask(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            {t('newTask')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-1 space-y-8">
          <div>
            <div className="flex items-center justify-between px-1 mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('activeSubjects')}</h2>
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-1 rounded-lg">{subjects.length}</span>
            </div>

            <div className="space-y-4">
              {subjects.map((sub) => (
                <motion.div 
                  key={sub.id}
                  layout
                  className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0", sub.color)}>
                        <BookOpen size={20} />
                      </div>
                      <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight truncate max-w-[150px]">{sub.name}</span>
                    </div>
                    <button 
                      onClick={() => deleteSubject(sub.id)}
                      className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-amber-100/50 dark:bg-amber-900/20 p-8 rounded-[2.5rem] border border-amber-200 dark:border-amber-900/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <StickyNote className="text-amber-600 dark:text-amber-400" size={20} />
                <h3 className="font-bold text-amber-900 dark:text-amber-100">{t('quickNotes')}</h3>
              </div>
              <button 
                onClick={addStickyNote}
                className="w-8 h-8 bg-amber-600 text-white rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md shadow-amber-200 dark:shadow-none"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="space-y-3 relative z-10">
              {stickyNotes.sort((a,b) => b.createdAt?.seconds - a.createdAt?.seconds).map((note) => (
                <div key={note.id} className="flex items-center gap-3 bg-white/60 dark:bg-slate-900/50 p-3 rounded-xl backdrop-blur-sm group">
                  <button 
                    onClick={() => toggleStickyNote(note.id, note.completed)}
                    className={cn(
                      "w-5 h-5 rounded border-2 shrink-0 transition-all flex items-center justify-center",
                      note.completed ? "bg-amber-600 border-amber-600 text-white" : "border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800"
                    )}
                  >
                    {note.completed && <CheckCircle2 size={12} />}
                  </button>
                  <input 
                    type="text" 
                    value={note.content}
                    onChange={(e) => updateStickyNote(note.id, e.target.value)}
                    placeholder="..." 
                    className={cn(
                      "bg-transparent border-none outline-none text-sm w-full font-medium text-amber-900 dark:text-amber-100 placeholder:text-amber-400",
                      note.completed && "line-through opacity-50"
                    )}
                  />
                  <button 
                    onClick={() => deleteStickyNote(note.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-amber-400 hover:text-red-500 transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {stickyNotes.length === 0 && (
                <p className="text-xs text-amber-600/70 dark:text-amber-400/50 text-center py-4 font-medium italic">{t('addNote')}</p>
              )}
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl"></div>
          </div>
        </section>

        <section className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between px-1 mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('upcomingExams')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <motion.div key={exam.id} layout className="bg-indigo-600 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden group">
                   <div className="relative z-10">
                     <div className="flex justify-between items-start">
                       <h4 className="font-bold text-lg truncate max-w-[150px]">{exam.title}</h4>
                       <button onClick={() => deleteExam(exam.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-200">
                          <Trash2 size={16} />
                       </button>
                     </div>
                     <div className="mt-3 flex flex-col gap-1 text-indigo-100 text-xs font-medium uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={12} />
                          {new Date(exam.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : undefined, {day: 'numeric', month: 'long'})}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <BookOpen size={12} />
                          {subjects.find(s => s.id === exam.subjectId)?.name || 'General'}
                        </div>
                     </div>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                      <BookOpen size={64} />
                   </div>
                </motion.div>
              ))}
            </div>
            {exams.length === 0 && (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
                <p className="text-slate-400 text-sm">{t('noExams')}</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between px-1 mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('currentTasks')}</h2>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-lg">
                {tasks.filter(t => !t.completed).length} {t('pending')}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {tasks.length === 0 ? (
                  <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t('noTasks')}</p>
                  </div>
                ) : (
                  tasks.sort((a,b) => a.completed ? 1 : -1).map((task) => (
                    <motion.div 
                      key={task.id}
                      layout
                      className={cn(
                        "p-6 flex items-center gap-6 group transition-all",
                        task.completed ? "opacity-50 grayscale bg-slate-50/50 dark:bg-slate-900/50" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      )}
                    >
                      <button 
                        onClick={() => toggleTask(task)}
                        className={cn(
                          "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                          task.completed 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-slate-200 dark:border-slate-700 hover:border-indigo-500"
                        )}
                      >
                        {task.completed && <CheckCircle2 size={16} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className={cn("font-bold text-slate-800 dark:text-white truncate", task.completed && "line-through")}>
                            {task.title}
                          </h4>
                          <span className={cn(
                            "text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-tighter shrink-0",
                            task.priority === 'high' ? "bg-red-100 text-red-600" :
                            task.priority === 'medium' ? "bg-amber-100 text-amber-600" :
                            "bg-blue-100 text-blue-600"
                          )}>
                            {t(task.priority)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            <BookOpen size={10} />
                            {subjects.find(s => s.id === task.subjectId)?.name || 'General'}
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none shrink-0">
                              <CalendarIcon size={10} />
                              {t('dueBy')} {new Date(task.dueDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : undefined)}
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddingSubject && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md shadow-2xl overflow-hidden relative"
             >
               <button onClick={() => setIsAddingSubject(false)} className={cn("absolute top-6 text-slate-400 hover:text-slate-600 focus:outline-none", language === 'ar' ? 'left-6' : 'right-6')}>
                  <X />
               </button>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('newSubject')}</h3>
               <form onSubmit={addSubject} className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('subject')}</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={newSubject.name}
                      onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                      placeholder="..." 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-inner"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Theme Color</label>
                    <div className="grid grid-cols-4 gap-3">
                      {colors.map(c => (
                        <button 
                          key={c}
                          type="button"
                          onClick={() => setNewSubject({...newSubject, color: c})}
                          className={cn(
                            "w-full h-10 rounded-xl transition-all",
                            c,
                            newSubject.color === c ? "ring-4 ring-indigo-200 dark:ring-indigo-900 scale-110" : "opacity-60 hover:opacity-100"
                          )}
                        />
                      ))}
                    </div>
                 </div>
                 <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold tracking-wide hover:shadow-lg transition-all">
                    Create Subject
                 </button>
               </form>
             </motion.div>
           </div>
        )}

        {isAddingExam && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative"
             >
               <button onClick={() => setIsAddingExam(false)} className={cn("absolute top-6 text-slate-400 hover:text-slate-600 focus:outline-none", language === 'ar' ? 'left-6' : 'right-6')}>
                  <X />
               </button>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('registerExam')}</h3>
               <form onSubmit={addExam} className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('examTitle')}</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={newExam.title}
                      onChange={e => setNewExam({...newExam, title: e.target.value})}
                      placeholder="..." 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('subject')}</label>
                      <select 
                        required
                        value={newExam.subjectId}
                        onChange={e => setNewExam({...newExam, subjectId: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                      >
                        <option value="">...</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('date')}</label>
                      <input 
                        required
                        type="datetime-local" 
                        value={newExam.date}
                        onChange={e => setNewExam({...newExam, date: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      />
                    </div>
                 </div>
                 <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold tracking-wide hover:shadow-lg transition-all">
                    {t('registerExam')}
                 </button>
               </form>
             </motion.div>
           </div>
        )}

        {isAddingTask && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative"
             >
               <button onClick={() => setIsAddingTask(false)} className={cn("absolute top-6 text-slate-400 hover:text-slate-600 focus:outline-none", language === 'ar' ? 'left-6' : 'right-6')}>
                  <X />
               </button>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('newTask')}</h3>
               <form onSubmit={addTask} className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Title</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      placeholder="..." 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('subject')}</label>
                      <select 
                        required
                        value={newTask.subjectId}
                        onChange={e => setNewTask({...newTask, subjectId: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      >
                        <option value="">...</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Priority</label>
                      <select 
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Due Date</label>
                    <input 
                      type="date" 
                      value={newTask.dueDate}
                      onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                 </div>
                 <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold tracking-wide hover:shadow-lg transition-all">
                    Add Task
                 </button>
               </form>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
