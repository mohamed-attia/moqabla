import React, { useEffect } from 'react';
import { FileText, Shield, Clock, CreditCard, AlertTriangle, Briefcase } from 'lucide-react';

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 flex items-center gap-3">
          <FileText className="w-10 h-10 text-accent" />
          شروط الاستخدام
        </h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8 text-gray-700 leading-relaxed border border-gray-100">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
              وصف الخدمة
            </h2>
            <p className="mr-10 text-gray-600">
              منصة "مقابلة" تقدم خدمات محاكاة للمقابلات الوظيفية، مراجعة السير الذاتية، وتقديم تقارير تقييمية للأداء. 
              هدفنا هو مساعدة الباحثين عن عمل في تحسين مهاراتهم، ولكننا لا نضمن الحصول على وظيفة بعد استخدام الخدمة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
              سياسة الدفع والاسترجاع
            </h2>
            <ul className="list-disc list-inside mr-10 space-y-2 text-gray-600">
              <li>يتم دفع رسوم الجلسة كاملة مسبقاً لتأكيد الحجز.</li>
              <li>يمكن استرداد المبلغ بالكامل في حال إلغاء الطلب قبل 24 ساعة من الموعد المحدد.</li>
              <li>لا يحق للمستخدم المطالبة باسترداد المبلغ إذا تم الإلغاء قبل أقل من 24 ساعة من الموعد، أو في حال عدم حضور الجلسة دون عذر مقبول.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">3</span>
              سياسة الجدولة والمواعيد
            </h2>
            <div className="mr-10 space-y-2 text-gray-600">
              <p>يتم تنسيق المواعيد بناءً على توفر الخبراء. يحق للمستخدم طلب إعادة جدولة الموعد لمرة واحدة مجاناً بشرط الإشعار قبل 12 ساعة على الأقل.</p>
              <p>في حال تأخر المستخدم عن حضور الجلسة لأكثر من 15 دقيقة، يعتبر الموعد لاغياً ولا يحق له الاسترداد.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">4</span>
              مسؤوليات المستخدم
            </h2>
            <p className="mr-10 text-gray-600">
              يتعهد المستخدم بتقديم معلومات صحيحة ودقيقة (مثل الخبرة والمهارات) لضمان جودة التقييم. كما يلتزم بالسلوك المهني واللائق خلال جلسات المقابلة. أي سلوك مسيء قد يؤدي إلى إنهاء الخدمة فوراً دون استرداد للمبلغ.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm">5</span>
              الخصوصية واستخدام البيانات
            </h2>
            <p className="mr-10 text-gray-600">
              نحن نحترم خصوصيتك. جميع البيانات التي تشاركها معنا (السيرة الذاتية، التسجيلات، الملاحظات) يتم التعامل معها بسرية تامة وتستخدم فقط لغرض تقديم الخدمة وتحسين الجودة. لن نقوم بمشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية دون موافقتك الصريحة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">6</span>
              الموافقة على مشاركة البيانات والتوظيف
            </h2>
            <p className="mr-10 text-gray-600 font-bold">
              باستخدامك للمنصة، فإنك توافق على مشاركة سيرتك الذاتية وبياناتك المهنية مع شركات القطاع التقني والشركاء بهدف توفير فرص عمل ومقابلات حقيقية لك. نحن نعمل كحلقة وصل لتعزيز فرصك في الحصول على الوظيفة المناسبة لمستواك التقني.
            </p>
          </section>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-500">
            تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;