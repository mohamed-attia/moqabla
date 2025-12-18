import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Briefcase, LogIn, User as UserIcon, ChevronDown, LogOut, FileText, LayoutDashboard, UserCircle } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Button from './Button';
import { NavItem } from '../types';

const { useNavigate, useLocation, Link } = ReactRouterDOM as any;

const navItems: NavItem[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'about', label: 'عن الخدمة' },
  { id: 'how-it-works', label: 'خطوات التسجيل' },
  { id: 'pricing', label: 'الأسعار' },
  { id: 'team', label: 'نُخبة المقابلين', isPage: true },
  { id: 'vision', label: 'رؤيتنا' },
  { id: 'contact', label: 'تواصل معنا' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === '/';
  const isTeam = location.pathname === '/team';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(currentUser.email === 'dev.mohattia@gmail.com');

        try {
          const q = query(
            collection(db, "registrations"), 
            where("userId", "==", currentUser.uid),
            limit(10)
          );
          const snapshot = await getDocs(q);
          // تعديل: الحجز يتوقف فقط إذا كان الطلب "قيد الانتظار" أو "قيد المراجعة"
          const hasActive = snapshot.docs.some(doc => {
            const data = doc.data();
            const status = data.status || 'pending';
            return ['pending', 'reviewing'].includes(status);
          });
          setHasActiveRequest(hasActive);
        } catch (error) {
          console.error("Error checking active requests", error);
          setHasActiveRequest(false);
        }
      } else {
        setIsAdmin(false);
        setHasActiveRequest(false);
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileMenuOpen(false);
  }, [location]);

  const handleNavigation = (item: NavItem) => {
    setIsOpen(false);
    if (item.isPage) {
      navigate(`/${item.id}`);
      return;
    }
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(item.id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (item.id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBookingAction = () => {
    setIsOpen(false);
    if (!user) {
      navigate('/login');
    } else if (hasActiveRequest) {
      navigate('/my-requests');
    } else {
      navigate('/request-meeting');
    }
  };

  const goToLogin = () => {
    navigate('/login');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-accent p-2 rounded-lg"><Briefcase className="w-6 h-6 text-white" /></div>
            <span className={`text-2xl font-bold ${scrolled || !isHome ? 'text-primary' : 'text-white'}`}>منصة مقابلة</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleNavigation(item)} className={`text-base lg:text-lg font-medium transition-colors ${item.id === 'team' && isTeam ? 'text-accent' : scrolled || !isHome ? 'text-gray-600 hover:text-accent' : 'text-gray-200 hover:text-white'}`}>{item.label}</button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <button onClick={goToLogin} className={`flex items-center gap-2 font-medium transition-colors ${scrolled || !isHome ? 'text-gray-600 hover:text-accent' : 'text-white hover:text-gray-200'}`}><LogIn className="w-5 h-5" />تسجيل دخول</button>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className={`flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition-all ${scrolled || !isHome ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center"><UserIcon className={`w-5 h-5 ${scrolled || !isHome ? 'text-accent' : 'text-white'}`} /></div>
                  <span className="max-w-[100px] truncate">{user.displayName?.split(' ')[0] || 'زائر'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 text-right"><p className="text-xs text-gray-500">مرحباً بك</p><p className="font-bold text-gray-900 truncate">{user.displayName || user.email}</p></div>
                    <div className="p-2 text-right">
                      {isAdmin && <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-accent/5 hover:text-accent rounded-lg transition-colors" onClick={() => setProfileMenuOpen(false)}><LayoutDashboard className="w-4 h-4" />لوحة التحكم</Link>}
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-accent/5 hover:text-accent rounded-lg transition-colors" onClick={() => setProfileMenuOpen(false)}><UserCircle className="w-4 h-4" />بياناتي</Link>
                      <Link to="/my-requests" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-accent/5 hover:text-accent rounded-lg transition-colors" onClick={() => setProfileMenuOpen(false)}><FileText className="w-4 h-4" />طلباتي</Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-right"><LogOut className="w-4 h-4" />تسجيل الخروج</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* إخفاء الزر إذا كان هناك طلب نشط للمستخدم العادي */}
            {(!user || (!hasActiveRequest && !isAdmin)) && (
              <Button variant={scrolled || !isHome ? 'primary' : 'white'} onClick={handleBookingAction}>احجز مقابلة</Button>
            )}
          </div>
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">{isOpen ? <X className={`w-8 h-8 ${scrolled || !isHome ? 'text-primary' : 'text-white'}`} /> : <Menu className={`w-8 h-8 ${scrolled || !isHome ? 'text-primary' : 'text-white'}`} />}</button>
        </div>
      </div>
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 origin-top transform ${isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'}`}>
        <div className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNavigation(item)} className="text-right font-medium text-lg py-3 border-b border-gray-50 px-2 rounded hover:bg-gray-50 text-gray-700">{item.label}</button>
          ))}
          {user && (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg text-lg font-medium border-b border-gray-50"><UserCircle className="w-5 h-5 text-accent" />بياناتي</Link>
              <Link to="/my-requests" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg text-lg font-medium border-b border-gray-50"><FileText className="w-5 h-5 text-accent" />طلباتي</Link>
              {isAdmin && <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg text-lg font-medium border-b border-gray-50"><LayoutDashboard className="w-5 h-5 text-accent" />لوحة التحكم</Link>}
            </>
          )}
          <div className="pt-4 flex flex-col gap-3">
            {!user ? <Button onClick={goToLogin} className="w-full justify-center">تسجيل دخول</Button> : (
              <>
                {(!hasActiveRequest && !isAdmin) && <Button onClick={handleBookingAction} className="w-full justify-center">احجز مقابلة</Button>}
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 p-3 text-red-600 font-bold border border-red-100 rounded-lg bg-red-50"><LogOut className="w-5 h-5" />تسجيل الخروج</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;