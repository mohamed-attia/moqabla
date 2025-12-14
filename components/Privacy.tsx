import React, { useEffect } from 'react';

const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">سياسة الخصوصية</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg">
            نحن في "مقابلة" نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية.
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">ما هي المعلومات التي نجمعها؟</h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف.</li>
              <li>المعلومات المهنية: المسمى الوظيفي، سنوات الخبرة، رابط حساب LinkedIn.</li>
              <li>معلومات الدفع: تتم معالجتها عبر بوابات دفع آمنة ولا نقوم بتخزين تفاصيل بطاقتك الائتمانية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">كيف نستخدم معلوماتك؟</h2>
            <p>
              نستخدم المعلومات لتقديم خدماتنا، التواصل معك بخصوص المواعيد، تحسين تجربة المستخدم، وإرسال تحديثات هامة حول الخدمة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">حماية البيانات</h2>
            <p>
              نطبق إجراءات أمنية صارمة لحماية معلوماتك من الوصول غير المصرح به. يتم تشفير البيانات الحساسة وتخزينها على خوادم آمنة (Firebase).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">مشاركة البيانات</h2>
            <p>
              لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث. قد نشارك بعض البيانات الضرورية فقط مع مزودي الخدمات (مثل معالجة المدفوعات) لضمان تقديم الخدمة.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;