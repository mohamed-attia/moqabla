import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Globe, Linkedin, Code, Layers, 
  Target, Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Loader2, Phone, FileText
} from 'lucide-react';
import Button from './Button';
import { RegistrationFormData } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    country: '',
    whatsapp: '',
    linkedin: '',
    field: '',
    techStack: [],
    experience: 0,
    level: 'junior',
    goals: [],
    hasInterviewExperience: 'no',
    upcomingInterview: 'no',
    preferredTime: '',
    expectations: '',
    termsAccepted: false
  });

  // Temporary state for tech stack input
  const [currentTech, setCurrentTech] = useState('');

  const updateField = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleTechAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTech.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(currentTech.trim())) {
        updateField('techStack', [...formData.techStack, currentTech.trim()]);
      }
      setCurrentTech('');
    }
  };

  const removeTech = (tech: string) => {
    updateField('techStack', formData.techStack.filter(t => t !== tech));
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = formData.goals;
    if (currentGoals.includes(goal)) {
      updateField('goals', currentGoals.filter(g => g !== goal));
    } else {
      updateField('goals', [...currentGoals, goal]);
    }
  };

  // Validation Logic
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
           formData.techStack.length > 0 && 
           !isNaN(formData.experience) && formData.experience >= 0 &&
           formData.level !== undefined;
  };

  const isStep3Valid = () => {
    return formData.goals.length > 0 && 
           formData.preferredTime !== '' &&
           formData.expectations.trim().length > 10 &&
           formData.upcomingInterview !== '' &&
           formData.termsAccepted === true;
  };

  const handleNextStep = () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    } else if (step === 2 && isStep2Valid()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    // Prevent double submission
    if (loading) return;

    if (!isStep3Valid()) {
      setError("يرجى التأكد من تعبئة جميع الحقول والموافقة على الشروط.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, "registrations"), {
        ...formData,
        submittedAt: serverTimestamp(),
        status: 'pending'
      });
      
      alert("تم استلام طلبك بنجاح! سنتواصل معك قريباً.");
      navigate('/');
    } catch (err) {
      console.error("Error submitting form: ", err);
      setError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى أو التحقق من الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">سجل اهتمامك الآن</h2>
          <p className="mt-2 text-lg text-gray-600">
            خطوة واحدة تفصلك عن تطوير مسارك المهني.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded"></div>
          <div 
            className="absolute top-1/2 right-0 h-1 bg-accent -z-10 rounded transition-all duration-500" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          <div className="flex justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex flex-col items-center bg-gray-50 px-2 ${step >= s ? 'text-accent' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  step >= s ? 'border-accent bg-accent text-white' : 'border-gray-300 bg-white'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className="text-xs font-bold mt-1">
                  {s === 1 ? 'تعارف' : s === 2 ? 'الخبرة' : 'الأهداف'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-primary">لنبدأ بالتعارف 👋</h3>
                <p className="text-sm text-gray-500">بياناتك تساعدنا في التواصل معك وتخصيص تجربتك.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل <span className="text-red-500">*</span></label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="focus:ring-accent focus:border-accent block w-full pr-10 py-3 border-gray-300 rounded-lg"
                      placeholder="مثال: أحمد محمد"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`block w-full pr-10 py-3 border rounded-lg focus:ring-accent focus:border-accent ${
                          formData.email.length > 0 && !isEmailValid(formData.email) ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="email@example.com"
                      />
                    </div>
                    {!isEmailValid(formData.email) && formData.email.length > 0 && (
                       <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> بريد إلكتروني غير صحيح</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الواتساب <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                        className={`block w-full pr-10 py-3 border rounded-lg focus:ring-accent focus:border-accent dir-ltr text-right placeholder:text-right ${
                          formData.whatsapp.length > 0 && !isWhatsappValid(formData.whatsapp) ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="+1234567890"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">سيتم التواصل معك عبر واتساب لتنسيق الموعد</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الدولة / المدينة <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        className="focus:ring-accent focus:border-accent block w-full pr-10 py-3 border-gray-300 rounded-lg"
                        placeholder="اسم الدولة"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط LinkedIn <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Linkedin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => updateField('linkedin', e.target.value)}
                        className="focus:ring-accent focus:border-accent block w-full pr-10 py-3 border-gray-300 rounded-lg dir-ltr text-left"
                        placeholder="https://www.linkedin.com/in/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tech Background */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-primary">ما هو ملعبك التقني؟ 💻</h3>
                <p className="text-sm text-gray-500">نحتاج لمعرفة خبراتك لنختار لك المُحاور المناسب.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">المجال التقني <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {['Frontend', 'Backend', 'Full Stack', 'Mobile App', 'DevOps', 'Data Science'].map((field) => (
                    <div 
                      key={field}
                      onClick={() => updateField('field', field)}
                      className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${
                        formData.field === field 
                        ? 'border-accent bg-accent/5 text-accent font-bold ring-1 ring-accent' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التقنيات التي تتقنها <span className="text-red-500">*</span></label>
                <div className="relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Code className="h-5 w-5 text-gray-400" />
                    </div>
                  <input
                    type="text"
                    value={currentTech}
                    onChange={(e) => setCurrentTech(e.target.value)}
                    onKeyDown={handleTechAdd}
                    className="focus:ring-accent focus:border-accent block w-full pr-10 py-3 border-gray-300 rounded-lg"
                    placeholder="اكتب واضغط Enter (مثال: React, Node.js)"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.techStack.map((tech) => (
                    <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)} className="mr-2 text-gray-500 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">سنوات الخبرة <span className="text-red-500">*</span></label>
                   <input
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => updateField('experience', parseInt(e.target.value))}
                      className="focus:ring-accent focus:border-accent block w-full py-3 px-4 border-gray-300 rounded-lg text-center"
                    />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">المستوى <span className="text-red-500">*</span></label>
                   <select
                      value={formData.level}
                      onChange={(e) => updateField('level', e.target.value)}
                      className="focus:ring-accent focus:border-accent block w-full py-3 px-4 border-gray-300 rounded-lg"
                    >
                      <option value="junior">مبتدئ (Junior)</option>
                      <option value="mid">متوسط (Mid-Level)</option>
                      <option value="senior">خبير (Senior)</option>
                      <option value="lead">قيادي (Tech Lead)</option>
                   </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-primary">ماذا تطمح؟ 🎯</h3>
                <p className="text-sm text-gray-500">ساعدنا نفهم أهدافك لنحقق لك أقصى استفادة.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">الهدف من المقابلة <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  {['تقييم مستواي الحالي', 'التحضير لمقابلة وظيفة محددة', 'معرفة نقاط الضعف', 'التدرب على كسر الرهبة'].map((goal) => (
                    <label key={goal} className="flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={formData.goals.includes(goal)}
                        onChange={() => toggleGoal(goal)}
                        className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent" 
                      />
                      <span className="mr-3 text-gray-700 select-none">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">وقتك المفضل <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Clock className="absolute top-3 right-3 h-5 w-5 text-gray-400" />
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => updateField('preferredTime', e.target.value)}
                        className="focus:ring-accent focus:border-accent block w-full py-3 pr-10 border-gray-300 rounded-lg"
                      >
                        <option value="">اختر الوقت...</option>
                        <option value="morning">صباحاً (9ص - 12م)</option>
                        <option value="evening">مساءً (4م - 9م)</option>
                        <option value="flexible">مرن في أي وقت</option>
                      </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">مقابلة حقيقية قريبة؟</label>
                    <select
                        value={formData.upcomingInterview}
                        onChange={(e) => updateField('upcomingInterview', e.target.value)}
                        className="focus:ring-accent focus:border-accent block w-full py-3 px-4 border-gray-300 rounded-lg"
                      >
                        <option value="no">لا يوجد حالياً</option>
                        <option value="yes">نعم، لدي مقابلة</option>
                        <option value="soon">خلال شهر</option>
                      </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">توقعاتك من الجلسة <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  value={formData.expectations}
                  onChange={(e) => updateField('expectations', e.target.value)}
                  className="focus:ring-accent focus:border-accent block w-full py-3 px-4 border-gray-300 rounded-lg"
                  placeholder="أريد التركيز على أسئلة الـ System Design..."
                />
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => updateField('termsAccepted', e.target.checked)}
                      className="h-5 w-5 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                  </div>
                  <div className="text-sm text-gray-600 leading-6">
                    قرأت ووافقت على <Link to="/terms" target="_blank" className="text-accent hover:underline font-bold mx-1">الشروط والأحكام</Link> وسياسة الخصوصية.
                  </div>
                </label>
                {!formData.termsAccepted && step === 3 && (
                   <p className="text-xs text-gray-400 mt-1 mr-8">يجب الموافقة للمتابعة</p>
                )}
              </div>

            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center border-t pt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                رجوع
              </Button>
            ) : (
              <div className="w-2"></div> // Spacer
            )}

            {step < 3 ? (
              <Button 
                variant="primary" 
                onClick={handleNextStep} 
                className={`flex items-center gap-2 ${
                  (step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid()) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
                }`}
                // Using onClick in wrapper but logic inside disabled would be cleaner if button supported it directly
                // Here we prevent action via handleNextStep logic too
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={!isStep3Valid() || loading}
                className={`flex items-center gap-2 min-w-[140px] justify-center`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد التسجيل'}
              </Button>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
        
        {/* Footer Note */}
        <p className="text-center text-sm text-gray-400 mt-4">
          بياناتك محفوظة بشكل آمن ولن يتم مشاركتها مع أي طرف ثالث.
        </p>

      </div>
    </div>
  );
};

export default Register;