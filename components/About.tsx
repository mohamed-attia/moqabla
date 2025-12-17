import React from 'react';
import { Video, FileText, TrendingUp, Award, MessageSquare, Users } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    title: 'محاكاة واقعية',
    description: 'نضعك في أجواء مقابلة حقيقية مع أسئلة متوقعة في تخصصك لكسر حاجز الرهبة والتوتر.',
    Icon: Video,
  },
  {
    title: 'تغذية راجعة احترافية',
    description: 'تحصل على تقرير مفصل يوضح نقاط قوتك والنقاط التي تحتاج إلى تطوير من خبراء تقنين في تخصصك.',
    Icon: FileText,
  },
  {
    title: 'تحليل الفجوات',
    description: 'نساعدك على معرفة ما ينقصك من مهارات تقنية أو شخصية لتناسب متطلبات سوق العمل الحالي.',
    Icon: TrendingUp,
  },
  {
    title: 'احصل على ترشيح وظيفي',
    description: 'عضويتك معنا تربطك بمرشحين (Referrers) في أفضل الشركات. نساعدك في إيصال سيرتك الذاتية إلى الأيدي الصحيحة.',
    Icon: Award,
  },
  {
    title: 'أسئلة المقابلات الجوهرية',
    description: 'صقل مهاراتك من خلال التدرب على المشكلات وحلول تفاعلية خطوة بخطوة لأكثر تحديات المقابلات التقنية شيوعاً.',
    Icon: MessageSquare,
  },
  {
    title: 'تدرب مع زملائك',
    description: 'التدريب يصنع الإتقان. ابنِ ثقتك بنفسك واحصل على تقييمات شخصية خلال جلسات المحاكاة اليومية مع زملاء وخبراء في الصناعة.',
    Icon: Users,
  },
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <span className="text-accent font-bold tracking-wider uppercase mb-2 block animate-in fade-in slide-in-from-bottom-2">
            لماذا تختارنا؟
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 animate-in fade-in slide-in-from-bottom-3">
            كل ما تحتاجه <span className="text-accent">لتتفوق</span> في مقابلتك
          </h2>
          <p className="text-gray-600 text-xl font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 leading-relaxed">
            نجمع لك الخبرة، الأدوات، والمجتمع في مكان واحد لضمان جاهزيتك التامة لأي مقابلة عمل.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300 shadow-sm">
                <feature.Icon className="w-8 h-8 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
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