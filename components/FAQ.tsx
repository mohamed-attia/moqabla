
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
      <button 
        className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-gray-800 flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-accent shrink-0" />
          {question}
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      question: "هل المقابلة مناسبة للمبتدئين؟",
      answer: "نعم، المقابلة يتم تخصيصها حسب مستواك وخبرتك."
    },
    {
      question: "هل المقابلات حقيقية أم مسجلة؟",
      answer: "المقابلات تتم بشكل مباشر (Live) عبر مكالمة فيديو مع خبير في مجالك، وليست مسجلة مسبقاً. هذا يضمن لك تجربة تفاعلية وواقعية تحاكي المقابلات الفعلية."
    },
    {
      question: "كيف يتم تحديد موعد المقابلة؟",
      answer: "بعد إتمام عملية التسجيل وسداد الرسوم، سيقوم فريق التنسيق بالتواصل معك خلال 24 ساعة لترتيب الموعد الأنسب لك وللخبير، مع مراعاة فارق التوقيت إذا كنت خارج المملكة."
    },
    {
      question: "هل يمكنني اختيار الخبير الذي سيقابلي؟",
      answer: "نقوم نحن باختيار الخبير الأنسب لك بناءً على تخصصك ومستواك المهني لضمان حصولك على أفضل تقييم ممكن. جميع خبرائنا يعملون في شركات تقنية كبرى ولديهم خبرة واسعة في التوظيف."
    },
    {
      question: "ماذا لو حدث طارئ ولم أستطع حضور المقابلة؟",
      answer: "يمكنك إعادة جدولة المقابلة مجاناً لمرة واحدة بشرط إبلاغنا قبل الموعد بـ 24 ساعة على الأقل. في حال التغيب بدون إشعار مسبق، قد تطبق سياسة الإلغاء."
    },
    {
      question: "هل التقرير النهائي يشمل نصائح للتحسين؟",
      answer: "نعم، ستحصل على تقرير شامل ومفصل يغطي المهارات التقنية (Hard Skills) والمهارات الشخصية (Soft Skills)، مع خطة عمل مقترحة ومصادر للتعلم لسد الفجوات الموجودة."
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">الأسئلة الشائعة</h1>
          <p className="text-gray-600 text-lg">
            إليك إجابات على أكثر الاستفسارات التي تصلنا.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
