
import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Zap, Gift, Sparkles, Users, Video, MessageSquare, Star, Plus, CreditCard, AlertCircle, Wallet } from 'lucide-react';
import Button from './Button';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged } = FirebaseAuth as any;
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

const { useNavigate } = ReactRouterDOM as any;

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(true);

  useEffect(() => {
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

  const handleBookingAction = (planId: string) => {
    if (!user) {
      navigate('/login');
    } else if (planId === 'referral') {
      navigate('/profile');
    } else {
      if (hasActiveRequest && !isAdmin) return;
      navigate('/request-meeting');
    }
  };

  const pricingPlans = [
    {
      id: 'referral',
      title: 'سفراء النجاح',
      level: 'Community & Referrals',
      price: 'مجاناً',
      period: 'عند دعوة 15 صديق',
      description: 'شارك المعرفة مع مجتمعك واحصل على تقييم احترافي لمستواك مجاناً.',
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
      price: isPremium ? '$14.99' : '$9.99',
      description: isPremium ? 'الباقة المتكاملة لمراجعة أخطائك بالفيديو ومناقشة الخبير.' : 'الخيار الأساسي لتجربة أجواء المقابلات ومعرفة تقييمك.',
      features: [
        'مقابلة مع خبير (40-45 دقيقة)',
        ...(isPremium ? ['مناقشة مفتوحة (20-25 دقيقة)'] : []),
        'تقرير شامل معتمد من الخبير ومدعوم بالذكاء الاصطناعي',
        ...(isPremium ? ['تسجيل كامل للمقابلة بالفيديو'] : []),
      ],
      popular: isPremium,
      icon: Sparkles,
    },
    {
      id: 'senior',
      title: 'الاحتراف والتميز',
      level: 'Mid-Senior / Senior',
      price: isPremium ? '$24.9' : '$19.9',
      description: 'تحدى قدراتك مع خبراء متمرسين وارفع سقف طموحاتك المهنية.',
      features: [
        'مقابلة مع خبير (40-45 دقيقة)',
        ...(isPremium ? ['مناقشة مفتوحة (20-25 دقيقة)'] : []),
        'تقرير شامل معتمد من الخبير ومدعوم بالذكاء الاصطناعي',
        ...(isPremium ? ['تسجيل كامل للمقابلة بالفيديو'] : []),
      ],
      icon: Zap,
    },
    {
      id: 'staff',
      title: 'القيادة التقنية',
      level: 'Staff / Tech Lead',
      price: isPremium ? '$34.9' : '$29.9',
      description: 'نقاشات عالية المستوى في التصميم المعماري والقيادة التقنية.',
      features: [
        'مقابلة مع خبير (40-45 دقيقة)',
        ...(isPremium ? ['مناقشة مفتوحة (20-25 دقيقة)'] : []),
        'تقرير شامل معتمد من الخبير ومدعوم بالذكاء الاصطناعي',
        ...(isPremium ? ['تسجيل كامل للمقابلة بالفيديو'] : []),
      ],
      icon: Users,
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
                  <span className="font-black text-accent block mb-2">💡 اختر مستواك بدقة أثناء التسجيل</span>
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
              } ${hasActiveRequest && !isAdmin && plan.id !== 'referral' ? 'opacity-75' : ''}`}
            >
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
                <p className={`text-xs font-bold uppercase tracking-wider ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>{plan.level}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-black transition-all duration-300 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <Button 
                  onClick={() => handleBookingAction(plan.id)}
                  disabled={hasActiveRequest && !isAdmin && plan.id !== 'referral'}
                  className={`w-full py-4 rounded-2xl shadow-xl transition-all font-black text-sm ${
                    plan.id === 'referral' ? 'bg-purple-600 hover:bg-purple-700' :
                    plan.popular ? 'bg-accent hover:bg-accentHover text-white' : 'bg-primary hover:bg-secondary text-white'
                  }`}
                >
                  {hasActiveRequest && !isAdmin && plan.id !== 'referral' ? 'لديك طلب نشط' : (plan.id === 'referral' ? 'ابدأ التحدي' : 'احجز موعدك')}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* قسم الضمان ووسائل الدفع */}
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
