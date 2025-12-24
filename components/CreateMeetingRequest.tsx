
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  User, Mail, Globe, Linkedin, Code, 
  CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Loader2, Phone, MailWarning, RefreshCw, Hash, X, FileText, Shield, Clock, CreditCard, AlertTriangle, Briefcase, Wallet, Sparkles
} from 'lucide-react';
import Button from './Button';
import { RegistrationFormData } from '../types';
import { FIELD_OPTIONS } from '../teamData';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged, sendEmailVerification } = FirebaseAuth as any;
import { sendAdminNotification } from '../lib/notifications';

const { useNavigate, Link } = ReactRouterDOM as any;

const ADMIN_CONTACT_EMAIL = "m.attia@outlook.sa";

const CreateMeetingRequest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isUnverified, setIsUnverified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isResending, setIsResending] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    country: '',
    whatsapp: '',
    linkedin: '',
    field: '',
    techStack: '', 
    experience: 0,
    level: 'fresh',
    goals: [],
    hasInterviewExperience: 'no',
    upcomingInterview: 'no',
    preferredTime: '',
    expectations: '',
    planName: 'باقة مميزة', 
    termsAccepted: false
  });

  const checkUserStatus = async (user: any) => {
    if (user) {
      if (!user.emailVerified) {
        setIsUnverified(true);
      } else {
        setIsUnverified(false);
        setCurrentUser(user);
        if (user.email && !formData.email) {
          setFormData(prev => ({ ...prev, email: user.email! }));
        }
        if (user.displayName && !formData.fullName) {
            setFormData(prev => ({ ...prev, fullName: user.displayName! }));
        }
      }
    } else {
      navigate('/login');
    }
    setCheckingAuth(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      checkUserStatus(user);
    });
    return () => unsubscribe();
  }, [navigate]);

  const refreshStatus = async () => {
    setCheckingAuth(true);
    if (auth.currentUser) {
      await (auth.currentUser as any).reload();
      checkUserStatus(auth.currentUser);
    }
  };

  const resendEmail = async () => {
    if (auth.currentUser && !isResending) {
      setIsResending(true);
      try {
        await sendEmailVerification(auth.currentUser);
        alert("تم إرسال رابط التفعيل مجدداً إلى بريدك.");
      } catch (e) {
        alert("فشل الإرسال. يرجى المحاولة لاحقاً.");
      } finally {
        setIsResending(false);
      }
    }
  };

  const updateField = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = formData.goals;
    if (currentGoals.includes(goal)) {
      updateField('goals', currentGoals.filter(g => g !== goal));
    } else {
      updateField('goals', [...currentGoals, goal]);
    }
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isWhatsappValid = (phone: string) => /^\+?[0-9]{8,15}$/.test(phone);
  const isLinkedinValid = (url: string) => url.includes('linkedin.com/');

  const isStep1Valid = () => {
    return formData.fullName.trim().length > 3 && 
           isEmailValid(formData.email) &&
           formData.country.trim().length > 2 &&
           isWhatsappValid(formData.whatsapp) &&
           isLinkedinValid(formData.linkedin);
  };

  const isStep2Valid = () => {
    return formData.field !== '' && 
           formData.techStack.trim().length > 0 && 
           !isNaN(formData.experience) && formData.experience >= 0;
  };

  const isStep3Valid = () => {
    return formData.goals.length > 0 && 
           formData.preferredTime !== '' &&
           formData.expectations.trim().length >= 10 &&
           formData.planName !== '' &&
           formData.termsAccepted === true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (isStep1Valid()) {
        setStep(2);
        setError(null);
      } else {
        setError("يرجى التأكد من إكمال جميع البيانات الشخصية بشكل صحيح (الاسم، البريد، واتساب، ورابط LinkedIn).");
      }
    } else if (step === 2) {
      if (isStep2Valid()) {
        setStep(3);
        setError(null);
      } else {
        setError("يرجى اختيار المجال وكتابة التقنيات التي تتقنها وتحديد سنوات الخبرة.");
      }
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!isStep3Valid()) {
      setError("يرجى استكمال جميع البيانات المطلوبة في الخطوة الأخيرة.");
      return;
    }

    if (!currentUser) {
        setError("يجب تسجيل الدخول لإتمام الطلب.");
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const reqNum = `MQ-${Math.floor(100000 + Math.random() * 900000)}`;
      
      await addDoc(collection(db, "registrations"), {
        ...formData,
        userId: currentUser.uid, 
        submittedAt: serverTimestamp(),
        status: 'pending',
        requestNumber: reqNum
      });
      
      await sendAdminNotification({
        to_email: ADMIN_CONTACT_EMAIL,
        from_name: formData.fullName,
        user_email: formData.email,
        user_phone: formData.whatsapp,
        field: formData.field,
        level: formData.level,
        tech_stack: formData.techStack,
        expectations: formData.expectations
      });

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Error submitting form: ", err);
      setError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (isUnverified) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
           <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
             <MailWarning className="w-10 h-10" />
           </div>
           <h2 className="text-2xl font-black text-primary mb-4">تفعيل الحساب مطلوب</h2>
           <p className="text-gray-600 mb-8 leading-relaxed">
             عذراً، يجب عليك تفعيل بريدك الإلكتروني لتتمكن من حجز مقابلة. يرجى مراجعة صندوق الوارد الخاص بك.
           </p>
           
           <div className="space-y-4">
             <Button onClick={refreshStatus} className="w-full flex items-center justify-center gap-2 py-4">
               <RefreshCw className="w-5 h-5" /> تحديث حالة التفعيل
             </Button>
             <button 
              onClick={resendEmail} 
              disabled={isResending}
              className="text-sm font-bold text-gray-500 hover:text-accent transition-colors underline"
             >
               {isResending ? 'جاري الإرسال...' : 'إرسال رابط التفعيل مرة أخرى'}
             </button>
           </div>
        </div>
      </div>
    );
  }

  const inputClasses = "block w-full border rounded-lg focus:ring-accent focus:border-accent border-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 text-right">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">سجل اهتمامك الآن</h2>
          <p className="mt-2 text-lg text-gray-600">خطوة واحدة تفصلك عن تطوير مسارك المهني.</p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded"></div>
          <div className="absolute top-1/2 right-0 h-1 bg-accent -z-10 rounded transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          <div className="flex justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex flex-col items-center bg-gray-50 px-2 ${step >= s ? 'text-accent' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${step >= s ? 'border-accent bg-accent text-white' : 'border-gray-300 bg-white'}`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className="text-xs font-bold mt-1">{s === 1 ? 'تعارف' : s === 2 ? 'الخبرة' : 'الأهداف'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100 text-right">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-right">
              <div className="text-center mb-6"><h3 className="text-xl font-bold text-primary">لنبدأ بالتعارف 👋</h3><p className="text-sm text-gray-500">بياناتك تساعدنا في التواصل معك وتخصيص تجربتك.</p></div>
              <div className="grid grid-cols-1 gap-6">
                <div className="text-right">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الاسم الكامل <span className="text-red-500">*</span></label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className={`${inputClasses} pr-10 py-3 text-right`} placeholder="مثال: أحمد محمد" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-right">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">البريد الإلكتروني <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                      <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={`${inputClasses} pr-10 py-3 dir-ltr text-right`} placeholder="email@example.com" />
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الواتساب <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                      <input type="tel" value={formData.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} className={`${inputClasses} pr-10 py-3 dir-ltr text-right`} placeholder="+1234567890" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-right">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الدولة / المدينة <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Globe className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" value={formData.country} onChange={(e) => updateField('country', e.target.value)} className={`${inputClasses} pr-10 py-3 text-right`} placeholder="اسم الدولة" />
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رابط LinkedIn <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Linkedin className="h-5 w-5 text-gray-400" /></div>
                      <input 
                        type="text" 
                        value={formData.linkedin} 
                        onChange={(e) => updateField('linkedin', e.target.value)} 
                        className={`${inputClasses} pr-10 py-3 dir-ltr text-left`} 
                        placeholder="linkedin.com/in/username" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-right">
               <div className="text-center mb-6"><h3 className="text-xl font-bold text-primary">ما هو ملعبك التقني؟ 💻</h3><p className="text-sm text-gray-500">نحتاج لمعرفة خبراتك لنختار لك المُحاور المناسب.</p></div>
               <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-right">المجال التقني <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FIELD_OPTIONS.map((opt) => (
                    <div key={opt.id} onClick={() => updateField('field', opt.label)} className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.field === opt.label ? 'border-accent bg-accent/5 text-accent font-bold ring-1 ring-accent' : 'border-gray-200 hover:border-gray-300 text-gray-600 text-sm'}`}>{opt.labelAr}</div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">التقنيات التي تتقنها <span className="text-red-500">*</span></label>
                <div className="relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 right-3 top-3 pointer-events-none"><Code className="h-5 w-5 text-gray-400" /></div>
                   <textarea 
                    value={formData.techStack} 
                    onChange={(e) => updateField('techStack', e.target.value)} 
                    className={`${inputClasses} pr-10 py-3 min-h-[100px] text-right`} 
                    placeholder="مثال: React, Node.js, TypeScript, PostgreSQL..." 
                   />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                <div className="text-right"><label className="block text-sm font-medium text-gray-700 mb-1 text-right">سنوات الخبرة <span className="text-red-500">*</span></label><input type="number" min="0" value={formData.experience} onChange={(e) => updateField('experience', parseInt(e.target.value))} className={`${inputClasses} py-3 px-4 text-right`} /></div>
                <div className="text-right"><label className="block text-sm font-medium text-gray-700 mb-1 text-right">المستوى الوظيفي <span className="text-red-500">*</span></label><select value={formData.level} onChange={(e) => updateField('level', e.target.value)} className={`${inputClasses} py-3 px-4 text-right`}>
                <option value="fresh">مبتدأ (fresh)</option>
                <option value="junior">مبتدأ (junior)</option>
                {/* ; <option value="mid-senior">متوسط وخبير (mid/senior)</option>
                ; <option value="lead-staff">قيادي (lead/staff)</option> */}
                </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-right">
               <div className="text-center mb-6"><h3 className="text-xl font-bold text-primary">ماذا تتوقع منا؟ 🎯</h3><p className="text-sm text-gray-500">هذه التفاصيل تساعد الخبير في التحضير الجيد لمقابلتك.</p></div>
               
               <div className="text-right"><label className="block text-sm font-medium text-gray-700 mb-3 text-right">أهدافك من المقابلة <span className="text-red-500">*</span></label><div className="space-y-2">{['تطوير المهارات التقنية', 'تحسين مهارات التواصل وعرض النفس', 'التعرف على نقاط الضعف والفجوات', 'التدرب على مقابلة وظيفية قادمة', 'الحصول على ترشيح (Referral)'].map((goal) => (<label key={goal} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={formData.goals.includes(goal)} onChange={() => toggleGoal(goal)} className="w-5 h-5 text-accent rounded focus:ring-accent" /><span className="text-gray-700 text-sm">{goal}</span></label>))}</div></div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                <div className="text-right"><label className="block text-sm font-medium text-gray-700 mb-2 text-right">الوقت المفضل للمقابلة <span className="text-red-500">*</span></label><select value={formData.preferredTime} onChange={(e) => updateField('preferredTime', e.target.value)} className={`${inputClasses} py-3 px-4 text-right`}><option value="">اختر الوقت...</option><option value="morning">صباحاً (9ص - 12م)</option><option value="evening">مساءً (4م - 9م)</option><option value="flexible">مرن في أي وقت</option></select></div>
                <div className="text-right"><label className="block text-sm font-medium text-gray-700 mb-2 text-right">هل لديك مقابلة قادمة؟ <span className="text-red-500">*</span></label><select value={formData.upcomingInterview} onChange={(e) => updateField('upcomingInterview', e.target.value)} className={`${inputClasses} py-3 px-4 text-right`}><option value="no">لا يوجد حالياً</option><option value="yes_soon">نعم، خلال هذا الأسبوع</option><option value="yes_later">نعم، في موعد لاحق</option></select></div>
              </div>
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center text-right">
                   <span>توقعاتك من الجلسة <span className="text-red-500">*</span></span>
                   <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">10 حروف على الأقل</span>
                </label>
                <textarea value={formData.expectations} onChange={(e) => updateField('expectations', e.target.value)} className={`${inputClasses} py-3 px-4 min-h-[100px] text-right`} placeholder="ما الذي تود التركيز عليه خلال الجلسة؟" />
              </div>

               <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 text-right">
                  <label className="block text-sm font-black text-accent mb-3 flex items-center gap-2 text-right">
                    <Sparkles className="w-4 h-4" /> اختيار الباقة المطلوبة <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['باقة عادية', 'باقة مميزة'].map((plan) => (
                      <div 
                        key={plan} 
                        onClick={() => updateField('planName', plan)} 
                        className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${formData.planName === plan ? 'border-accent bg-white shadow-md text-accent font-black scale-[1.02]' : 'border-gray-200 bg-white text-gray-500 text-sm font-bold'}`}
                      >
                        {plan}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold px-1 text-right">
                    {formData.planName === 'باقة مميزة' ? '✨ تشمل تسجيل الفيديو والمناقشة المفتوحة' : '💡 تشمل التقييم الأساسي والتقرير الفني'}
                  </p>
               </div>

              <div className="pt-4 border-t border-gray-100 text-right">
                <label className="flex items-start gap-3 cursor-pointer group text-right">
                  <input type="checkbox" checked={formData.termsAccepted} onChange={(e) => updateField('termsAccepted', e.target.checked)} className="mt-1 w-5 h-5 text-accent rounded focus:ring-accent border-gray-300" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors text-right">
                    أوافق على <button type="button" onClick={() => setShowTermsModal(true)} className="text-accent hover:underline font-bold">شروط الاستخدام</button> و <button type="button" onClick={() => setShowTermsModal(true)} className="text-accent hover:underline font-bold">سياسة الخصوصية</button> المتعلقة بالخدمة.
                  </span>
                </label>
              </div>
            </div>
          )}

          {error && <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in shake duration-500"><AlertCircle className="w-5 h-5 shrink-0" /><p className="text-sm font-medium">{error}</p></div>}

          <div className="mt-8 flex gap-4">
            {step > 1 && <Button variant="outline" onClick={() => { setStep(step - 1); setError(null); }} className="flex-1 flex items-center justify-center gap-2" disabled={loading}><ChevronRight className="w-5 h-5" /> السابق</Button>}
            {step < 3 ? <Button onClick={handleNextStep} className="flex-1 flex items-center justify-center gap-2">التالي <ChevronLeft className="w-5 h-5" /></Button> : <Button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 py-4" disabled={loading}>{loading ? <><Loader2 className="w-6 h-6 animate-spin" /> جاري إرسال الطلب...</> : <><CheckCircle className="w-5 h-5" /> تأكيد وإرسال الطلب</>}</Button>}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">تم استلام طلبك!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              شكراً لثقتك بنا. سنقوم بمراجعة بياناتك والتواصل معك عبر الواتساب والبريد الإلكتروني خلال 24 ساعة كحد أقصى.
            </p>
            <Button className="w-full py-4 rounded-2xl shadow-accent/20 text-lg" onClick={() => navigate('/my-requests')}>
              متابعة حالة الطلب
            </Button>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100 flex flex-col text-right">
            <div className="bg-primary p-6 text-white flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                 <Shield className="w-6 h-6 text-accent" />
                 <h3 className="text-xl font-bold">شروط الاستخدام والخصوصية</h3>
               </div>
               <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 text-gray-700 leading-relaxed text-right">
                <section className="text-right">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 justify-start text-right">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                    وصف الخدمة
                    </h2>
                    <p className="mr-10 text-gray-600 text-right">
                    منصة "مقابلة" تقدم خدمات محاكاة للمقابلات الوظيفية، مراجعة السير الذاتية، وتقديم تقارير تقييمية للأداء. 
                    هدفنا هو مساعدة الباحثين عن عمل في تحسين مهاراتهم، ولكننا لا نضمن الحصول على وظيفة بعد استخدام الخدمة.
                    </p>
                </section>

                <section className="text-right">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 justify-start text-right">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
                    سياسة الدفع والاسترجاع
                    </h2>
                    <div className="mr-10 space-y-4 text-right">
                    <p className="text-gray-600 text-right">يتم تحصيل رسوم الجلسات عبر القنوات الرسمية المعتمدة لضمان أمان معاملاتك المالية:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 text-right">
                        <li className="text-right">يتم دفع رسوم الجلسة كاملة مسبقاً لتأكيد الحجز.</li>
                        <li className="text-right"><span className="font-bold text-gray-900">PayPal:</span> متاح لجميع المستخدمين عالمياً.</li>
                        <li className="text-right"><span className="font-bold text-gray-900">InstaPay:</span> متاح للمستخدمين داخل مصر للتحويل اللحظي.</li>
                        <li className="text-right">يمكن استرداد المبلغ بالكامل في حال إلغاء الطلب قبل 24 ساعة.</li>
                    </ul>
                    </div>
                </section>

                <section className="text-right">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 justify-start text-right">
                    <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">3</span>
                    مسؤوليات المستخدم
                    </h2>
                    <p className="mr-10 text-gray-600 text-right">
                    يتعهد المستخدم بتقديم معلومات صحيحة ودقيقة لضمان جودة التقييم. كما يلتزم بالسلوك المهني واللائق خلال جلسات المقابلة.
                    </p>
                </section>

                <section className="text-right">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 justify-start text-right">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm">4</span>
                    الخصوصية واستخدام البيانات
                    </h2>
                    <p className="mr-10 text-gray-600 text-right">
                    نحن نحترم خصوصيتك. جميع البيانات التي تشاركها معنا يتم التعامل معها بسرية تامة وتستخدم فقط لغرض تقديم الخدمة وتحسين الجودة.
                    </p>
                </section>

                <section className="text-right">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 justify-start text-right">
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">5</span>
                    الموافقة على مشاركة البيانات
                    </h2>
                    <p className="mr-10 text-gray-600 font-bold text-right">
                    باستخدامك للمنصة، فإنك توافق على إمكانية عرض سيرتك الذاتية وبياناتك المهنية مع شركائنا في التوظيف لتعزيز فرص حصولك على العمل.
                    </p>
                </section>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center shrink-0">
               <Button onClick={() => setShowTermsModal(false)} className="px-12 rounded-2xl">فهمت ذلك، إغلاق</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMeetingRequest;
