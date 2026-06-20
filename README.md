# AI School Study Planner (مخطط الدراسة الذكي للمدارس)

An elite, bilingual (Arabic & English) AI-powered study planner and organization assistant customized specifically for school students. The application dynamically generates optimized daily schedules, tracks homework, manages subjects, and integrates classic focus methods.

مساعد ذكي ومنظم دراسي متكامل مصمم خصيصاً لطلاب المدارس. يدعم التطبيق اللغتين العربية والإنجليزية بمرونة كاملة، ويقوم بإنشاء خطط دراسية مخصصة يومياً باستخدام الذكاء الاصطناعي، تتبع الواجبات المدرسية، واختبارات المواد الدراسية مع تفعيل تقنيات التركيز (بومودورو).

---

## Key Features | الميزات الأساسية

### AI Study Planner | مخطط الدراسة الذكي
- Customized Schedules: Outputs dynamic 30–45 minute focus sessions (ideal for school students) based on daily available after-school hours.
- Goal-Oriented: Shifts focus automatically to accommodate upcoming exams, quizzes, or specific daily study goals.
- جداول مخصصة بالذكاء الاصطناعي: إنشاء خطط يومية مرنة مقسمة لجلسات تركيز تتراوح بين 30-45 دقيقة (مثالية لطلاب المدارس) بناءً على الوقت المتاح بعد المدرسة.

### Homework & Subject Management | إدارة الواجبات والمواد الدراسية
- Active Tracker: Seamlessly create, update, and complete tasks and homework.
- Categorized Subjects: Define specific colors and profiles for school courses.
- تتبع ذكي للواجبات: إضافة، تعديل، وإنجاز المهام والواجبات المدرسية بيسر وسهولة.
- إدارة المواد الدراسية: فرز وتصنيف جدولك بناءً على المواد المفضلة مع تلوين الواجهات ديناميكياً.

### Customized Pomodoro Timer | مؤقت التركيز المخصص
- Built-in interval timer with customized break alerts to maintain cognitive freshness.
- مؤقت بومودورو مدمج يدعم التنبيهات المباشرة لضمان المحافظة على التركيز والإنتاجية أثناء المذاكرة.

### Universal Bilingual Support | دعم ثنائي اللغة بالكامل
- Seamless translation toggling between English and Arabic with automated RTL (Right-to-Left) layout transitions.
- دعم كامل للغتين العربية والإنجليزية مع تعديل تلقائي لتخطيط الصفحة واتجاهات النصوص (RTL).

---

## Screenshots | لقطات الشاشة

### Main Dashboard | لوحة التحكم الرئيسية
<img width="1087" height="599" alt="Screenshot 2026-06-20 171512" src="https://github.com/user-attachments/assets/df30daad-7d8e-4277-9b0a-f89cac2cbb6c" />


### AI Generated Schedule | الجدول الذكي
<img width="1119" height="613" alt="Screenshot 2026-06-20 171629" src="https://github.com/user-attachments/assets/a76690c5-98aa-405c-ba77-d1a3297c7d74" />


### Pomodoro Timer | مؤقت التركيز
<img width="1109" height="490" alt="Screenshot 2026-06-20 174531" src="https://github.com/user-attachments/assets/eddd4b5f-213a-4de0-a8bf-a48ae9f596ac" />



---

## Tech Stack | التقنيات المستخدمة

- Frontend: React 18, TypeScript, Vite
- Animations: Framer Motion (for smooth transitions and hover micro-animations)
- Styling: Tailwind CSS (for responsive and modern fluid interfaces)
- Icons: Lucide React
- Backend & Database: Firebase Authentication & Cloud Firestore (real-time active sync)
- Core AI: @google/genai (Gemini models integration)

---

## Installation & Local Setup | التثبيت والتشغيل المحلي

Follow these steps to get your development environment running locally:

### 1. Clone the repository | استنساخ المستودع
```bash
git clone [https://github.com/YOUR_USERNAME/AI-School-Study-Planner.git](https://github.com/YOUR_USERNAME/AI-School-Study-Planner.git)
cd AI-School-Study-Planner
npm install
VITE_FIREBASE_API_KEY=your_api_key
VITE_GEMINI_API_KEY=your_gemini_key
npm run dev

