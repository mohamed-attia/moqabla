
import React from 'react';
import Hero from './Hero';
import About from './About';
import HowItWorks from './HowItWorks';
import Pricing from './Pricing';
import Vision from './Vision';
import SEO from './SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO 
        title="الرئيسية" 
        description="استعد لمقابلتك القادمة مع خبراء تقنيين. منصة مقابلة توفر لك جلسات محاكاة وتقارير تقييمية شاملة لتطوير مهاراتك واقتناص فرص العمل."
      />
      <Hero />
      <About />
      <HowItWorks />
      <Pricing />
      <Vision />
    </>
  );
};

export default Home;
