
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';
import Button from './Button';
import { auth, db } from '../lib/firebase';
import * as FirebaseAuth from 'firebase/auth';
const { onAuthStateChanged } = FirebaseAuth as any;
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

const { Link, useNavigate, useLocation } = ReactRouterDOM as any;

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [user, setUser] = useState<any>(null);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubscribeSnapshot: any = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const userData = userDoc.data();
          const role = userData?.role;
          setIsAdmin(role === 'admin' || role === 'maintainer' || role === 'interviewer');
        } catch (e) { setIsAdmin(false); }
        
        const q = query(
          collection(db, "registrations"), 
          where("userId", "==", currentUser.uid)
        );

        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const hasActive = snapshot.docs.some(doc => {
            const status = doc.data().status || 'pending';
            return ['pending', 'reviewing', 'approved'].includes(status);
          });
          setHasActiveRequest(hasActive);
        });
      } else {
        setHasActiveRequest(false);
        setIsAdmin(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const handleNavigation = (id: string) => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBookingAction = () => {
    if (!user) {
      navigate('/login');
    } else if (hasActiveRequest && !isAdmin) {
      navigate('/my-requests');
    } else {
      navigate('/request-meeting');
    }
  };

  const shouldShowBookingCTA = !user || isAdmin || !hasActiveRequest;

  return (
    <footer id="contact" className="bg-secondary text-gray-300 mt-28">
      {shouldShowBookingCTA && (
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="bg-accent rounded-2xl p-8 md:p-12 absolute -top-16 left-4 right-4 md:left-6 md:right-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">هل أنت مستعد لمقابلتك القادمة؟</h3>
              <p className="text-teal-100">احجز جلستك الآن واستثمر في مستقبلك المهني.</p>
            </div>
            <Button variant="white" className="whitespace-nowrap w-full md:w-auto text-accent" onClick={handleBookingAction}>
              احجز موعدك الآن
            </Button>
          </div>
        </div>
      )}

      <div className={`pt-40 pb-12 container mx-auto px-4 md:px-6 ${!shouldShowBookingCTA ? 'pt-20' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-8">
          
          <div className="md:col-span-1">
            <h4 className="text-2xl font-bold text-white mb-6">مقابلة</h4>
            <p className="text-gray-400 leading-relaxed mb-6">
              منصتك الأولى للتدريب على المقابلات الوظيفية وتطوير المهارات الشخصية.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/%D9%85%D9%86%D8%B5%D8%A9-%D9%85%D9%82%D8%A7%D8%A8%D9%84%D8%A9-84a22139b/" className="hover:text-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-accent transition-colors">الرئيسية</Link></li>
              <li><button onClick={() => handleNavigation('about')} className="hover:text-accent transition-colors text-right">عن الخدمة</button></li>
              <li><button onClick={() => handleNavigation('how-it-works')} className="hover:text-accent transition-colors text-right">خطوات التسجيل</button></li>
              <li><button onClick={() => handleNavigation('vision')} className="hover:text-accent transition-colors text-right">رؤيتنا</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">الدعم</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="hover:text-accent transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/privacy" className="hover:text-accent transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="/terms" className="hover:text-accent transition-colors">شروط الاستخدام</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="dir-ltr">contact@moqabala.info</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="dir-ltr">01208103962</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span>الوطن العربي</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} منصة مقابلة. جميع الحقوق محفوظة. ( المنصة تحت التجهيز والإعداد )
        </div>
      </div>
    </footer>
  );
};

export default Footer;
