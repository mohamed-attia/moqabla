import React from 'react';
import { Users, FileText, TrendingUp } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    title: 'محاكاة واقعية',
    description: 'نضعك في أجواء مقابلة حقيقية مع أسئلة متوقعة في تخصصك لكسر حاجز الرهبة والتوتر.',
    Icon: Users,
  },
  {
    title: 'تغذية راجعة احترافية',
    description: 'تحصل على تقرير مفصل يوضح نقاط قوتك والنقاط التي تحتاج إلى تطوير من خبراء الموارد البشرية.',
    Icon: FileText,
  },
  {
    title: 'تحليل الفجوات',
    description: 'نساعدك على معرفة ما ينقصك من مهارات تقنية أو شخصية لتناسب متطلبات سوق العمل الحالي.',
    Icon: TrendingUp,
  },
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">كيف نساعدك؟</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            نقدم لك تجربة متكاملة تتجاوز مجرد النصائح العامة. خدماتنا مصممة بدقة لرفع جاهزيتك التامة لأي مقابلة عمل.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <feature.Icon className="w-8 h-8 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;