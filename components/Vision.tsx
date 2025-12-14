import React from 'react';
import { Target, Award, Globe, Rocket } from 'lucide-react';
import { VisionItem } from '../types';

const visionItems: VisionItem[] = [
  {
    title: 'التمكين',
    description: 'تمكين الشباب من الأدوات اللازمة للنجاح.',
    Icon: Rocket,
  },
  {
    title: 'التميز',
    description: 'رفع معايير الأداء في المقابلات الوظيفية.',
    Icon: Award,
  },
  {
    title: 'الوضوح',
    description: 'رسم مسار وظيفي واضح لكل مرشح.',
    Icon: Target,
  },
  {
    title: 'الوصول',
    description: 'إتاحة المعرفة المهنية للجميع في كل مكان.',
    Icon: Globe,
  },
];

const Vision: React.FC = () => {
  return (
    <section id="vision" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 relative inline-block">
              رؤيتنا
              <span className="absolute bottom-2 left-0 w-full h-3 bg-accent/20 -z-10"></span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              نؤمن بأن الكفاءة وحدها لا تكفي، بل طريقة عرضها هي المفتاح. نسعى لأن نكون الشريك الأول لكل باحث عن عمل يطمح للتميز.
            </p>
            <div className="h-1 w-20 bg-accent rounded-full"></div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {visionItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="shrink-0 bg-gray-50 p-3 rounded-full shadow-sm group-hover:bg-white">
                    <item.Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Vision;