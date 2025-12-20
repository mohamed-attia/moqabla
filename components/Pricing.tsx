
import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Zap, Gift, Sparkles, Users, Video, MessageSquare, Star, Plus, CreditCard, AlertCircle } from 'lucide-react';
import Button from './Button';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged } = FirebaseAuth as any;
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const { useNavigate } = ReactRouterDOM as any;

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(true); // المميز هو الافتراضي لعرض القيمة الكاملة

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData?.role;
            const adminStatus = role === 'admin' || role === 'maintainer' || role === 'interviewer';
            setIsAdmin(adminStatus);
          }
          const q = query(collection(db, "registrations"), where("userId", "==", currentUser.uid));
          const snapshot = await getDocs(q);
          const hasActive = snapshot.docs.some(doc => ['pending', 'reviewing', 'approved'].includes(doc.data().status));
          setHasActiveRequest(hasActive);
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsubscribe();
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
          
          {/* Requested Text Block */}
          <div className="max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm">
                <p className="text-gray-800 text-lg leading-relaxed">
                  <span className="font-black text-accent block mb-2">💡 اختر مستواك بدقة أثناء التسجيل</span>
                  تحديد المستوى الصحيح يضمن لك مقابلة تحاكي واقعك وتكشف لك فرص التحسين الحقيقية.
                </p>
             </div>
          </div>
          
          {/* Toggle Switch */}
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
          <p className="text-gray-400 text-xs font-bold">
            {isPremium ? '✨ الباقة المميزة تشمل تسجيل الفيديو والمناقشة المفتوحة' : '💡 الباقة العادية توفر لك التقييم الأساسي والتقرير'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 group border ${
                plan.popular 
                  ? 'bg-slate-900 border-primary shadow-2xl scale-105 z-10 text-white' 
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2'
              }`}
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
                {plan.id !== 'referral' && <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/ مقابلة</span>}
              </div>

              <p className={`text-sm leading-relaxed mb-8 flex-grow ${plan.popular ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => {
                  const isPlusItem = isPremium && (feature.includes('مناقشة') || feature.includes('تسجيل'));
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 shrink-0 ${isPlusItem ? 'text-accent' : 'text-accent'}`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-medium ${isPlusItem ? 'font-black' : ''}`}>{feature}</span>
                    </div>
                  );
                })}
              </div>

              <Button 
                onClick={() => handleBookingAction(plan.id)}
                className={`w-full py-4 rounded-2xl shadow-xl transition-all font-black text-sm ${
                  plan.id === 'referral' ? 'bg-purple-600 hover:bg-purple-700' :
                  plan.popular ? 'bg-accent hover:bg-accentHover text-white' : 'bg-primary hover:bg-secondary text-white'
                }`}
              >
                {plan.id === 'referral' ? 'ابدأ التحدي' : 'احجز موعدك'}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
           <div className="inline-flex items-center gap-6 px-8 py-4 bg-white border border-gray-100 rounded-full shadow-lg">
             <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
               <ShieldCheck className="w-5 h-5 text-emerald-500" /> ضمان استرجاع 100%
             </div>
             <div className="w-px h-6 bg-gray-100"></div>
             <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
               <CreditCard className="w-5 h-5 text-blue-500" /> PayPal & InstaPay
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
