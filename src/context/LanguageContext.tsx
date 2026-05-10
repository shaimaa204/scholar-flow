import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string | string[];
    ar: string | string[];
  };
}

export const translations: Translations = {
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  schedule: { en: 'Study Plan', ar: 'خطة الدراسة' },
  tasks: { en: 'Tasks', ar: 'المهام' },
  inspiration: { en: 'Inspiration', ar: 'التحفيز' },
  welcome: { en: 'Good luck', ar: 'بالتوفيق' },
  interval: { en: 'Interval', ar: 'الفترة' },
  minutes: { en: 'Minutes', ar: 'دقائق' },
  motivationSaved: { en: 'Motivation settings saved!', ar: 'تم حفظ إعدادات التحفيز!' },
  positiveQuote: { en: 'Positive Quote', ar: 'عبارة إيجابية' },
  every: { en: 'Every', ar: 'كل' },
  affirmations: {
    en: [
      "You're doing great, keep going!",
      "Believe in yourself and all that you are.",
      "Small progress is still progress.",
      "You are stronger than you think.",
      "Every step brings you closer to your goal.",
      "Don't stop until you're proud.",
      "Focus on the step in front of you, not the whole staircase.",
      "Success is the sum of small efforts repeated daily.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The only way to do great work is to love what you do.",
      "Your hard work will pay off sooner than you think.",
      "You have the power to create the life you want.",
      "Make today so awesome that yesterday gets jealous.",
      "Every morning is a new chance to be better than yesterday.",
      "The secret of getting ahead is getting started.",
      "Work hard in silence, let your success be your noise.",
      "Believe you can and you're halfway there."
    ],
    ar: [
      "أنت تبلي بلاءً حسناً، واصل التقدم!",
      "آمن بنفسك وبكل ما أنت عليه.",
      "التقدم البسيط لا يزال تقدماً.",
      "أنت أقوى مما تعتقد.",
      "كل خطوة تقربك أكثر من هدفك.",
      "لا تتوقف حتى تصبح فخوراً بنفسك.",
      "ركز على الخطوة التي أمامك، وليس على كل السلم.",
      "النجاح هو مجموع الجهود الصغيرة المتكررة يومياً.",
      "النجاح ليس نهائياً، والفشل ليس قاتلاً: الشجاعة للاستمرار هي ما يهم.",
      "الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.",
      "عملك الشاق سيؤتي ثماره في وقت أقرب مما تعتقد.",
      "لديك القوة لصنع الحياة التي تريدها.",
      "اجعل اليوم رائعاً لدرجة أن الأمس يشعر بالغيرة.",
      "كل صباح هو فرصة جديدة لتكون أفضل من الأمس.",
      "سر المضي قدماً هو البدء.",
      "اعمل بجد في صمت، ودع نجاحك يكون ضجيجك.",
      "آمن أنك تستطيع، وستكون قد قطعت نصف الطريق."
    ]
  },
  deadlines: { en: 'deadlines', ar: 'مواعيد نهائية' },
  approaching: { en: 'approaching this week', ar: 'تقترب هذا الأسبوع' },
  streak: { en: 'Streak', ar: 'الاستمرارية' },
  goal: { en: 'Goal', ar: 'الهدف' },
  focus: { en: 'Focus', ar: 'التركيز' },
  status: { en: 'Status', ar: 'الحالة' },
  mySchedule: { en: 'My Schedule', ar: 'جدولي' },
  quickTask: { en: 'Quick Task', ar: 'مهمة سريعة' },
  activeSubjects: { en: 'Active Subjects', ar: 'المواد النشطة' },
  manageAll: { en: 'Manage All', ar: 'إدارة الكل' },
  upcomingExams: { en: 'Upcoming Exams', ar: 'الاختبارات القادمة' },
  addNewExam: { en: 'Add New Exam', ar: 'إضافة اختبار جديد' },
  pendingTasks: { en: 'Pending Tasks', ar: 'المهام المعلقة' },
  focusToday: { en: 'Focus on your goals today.', ar: 'ركز على أهدافك اليوم.' },
  premium: { en: 'Premium', ar: 'مميز' },
  signOut: { en: 'Sign Out', ar: 'تسجيل الخروج' },
  lightMode: { en: 'Light Mode', ar: 'الوضع الفاتح' },
  darkMode: { en: 'Dark Mode', ar: 'الوضع الداكن' },
  newSubject: { en: 'New Subject', ar: 'مادة جديدة' },
  newExam: { en: 'New Exam', ar: 'اختبار جديد' },
  newTask: { en: 'New Task', ar: 'مهمة جديدة' },
  registerExam: { en: 'Register Exam', ar: 'تسجيل الاختبار' },
  examTitle: { en: 'Exam Title', ar: 'عنوان الاختبار' },
  subject: { en: 'Subject', ar: 'المادة' },
  date: { en: 'Date & Time', ar: 'التاريخ والوقت' },
  language: { en: 'Language', ar: 'اللغة' },
  english: { en: 'English', ar: 'الإنجليزية' },
  arabic: { en: 'العربية', ar: 'العربية' },
  studyActivity: { en: 'Study Activity', ar: 'نشاط الدراسة' },
  statusValue: { en: 'Perfect', ar: 'ممتاز' },
  statistics: { en: 'Statistics', ar: 'الإحصائيات' },
  totalStudyTime: { en: 'Total Study Time', ar: 'إجمالي وقت الدراسة' },
  pomodorosToday: { en: 'Pomodoros Today', ar: 'جلسات البومودورو' },
  quickNotes: { en: 'Quick Notes', ar: 'ملاحظات سريعة' },
  addNote: { en: 'Add a quick note or task here!', ar: 'أضف ملاحظة أو مهمة سريعة هنا!' },
  studySession: { en: 'study session', ar: 'جلسة دراسة' },
  breakSession: { en: 'break', ar: 'استراحة' },
  examSession: { en: 'exam', ar: 'اختبار' },
  aiPlanner: { en: 'School AI Planner', ar: 'مخطط الطالب الذكي' },
  availableHours: { en: 'Available Hours (After School)', ar: 'ساعات الدراسة (بعد المدرسة)' },
  reGenerate: { en: 'Re-generate', ar: 'إعادة توليد' },
  generatePlan: { en: 'Generate Plan', ar: 'إنشاء الخطة' },
  pomodoro: { en: 'Pomodoro', ar: 'بومودورو' },
  start: { en: 'Start', ar: 'ابدأ' },
  pause: { en: 'Pause', ar: 'إيقاف' },
  reset: { en: 'Reset', ar: 'إعادة' },
  focusTime: { en: 'Focus Time', ar: 'وقت التركيز' },
  shortBreak: { en: 'Short Break', ar: 'استراحة قصيرة' },
  longBreak: { en: 'Long Break', ar: 'استراحة طويلة' },
  tasksList: { en: 'Homework List', ar: 'قائمة الواجبات' },
  currentTasks: { en: 'Homework & Tasks', ar: 'الواجبات والمهام' },
  pending: { en: 'pending', ar: 'معلق' },
  dueBy: { en: 'Due by', ar: 'بحلول' },
  noTasks: { en: 'No homework found', ar: 'لا توجد واجبات' },
  noExams: { en: 'No exams scheduled', ar: 'لا يوجد اختبارات مجدولة' },
  addSubjectStart: { en: 'Add subjects to get started', ar: 'أضف مواد للبدء' },
  allTasks: { en: 'All Homework', ar: 'كل الواجبات' },
  high: { en: 'High', ar: 'عالي' },
  medium: { en: 'Medium', ar: 'متوسط' },
  low: { en: 'Low', ar: 'منخفض' },
  register: { en: 'Register', ar: 'تسجيل' },
  create: { en: 'Create', ar: 'إنشاء' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  analyticsComingSoon: { en: 'Detailed Analytics Coming Soon', ar: 'التحليلات التفصيلية قادمة قريباً' },
  analyticsDesc: { en: "We're refining your study insights with advanced metrics.", ar: 'نحن نعمل على تحسين رؤى دراستك بمقاييس متقدمة.' },
  aiTip: { en: 'AI School Tip', ar: 'نصيحة دراسية ذكية' },
  nextExam: { en: 'Next Exam', ar: 'الاخبار القادم' },
  dailyGoalLabel: { en: "My Goal for Today", ar: 'هدفي لهذا اليوم' },
  dailyGoalPlaceholder: { en: 'e.g. Finish my science project...', ar: 'مثلاً: إنهاء مشروع العلوم...' },
  hoursAbbr: { en: 'hrs', ar: 'ساعة' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
