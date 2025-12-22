
import React from 'react';
import { Target, MessageSquare, Users, BookOpen, Video, Award } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: "افهم ما يبحث عنه المحاورون",
    description: "دوراتنا مبنية على رؤى من أكثر من 2000 مقابلة، توفر لك كل ما تحتاجه للنجاح: معايير التقييم، أمثلة واقعية، مفاهيم أساسية، ونصائح الخبراء من كبرى الشركات التقنية."
  },
  {
    icon: MessageSquare,
    title: "أسئلة المقابلات الجوهرية",
    description: "صقل مهاراتك من خلال التدرب على المشكلات وحلول تفاعلية خطوة بخطوة لأكثر تحديات المقابلات التقنية شيوعاً."
  },
  {
    icon: Users,
    title: "وسع شبكة علاقاتك",
    description: "انضم إلى مجتمعنا الحصري من المحترفين لتبادل النصائح، اكتساب رؤى جديدة، وبناء علاقات تفتح لك أبواباً وظيفية جديدة."
  },
  {
    icon: Video,
    title: "معلومات من قلب الحدث",
    description: "ادخل إلى قاعدة بياناتنا التي تضم آلاف الأسئلة المؤكدة والمحدثة لحظياً. شاهد أكثر من 350 ساعة من الإجابات النموذجية بالفيديو لتعرف ما ينجح حقاً."
  },
  {
    icon: BookOpen,
    title: "إطار مهني لتبادل الخبرات",
    description: "يعتمد على تفاعل مباشر بين الخبراء والمتقدمين، مع توثيق الملاحظات ."
  },
  {
    icon: Award,
    title: "احصل على ترشيح وظيفي",
    description: "عضويتك معنا تربطك بمرشحين (Referrers) في أفضل الشركات. نساعدك في إيصال سيرتك الذاتية إلى الأيدي الصحيحة."
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-accent font-bold tracking-wider uppercase mb-2 block">لماذا تختارنا؟</span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
            كل ما تحتاجه <span className="text-accent">لتتفوق</span> في مقابلتك
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            نجمع لك الخبرة، الأدوات، والمجتمع في مكان واحد لضمان جاهزيتك التامة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <item.icon className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
