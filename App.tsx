import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Footer from './components/Footer';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import FAQ from './components/FAQ';

// Layout component to handle conditional rendering of Header/Footer if needed
// or just to wrap the main content
const Layout = () => {
  const location = useLocation();
  // We might want a different header for the register page, but for now we keep the same one
  
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </main>
      {/* Show footer everywhere except register page if desired, or keep it everywhere. 
          Current logic hides it on register page based on previous user flow, 
          let's enable it everywhere or stick to the rule. 
          Usually legal pages need footer. 
      */}
      {location.pathname !== '/register' && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}

export default App;