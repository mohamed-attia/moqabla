import React from 'react';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-slate-800 z-0">
         {/* Abstract shapes for visual interest */}
         <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center md:text-right">
        <div className="max-w-4xl mx-auto md:mr-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6 backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <span className="text-sm font-semibold text-white">ابدأ مسارك المهني الآن</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            <span className="block mb-4">أتقن مهارات</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-400 to-emerald-400">
              المقابلة الوظيفية
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            لا تترك وظيفة أحلامك للصدفة. احصل على تجربة محاكاة واقعية مع خبراء التوظيف، واكتشف نقاط قوتك ومجالات التحسين قبل المقابلة الحقيقية.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-16">
            <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              احجز موعد الآن
            </Button>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-slate-900" 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
               تعرف علينا أكثر
               <ArrowLeft className="mr-2 w-5 h-5 inline-block" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 text-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;