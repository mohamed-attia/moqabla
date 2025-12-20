
import React from 'react';
import { FileEdit, Clock, CalendarCheck, ArrowLeft } from 'lucide-react';
import { FeatureItem } from '../types';

const steps: FeatureItem[] = [
  {
    title: 'سجّل طلبك',
    description: 'ابدأ بتعبئة النموذج بمعلوماتك المهنية لنفهم احتياجاتك ونحدد الخبير المناسب لك بدقة.',
    Icon: FileEdit,
  },
  {
    title: 'استجابة سريعة',
    description: 'يقوم فريقنا بدراسة طلبك والرد عليك خلال 24 ساعة عمل كحد أقصى لتأكيد التفاصيل وحجز الموعد.',
    Icon: Clock,
  },
  {
    title: 'ابدأ المقابلة',
    description: 'بمجرد تأكيد عملية التحويل، نثبّت موعدك النهائي ونجدول مقابلتك في الوقت الذي يناسبك لتبدأ رحلة التطوير المهني مباشرة.',
    Icon: CalendarCheck,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-accent font-bold tracking-wider uppercase mb-2 block">رحلة نجاحك</span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
            خطواتك نحو <span className="text-accent">الاحتراف</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            إجراءات بسيطة وسريعة تفصلك عن وظيفة أحلامك. صممنا العملية لتكون سلسة وفعالة لتبدأ التدريب في أقرب وقت.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gray-100 -z-10 translate-y-1/2 w-2/3 mx-auto"></div>

          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step Icon */}
              <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center mb-6 shadow-sm group-hover:border-accent/20 group-hover:shadow-lg transition-all duration-300 relative z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <step.Icon className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
                {/* Step Number Badge */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-accent transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                {step.description}
              </p>

              {/* Mobile Arrow (Visual Cue) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden mt-8 text-gray-200">
                  <ArrowLeft className="w-6 h-6 rotate-[-90deg]" />
                </div>
              )}
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;
