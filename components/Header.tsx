import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Briefcase, LogIn, User as UserIcon, ChevronDown, LogOut, FileText, LayoutDashboard, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import * as firebaseAuth from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Button from './Button';
import { NavItem } from '../types';

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
  const [user, setUser] = useState<firebaseAuth.User | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  
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
    
    // Auth Listener
    const unsubscribe = firebaseAuth.onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check Admin
        setIsAdmin(currentUser.email === 'dev.mohattia@gmail.com');

        // Check for active requests
        try {
          const q = query(
            collection(db, "registrations"), 
            where("userId", "==", currentUser.uid)
          );
          const snapshot = await getDocs(q);
          const hasActive = snapshot.docs.some(doc => {
            const data = doc.data();
            const status = data.status || 'pending';
            return ['pending', 'reviewing'].includes(status);
          });
          setHasActiveRequest(hasActive);
        } catch (error) {
          console.error("Error checking active requests", error);
        }
      } else {
        setIsAdmin(false);
        setHasActiveRequest(false);
      }
    });

    // Close profile menu on click outside
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

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileMenuOpen(false);
  }, [location]);

  // Handle Logout Toast Timer
  useEffect(() => {
    if (showLogoutToast) {
      const timer = setTimeout(() => setShowLogoutToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutToast]);

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
      // Do nothing
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
      await firebaseAuth.signOut(auth);
      setProfileMenuOpen(false);
      setShowLogoutToast(true);
      navigate('/');
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo Area */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation(navItems[0])}>
              <div className="bg-accent p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${scrolled || !isHome ? 'text-primary' : 'text-white'}`}>
                منصة مقابلة
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => {
                const isActive = item.id === 'team' && isTeam;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={`text-base lg:text-lg font-medium transition-colors ${
                      isActive 
                        ? 'text-accent'
                        : scrolled || !isHome
                          ? 'text-gray-600 hover:text-accent' 
                          : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              {isAdmin && (
                <Link
                  to="/dashboard"
                  className={`text-base lg:text-lg font-medium transition-colors flex items-center gap-1 ${
                    scrolled || !isHome ? 'text-accent hover:text-accentHover' : 'text-white hover:text-gray-200'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Link>
              )}
            </nav>

            {/* Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {!user ? (
                <button 
                  onClick={goToLogin}
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    scrolled || !isHome ? 'text-gray-600 hover:text-accent' : 'text-white hover:text-gray-200'
                  }`}
                >
                  <LogIn className="w-5 h-5" />
                  تسجيل دخول
                </button>
              ) : (
                <div className="relative" ref={profileMenuRef}>
                  <button 
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className={`flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition-all ${
                        scrolled || !isHome 
                          ? 'text-gray-600 hover:bg-gray-100' 
                          : 'text-white hover:bg-white/10'
                      }`}
                  >
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <UserIcon className={`w-5 h-5 ${scrolled || !isHome ? 'text-accent' : 'text-white'}`} />
                      </div>
                      <span>{user.displayName?.split(' ')[0] || 'زائر'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm text-gray-500">مرحباً</p>
                        <p className="font-bold text-gray-900 truncate">{user.displayName || user.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin && (
                          <Link 
                            to="/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-accent/5 hover:text-accent rounded-lg transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            لوحة التحكم
                          </Link>
                        )}
                        <Link 
                          to="/my-requests"
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-accent/5 hover:text-accent rounded-lg transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FileText className="w-4 h-4" />
                          طلباتي
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!hasActiveRequest && (
                <Button variant={scrolled || !isHome ? 'primary' : 'white'} onClick={handleBookingAction}>
                  احجز مقابلة
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? 
                <X className={`w-8 h-8 ${scrolled || !isHome ? 'text-primary' : 'text-white'}`} /> : 
                <Menu className={`w-8 h-8 ${scrolled || !isHome ? 'text-primary' : 'text-white'}`} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 origin-top transform ${
            isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'
          }`}
        >
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => {
              const isActive = item.id === 'team' && isTeam;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`text-right font-medium text-lg py-2 border-b border-gray-50 px-2 rounded transition-colors ${
                    isActive ? 'text-accent bg-gray-50' : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            {isAdmin && (
               <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-right font-medium text-lg py-2 border-b border-gray-50 px-2 rounded transition-colors text-gray-700 hover:text-accent hover:bg-gray-50"
                >
                  لوحة التحكم
                </Link>
            )}
            <div className="pt-2 flex flex-col gap-3">
              {!user ? (
                <button 
                  onClick={goToLogin}
                  className="text-center font-medium text-gray-700 hover:text-accent py-2"
                >
                  تسجيل دخول
                </button>
              ) : (
                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                      <UserIcon className="w-5 h-5 text-accent" />
                      <span className="font-bold text-gray-800">{user.displayName || 'المستخدم'}</span>
                  </div>
                  <Link 
                    to="/my-requests" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-2 text-gray-700 hover:text-accent"
                  >
                      <FileText className="w-4 h-4" />
                      طلباتي
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 text-red-600 hover:text-red-700 w-full text-right"
                  >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                  </button>
                </div>
              )}
              {!hasActiveRequest && (
                <Button className="w-full justify-center" onClick={handleBookingAction}>
                  احجز مقابلة
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Toast */}
      <div 
        className={`fixed bottom-6 right-6 z-[60] bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-500 transform ${
          showLogoutToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div className="bg-green-500 rounded-full p-1">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <p className="font-medium">تم تسجيل الخروج بنجاح</p>
      </div>
    </>
  );
};

export default Header;