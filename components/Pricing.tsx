
import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Zap, Gift, Sparkles, Users, Star, CreditCard, Wallet, Clock } from 'lucide-react';
import Button from './Button';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged } = FirebaseAuth as any;
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { fetchUserLocation } from '../lib/geo';

const { useNavigate } = ReactRouterDOM as any;

// Configuration for localized prices
const CURRENCY_CONFIG: Record<string, { symbol: string, suffix: string, rates: Record<string, { normal: string, premium: string }> }> = {
  'EG': {
    symbol: '',
    suffix: 'ج.م',
    rates: {
      junior: { normal: '510', premium: '760' },
      senior: { normal: '950', premium: '1900' },
      staff: { normal: '1500', premium: '1710' }
    }
  },
  'SA': {
    symbol: '',
    suffix: 'ر.س',
    rates: {
      junior: { normal: '80', premium: '110' },
      senior: { normal: '125', premium: '150' },
      staff: { normal: '175', premium: '200' }
    }
  },
  'AE': {
    symbol: '',
    suffix: 'د.إ',
    rates: {
      junior: { normal: '80', premium: '110' },
      senior: { normal: '125', premium: '150' },
      staff: { normal: '175', premium: '200' }
    }
  },
  'DEFAULT': {
    symbol: '$',
    suffix: '',
    rates: {
      junior: { normal: '9.99', premium: '14.99' },
      senior: { normal: '19.9', premium: '24.9' },
      staff: { normal: '29.9', premium: '34.9' }
    }
  }
};

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(true);
  const [countryCode, setCountryCode] = useState<string>('DEFAULT');

  useEffect(() => {
    // Detect Location
    const detectLocation = async () => {
      try {
        const geo = await fetchUserLocation();
        if (geo && geo.country) {
          const detectedCountry = geo.country.toUpperCase();
          if (detectedCountry && CURRENCY_CONFIG[detectedCountry]) {
            setCountryCode(detectedCountry);
          } else {
            setCountryCode('DEFAULT');
          }
        }
      } catch (err) {
        console.error("Pricing Location Detection Error:", err);
        setCountryCode('DEFAULT');
      }
    };

    detectLocation();

    let unsubscribeSnapshot: any = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const role = userDoc.data()?.role;
            setIsAdmin(role === 'admin' || role === 'maintainer' || role === 'interviewer');
          }
        } catch (e) {}

        const q = query(
          collection(db, "registrations"), 
          where("userId", "==", currentUser.uid)
        );

        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const hasActive = snapshot.docs.some(doc => {
            const status = doc.data().status || 'pending';
            return ['pending', 'reviewing', 'approved'].includes(status);
          });
          setHasActiveRequest(hasActive);
        });
      } else {
        setHasActiveRequest(false);
        setIsAdmin(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleBookingAction = (planId: string, isUnderConstruction?: boolean) => {
    if (isUnderConstruction) return;
    
    if (!user) {
      navigate('/login');
    } else if (planId === 'referral') {
      navigate('/profile');
    } else {
      if (hasActiveRequest && !isAdmin) return;
      navigate('/request-meeting');
    }
  };

  const currentCurrency = CURRENCY_CONFIG[countryCode] || CURRENCY_CONFIG['DEFAULT'];

  const pricingPlans = [
    {
      id: 'referral',
      title: 'سفراء النجاح',
      level: 'Community & Referrals',
      price: 'مجاناً',
      period: 'مقابل 10 دعوات للاصدقاء ناجحة',
      description: 'حوّل شبكة علاقاتك إلى تذكرة عبور لمستقبلك! ادعُ 10 من أصدقائك الطموحين للانضمام إلينا، وسنكافئك بمقابلة احترافية كاملة "مجاناً" لتكون بوابتك نحو الوظيفة الحلم.',
      features: [
        'مقابلة مع خبير (40-45 دقيقة)',
        'تقرير شامل معتمد من الخبير ومدعوم بالذكاء الاصطناعي',
      ],
      highlight: true,
      highlightText: 'باقة الاصدقاء',
      icon: Gift,
    },
    {
      id: 'junior',
      title: 'البداية القوية',
      level: 'Fresh / Junior',
      price: isPremium ? currentCurrency.rates.junior.premium : currentCurrency.rates.junior.normal,
      description: isPremium ? 'الباقة المتكاملة لمراجعة أخطائك بالفيديو ومناقشة الخبير.' : 'الخيار الأساسي لتجربة أجواء المقابلات ومعرفة تقييمك.',
      features: [
        'مقابلة مع خبير (40-45 دقيقة)',
        ...(isPremium ? [
          'مناقشة مفتوحة (20-25 دقيقة)',
          'محاكاة مقابلة لشركات مستهدفة (عند التوفر)'
        ] : []),
        'تقرير شامل معتمد من الخبير ومدعوم بالذكاء الاصطناعي',
        ...(isPremium ? ['تسجيل كامل للمقابلة بالفيديو'] : []),
        '🟢 مصممة خصيصًا للمبتدئين لبناء الثقة والاستعداد لسوق العمل',
      ],
      popular: isPremium,
      icon: Sparkles,
    },
    {
      id: 'senior',
      title: 'الاحتراف والتميز',
      level: 'Mid-Senior / Senior',
      price: isPremium ? currentCurrency.rates.senior.premium : currentCurrency.rates.senior.normal,
      description: 'تحدى قدراتك مع خبراء متمرسين وارفع سقف طموحاتك المهنية.',
      features: [
        'مقابلة مع خبير (40-45 دقيقة)',
        ...(isPremium ? [
          'مناقشة مفتوحة (20-25 دقيقة)',
          'محاكاة مقابلة لشركات مستهدفة (عند التوفر)'
        ] : []),
        'تقرير شامل معتمد من الخبير ومدعوم بالذكاء الاصطناعي',
        ...(isPremium ? ['تسجيل كامل للمقابلة بالفيديو'] : []),
        '🟢 موجهة للمطورين المحترفين للاستعداد لفرص متقدمة',
      ],
      icon: Zap,
      isUnderConstruction: true
    },
    {
      id: 'staff',
      title: 'القيادة التقنية',
      level: 'Staff / Tech Lead',
      price: isPremium ? currentCurrency.rates.staff.premium : currentCurrency.rates.staff.normal,
      description: 'نقاشات عالية المستوى في التصميم المعماري والقيادة التقنية.',
      features: [
        'مقابلة مع خبير (40-45 دقيقة)',
        ...(isPremium ? [
          'مناقشة مفتوحة (20-25 دقيقة)',
          'محاكاة مقابلة لشركات مستهدفة (عند التوفر)'
        ] : []),
        'تقرير شامل معتمد من الخبير ومدعوم بالذكاء الاصطناعي',
        ...(isPremium ? ['تسجيل كامل للمقابلة بالفيديو'] : []),
        '🟢 مصممة خصيصًا للقادة التقنيين لبناء رؤية قيادية والاستعداد لمناصب أعلى',
      ],
      icon: Users,
      isUnderConstruction: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-accent font-black tracking-[0.2em] uppercase mb-3 block">استثمارك الذكي</span>
          <h2 className="text-4xl md:text-6xl font-black text-primary mb-6">
            اختر باقة <span className="text-accent">نجاحك</span>
          </h2>
          
          <div className="max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm">
                <p className="text-gray-800 text-lg leading-relaxed">
                  <span className="font-black text-accent block mb-2">
                    💡 اختر مستواك بدقة أثناء التسجيل
                  </span>
                  تحديد المستوى الصحيح يضمن لك مقابلة تحاكي واقعك وتكشف لك فرص التحسين الحقيقية.
                </p>
             </div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 p-1.5 rounded-[1.5rem] flex items-center shadow-inner border border-gray-200">
              <button 
                onClick={() => setIsPremium(false)}
                className={`px-10 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${!isPremium ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                عادي
              </button>
              <button 
                onClick={() => setIsPremium(true)}
                className={`px-10 py-3 rounded-2xl text-sm font-black transition-all duration-300 flex items-center gap-2 ${isPremium ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
              >
                مميز
                <Sparkles className={`w-4 h-4 ${isPremium ? 'text-white' : 'text-gray-300'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 group border ${
                plan.popular 
                  ? 'bg-slate-900 border-primary shadow-2xl scale-105 z-10 text-white' 
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2'
              } ${ (hasActiveRequest && !isAdmin && plan.id !== 'referral') || plan.isUnderConstruction ? 'opacity-75' : ''}`}
            >
              {plan.isUnderConstruction && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-amber-200 shadow-sm animate-pulse">
                    <Clock className="w-3 h-3" />
                    قيد التجهيز...انتظرونا
                  </div>
                </div>
              )}

              {(plan.highlight || (plan.id === 'junior' && isPremium)) && (
                <div className={`absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-2 whitespace-nowrap ${
                  plan.id === 'referral' ? 'bg-purple-600 text-white' : 'bg-accent text-white'
                }`}>
                  {plan.id === 'referral' ? <Gift className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                  {plan.id === 'referral' ? 'باقة الاصدقاء' : 'القيمة الأفضل'}
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${
                  plan.popular ? 'bg-white/10 text-accent' : 'bg-gray-50 text-accent'
                }`}>
                  <plan.icon className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-black mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.title}</h3>
                <p className={`text-xs font-bold uppercase tracking-wider ${plan.popular ? 'text-gray-400' : 'text-gray-50'}`}>{plan.level}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                {plan.id !== 'referral' && <span className={`text-xl font-black ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{currentCurrency.symbol}</span>}
                <span className={`text-4xl font-black transition-all duration-300 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                {plan.id !== 'referral' && <span className={`text-sm font-bold opacity-70 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{currentCurrency.suffix}</span>}
                {plan.id === 'referral' && <span className={`text-xs font-bold mr-2 opacity-60 ${plan.popular ? 'text-white' : 'text-gray-500'}`}>{plan.period}</span>}
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => {
                  const isSpecial = feature.startsWith('🟢');
                  const cleanText = isSpecial ? feature.substring(2) : feature;
                  
                  return (
                    <div key={idx} className={`flex items-start gap-3 ${isSpecial ? 'bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10' : ''}`}>
                      {isSpecial ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      ) : (
                        <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${isSpecial ? 'text-emerald-500 font-bold' : ''}`}>
                        {cleanText}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-4">
                <Button 
                  onClick={() => handleBookingAction(plan.id, plan.isUnderConstruction)}
                  disabled={(hasActiveRequest && !isAdmin && plan.id !== 'referral') || plan.isUnderConstruction}
                  className={`w-full py-4 rounded-2xl shadow-xl transition-all font-black text-sm ${
                    plan.isUnderConstruction ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-none' :
                    plan.id === 'referral' ? 'bg-purple-600 hover:bg-purple-700' :
                    plan.popular ? 'bg-accent hover:bg-accentHover text-white' : 'bg-primary hover:bg-secondary text-white'
                  }`}
                >
                  {plan.isUnderConstruction ? 'انتظرونا قريباً' : (hasActiveRequest && !isAdmin && plan.id !== 'referral' ? 'لديك طلب نشط' : (plan.id === 'referral' ? 'ابدأ التحدي الآن' : 'احجز موعدك'))}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-black text-gray-900 mb-2">ضمان استرداد الأموال 100%</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[250px]">
                نحن نثق في جودة خبرائنا، لذا نضمن لك استرداد كامل المبلغ في حال لم تكن راضياً عن الجلسة.
              </p>
           </div>

           <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7" />
              </div>
              <h4 className="font-black text-gray-900 mb-2">وسائل دفع آمنة وعالمية</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[250px]">
                نقبل الدفع عبر <span className="font-bold text-blue-600">PayPal</span> لضمان سهولة المعاملات لجميع مستخدمينا حول العالم.
              </p>
           </div>

           <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7" />
              </div>
              <h4 className="font-black text-gray-900 mb-2">تحويل لحظي عبر InstaPay</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[250px]">
                للمستخدمين داخل مصر، نوفر خيار التحويل اللحظي عبر <span className="font-bold text-purple-600">InstaPay</span> لسرعة تأكيد الحجز.
              </p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
