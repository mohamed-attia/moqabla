
import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // تحديث عنوان الصفحة
    const defaultTitle = 'منصة مقابلة | تدريب احترافي على المقابلات الوظيفية';
    document.title = title ? `${title} | منصة مقابلة` : defaultTitle;

    // تحديث وصف الصفحة
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'منصة مقابلة تساعدك على اجتياز المقابلات التقنية والسلوكية من خلال جلسات محاكاة واقعية مع خبراء.');
    }

    // تحديث الكلمات المفتاحية
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || 'مقابلات وظيفية، تدريب، برمجة، توظيف');
    }
  }, [title, description, keywords]);

  return null; // مكون وظيفي لا يرسم شيئاً في الواجهة
};

export default SEO;
