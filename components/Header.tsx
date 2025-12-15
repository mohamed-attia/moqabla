import React, { useState, useEffect } from 'react';
import { Menu, X, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'about', label: 'عن الخدمة' },
  { id: 'team', label: 'نُخبة المقابلين', isPage: true },
  { id: 'how-it-works', label: 'خطوات التسجيل' },
  { id: 'vision', label: 'رؤيتنا' },
  { id: 'contact', label: 'تواصل معنا' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isTeam = location.pathname === '/team';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (item: NavItem) => {
    setIsOpen(false);
    
    if (item.isPage) {
      navigate(`/${item.id}`);
      return;
    }

    if (!isHome) {
      navigate('/');
      // Timeout to allow navigation to complete before scrolling
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

  const goToRegister = () => {
    navigate('/register');
    setIsOpen(false);
  };

  return (
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
            {/* Logic: If scrolled OR not home -> Primary color. Else (Top of Home) -> White (for both mobile and desktop) */}
            <span className={`text-2xl font-bold ${scrolled || !isHome ? 'text-primary' : 'text-white'}`}>
              منصة مقابلة
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = item.id === 'team' && isTeam;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`text-lg font-medium transition-colors ${
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
          </nav>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Button variant={scrolled || !isHome ? 'primary' : 'white'} onClick={goToRegister}>
              احجز مقابلة
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {/* Toggle icon color based on background state */}
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
          <div className="pt-2">
            <Button className="w-full justify-center" onClick={goToRegister}>
              احجز مقابلة
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;