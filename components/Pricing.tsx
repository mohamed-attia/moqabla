
import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Zap, Gift, Sparkles, Users, Lock, CreditCard } from 'lucide-react';
import Button from './Button';
// Use namespace import to bypass named export resolution issues
import * as ReactRouterDOM from 'react-router-dom';
import { auth, db } from '../lib/firebase';
// Fix: Use namespace import for FirebaseAuth to bypass named export resolution issues
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged } = FirebaseAuth as any;
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';

// Fix: Use type assertion to bypass broken react-router-dom type definitions
const { useNavigate } = ReactRouterDOM as any;

const pricingPlans = [
  {
    id: 'referral',
    title: 'سفراء النجاح',
    level: 'Community & Referrals',
    price: 'مجاناً',
    period: 'عند دعوة 15 صديق',
    description: 'شارك المعرفة مع مجتمعك واحصل على التجربة كاملة مجاناً.',
    features: [
      'مقابلة مع خبير (40-45 دقيقة)',
      'مناقشة مفتوحة (15-20 دقيقة)',
      'تقرير شامل معتمد من الخبير التقني و الذكاء الاصطناعي',
      'تسجيل كامل للمقابلة',
      'أولوية في الحجز',
    ],
    highlight: true,
    highlightText: 'الأكثر توفيراً',
    icon: Gift,
    color: 'purple'
  },
  {
    id: 'junior',
    title: 'البداية القوية',
    level: 'Fresh / Junior',
    price: '$9.99',
    description: 'أسس مسارك المهني بشكل صحيح واكتشف نقاط قوتك مبكراً.',
    features: [
      'مقابلة مع خبير (40-45 دقيقة)',
      'مناقشة مفتوحة (15-20 دقيقة)',
      'تقرير شامل معتمد من الخبير التقني و الذكاء الاصطناعي',
      'تسجيل كامل للمقابلة',
    ],
    hasGuarantee: true,
    icon: Sparkles,
    color: 'teal'
  },
  {
    id: 'senior',
    title: 'الاحتراف والتميز',
    level: 'Mid-Senior / Senior',
    price: '$24.9',
    description: 'تحدى قدراتك مع خبراء متمرسين وارفع سقف طموحاتك.',
    features: [
      'مقابلة مع خبير (40-45 دقيقة)',
      'مناقشة مفتوحة (15-20 دقيقة)',
      'تقرير شامل معتمد من الخبير التقني و الذكاء الاصطناعي',
      'تسجيل كامل للمقابلة',
    ],
    hasGuarantee: true,
    popular: true,
    icon: Zap,
    color: 'teal'
  },
  {
    id: 'staff',
    title: 'القيادة التقنية',
    level: 'Staff / Tech Lead',
    price: '$34.9',
    description: 'نقاشات عالية المستوى في التصميم المعماري والقيادة.',
    features: [
      'مقابلة مع خبير (40-45 دقيقة)',
      'مناقشة مفتوحة (15-20 دقيقة)',
      'تقرير شامل معتمد من الخبير التقني و الذكاء الاصطناعي',
      'تسجيل كامل للمقابلة',
    ],
    hasGuarantee: true,
    icon: Users,
    color: 'teal'
  }
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        // Robust role check matching Header.tsx
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const userData = userDoc.data();
          const role = userData?.role;
          const isDevAdmin = currentUser.email === 'dev.mohattia@gmail.com';
          const adminStatus = role === 'admin' || role === 'maintainer' || role === 'interviewer' || isDevAdmin;
          setIsAdmin(adminStatus);
        } catch (e) {
          setIsAdmin(currentUser.email === 'dev.mohattia@gmail.com');
        }

        try {
          const q = query(
            collection(db, "registrations"), 
            where("userId", "==", currentUser.uid),
            limit(15)
          );
          const snapshot = await getDocs(q);
          const hasActive = snapshot.docs.some(doc => {
            const data = doc.data();
            const status = data.status || 'pending';
            // Hide if pending, reviewing, or approved
            return ['pending', 'reviewing', 'approved'].includes(status);
          });
          setHasActiveRequest(hasActive);
        } catch (error) {
          console.error("Error checking active requests", error);
        }
      } else {
        setHasActiveRequest(false);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBookingAction = (planId?: string) => {
    if (user) {
      if (planId === 'referral') {
        navigate('/profile');
      } else {
        if (hasActiveRequest && !isAdmin) return;
        navigate('/request-meeting');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <span className="text-accent font-bold tracking-wider uppercase mb-3 block animate-in fade-in slide-in-from-bottom-2">
            استثمارك في نفسك
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 animate-in fade-in slide-in-from-bottom-3">
            باقات مُصممة <span className="text-accent">لنجاحك المهني</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm inline-block">
            <span className="font-bold text-gray-800 block mb-1">💡 اختر مستواك بدقة أثناء التسجيل</span>
             تحديد المستوى الصحيح يضمن لك مقابلة تحاكي واقعك وتكشف لك فرص التحسين الحقيقية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 align-stretch mb-12">
          {pricingPlans.map((plan, index) => (
            <div 
              key={plan.id}
              className={`
                relative flex flex-col p-6 rounded-2xl transition-all duration-300 group
                ${plan.popular 
                  ? 'bg-white border-2 border-accent shadow-xl scale-105 z-10' 
                  : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                  الأكثر طلباً
                </div>
              )}

              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  {plan.highlightText}
                </div>
              )}

              <div className="mb-6 text-center">
                <div className={`
                  w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-colors
                  ${plan.id === 'referral' ? 'bg-purple-100 text-purple-600' : 'bg-accent/10 text-accent'}
                `}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">{plan.level}</p>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.id === 'referral' ? 'text-purple-600' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.id !== 'referral' && <span className="text-gray-400 mb-1">/ مقابلة</span>}
                </div>
                {plan.period && <p className="text-xs text-purple-600 font-bold bg-purple-50 py-1 px-2 rounded-full inline-block">{plan.period}</p>}
              </div>

              <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed min-h-[40px]">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="mt-0.5 shrink-0">
                      <span className={`w-4 h-4 ${plan.id === 'referral' ? 'text-purple-500' : 'text-accent'}`}><Check className="w-4 h-4" /></span>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.hasGuarantee && (
                  <li className="flex items-center gap-3 text-sm font-bold text-green-700 bg-green-50 p-2 rounded-lg border border-green-100 mt-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>ضمان استرجاع النقود 100%</span>
                  </li>
                )}
              </ul>

              {/* Show button if logged out OR if it's the referral plan OR if admin OR user has no active request */}
              {(!user || plan.id === 'referral' || isAdmin || !hasActiveRequest) && (
                <Button 
                  onClick={() => handleBookingAction(plan.id)}
                  className={`w-full justify-center ${
                    plan.id === 'referral' 
                      ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                      : plan.popular ? 'bg-accent hover:bg-accentHover' : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {plan.id === 'referral' ? 'ابدأ التحدي' : 'احجز موعدك'}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Simplified Payment Notice Section */}
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 delay-500">
          <p className="text-gray-800 font-bold text-lg">
            الدفع عن طريق تحويلات PayPal و InstaPay
          </p>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
