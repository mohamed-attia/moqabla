import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import CreateMeetingRequest from './components/CreateMeetingRequest';
import MeetingRequests from './components/MeetingRequests';
import UserRequests from './components/UserRequests';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import FAQ from './components/FAQ';
import Team from './components/Team';
import Dashboard from './components/Dashboard/Dashboard';

// Layout component to handle conditional rendering of Header/Footer if needed
// or just to wrap the main content
const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request-meeting" element={<CreateMeetingRequest />} />
          <Route path="/meeting-requests" element={<MeetingRequests />} />
          <Route path="/my-requests" element={<UserRequests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/team" element={<Team />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {/* Hide footer on Dashboard to give more space */}
      {!isDashboard && <Footer />}
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