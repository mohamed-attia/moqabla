import React, { useState, useEffect } from 'react';
import Button from './Button';
import { ArrowLeft, MessageSquare, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import * as firebaseAuth from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch all requests for user and filter client-side to handle missing 'status' field and avoid composite index requirement
          const q = query(
            collection(db, "registrations"), 
            where("userId", "==", currentUser.uid)
          );
          const snapshot = await getDocs(q);
          // Check if any request is pending or reviewing (or undefined status which implies pending)
          const hasActive = snapshot.docs.some(doc => {
            const data = doc.data();
            const status = data.status || 'pending';
            return ['pending', 'reviewing'].includes(status);
          });
          setHasActiveRequest(hasActive);
        } catch (error) {
          console.error("Error checking active requests", error);
        }
      } else {
        setHasActiveRequest(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBookingAction = () => {
    if (user) {
      if (hasActiveRequest) return;
      navigate('/request-meeting');
    } else {
      navigate('/login');
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 md:pt-20 md:pb-32 lg:pt-40 overflow-hidden bg-gradient-to-br from-secondary via-primary to-slate-800">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-transparent z-0">
         {/* Abstract shapes for visual interest */}
         <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-sm font-semibold text-white">ابدأ مسارك المهني الآن</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-7xl font-bold text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-5 delay-100 duration-700">
              <span className="block mb-2">أتقن مهارات</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-400 to-emerald-400">
                المقابلة الوظيفية
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-lg xl:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-6 delay-200 duration-700">
              لا تترك وظيفة أحلامك للصدفة. احصل على تجربة محاكاة واقعية مع خبراء تقنيين، واكتشف نقاط قوتك ومجالات التحسين قبل المقابلة الحقيقية.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-7 delay-300 duration-700">
              {!hasActiveRequest && (
                <Button variant="primary" onClick={handleBookingAction}>
                  احجز موعد الآن
                </Button>
              )}
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:!text-slate-900" 
                onClick={() => navigate('/team')}
              >
                 تعرف علينا أكثر
                 <ArrowLeft className="mr-2 w-5 h-5 inline-block" />
              </Button>
            </div>
          </div>

          {/* Image & Visual Content */}
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            {/* Responsive Container Size - Significantly reduced for laptop (lg) to prevent header overlap */}
            <div className="relative mx-auto max-w-xs lg:max-w-[18rem] xl:max-w-sm">
              
              {/* Main Image Frame - Interview Success */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 animate-in fade-in zoom-in-95 duration-700 bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent z-10 pointer-events-none"></div>
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Professional Interview Success" 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Element 1: Feedback Card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-xl p-4 w-56 lg:w-64 border border-gray-100 z-20 animate-in slide-in-from-bottom-8 delay-500 duration-700 hidden sm:block scale-90 lg:scale-[0.85] xl:scale-100 origin-bottom-left">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2 mb-2">
                  <div className="bg-accent/10 p-1.5 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">تقييم المقابلة</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>التقييم التقني</span>
                      <span className="font-bold text-green-600">ممتاز</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>التواصل الفعّال</span>
                      <span className="font-bold text-accent">9.5/10</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-accent h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Element 2: Hired Badge */}
              <div className="absolute -top-6 -right-6 bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg p-3 border border-slate-700 z-20 animate-in slide-in-from-top-8 delay-700 duration-700 flex items-center gap-3 transform hover:scale-105 transition-transform scale-90 lg:scale-[0.85] xl:scale-100 origin-top-right">
                 <div className="bg-green-500 p-2 rounded-lg shadow-lg shadow-green-500/20">
                    <Briefcase className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <p className="text-white font-bold text-base">تم القبول!</p>
                    <p className="text-xs text-gray-400">مبروك الوظيفة</p>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 text-gray-50 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;