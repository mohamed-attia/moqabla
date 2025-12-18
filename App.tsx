
import React from 'react';
// Use namespace import to bypass named export resolution issues in the current environment
import * as ReactRouterDOM from 'react-router-dom';
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
import Profile from './components/Profile';

// Fix: Use type assertion to bypass broken react-router-dom type definitions
const { HashRouter, Routes, Route, useLocation } = ReactRouterDOM as any;

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/team" element={<Team />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
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
