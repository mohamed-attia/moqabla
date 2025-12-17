import React from 'react';
import Hero from './Hero';
import About from './About';
import HowItWorks from './HowItWorks';
import Pricing from './Pricing';
import Vision from './Vision';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Pricing />
      <Vision />
    </>
  );
};

export default Home;