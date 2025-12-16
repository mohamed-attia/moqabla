import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Footer from './components/Footer';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import FAQ from './components/FAQ';
import Team from './components/Team';
import RegistrationsList from './components/RegistrationsList';

// Layout component to handle conditional rendering of Header/Footer if needed
// or just to wrap the main content
const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/team" element={<Team />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/registrations" element={<RegistrationsList />} />
        </Routes>
      </main>
      <Footer />
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