
import React, { useState, useEffect } from 'react';
// Use namespace import to bypass named export resolution issues
import * as ReactRouterDOM from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Users, FileText, LayoutDashboard, MessageSquareQuote } from 'lucide-react';
import UsersTab from './UsersTab';
import MeetingRequests from '../MeetingRequests';
import ReviewsTab from './ReviewsTab';

// Fix: Use type assertion to bypass broken react-router-dom type definitions
const { useNavigate } = ReactRouterDOM as any;

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'reviews'>('users');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'dev.mohattia@gmail.com') {
        setIsAdmin(true);
      } else {
        navigate('/'); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return null;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-accent" />
              لوحة التحكم
            </h1>
            <p className="text-gray-500 mt-1">إدارة المستخدمين وطلبات المقابلات والتقييمات</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 inline-flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            المستخدمين
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            طلبات المقابلات
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            التقييمات
          </button>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'users' && <UsersTab />}
          
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 md:p-4">
               <div className="dashboard-embedded">
                 <MeetingRequests />
               </div>
               <style>{`
                 .dashboard-embedded .pt-24 { padding-top: 1rem !important; }
                 .dashboard-embedded .min-h-screen { min-height: auto !important; }
                 .dashboard-embedded .container { padding: 0 !important; max-width: 100% !important; }
               `}</style>
            </div>
          )}

          {activeTab === 'reviews' && <ReviewsTab />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
