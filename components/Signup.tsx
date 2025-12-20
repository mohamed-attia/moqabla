
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, googleProvider, db } from '../lib/firebase';
// Fix: Use namespace import for FirebaseAuth to bypass named export resolution issues
import * as FirebaseAuth from 'firebase/auth';
const { createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendEmailVerification, onAuthStateChanged } = FirebaseAuth as any;
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where, getDoc } from 'firebase/firestore';
import { Mail, Lock, User, AlertCircle, Loader2, UserPlus, LogIn } from 'lucide-react';
import Button from './Button';

const { useNavigate, Link, useLocation } = ReactRouterDOM as any;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<{msg: string, code?: string} | null>(null);
  const [referralFromUrl, setReferralFromUrl] = useState<string | null>(null);
  const [isReferrerValid, setIsReferrerValid] = useState<boolean>(false);
  const [referrerUid, setReferrerUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        navigate('/', { replace: true });
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const search = location.search || window.location.hash.split('?')[1];
    const params = new URLSearchParams(search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralFromUrl(refCode);
      const checkReferrer = async () => {
        try {
          const q = query(collection(db, "users"), where("referralCode", "==", refCode));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setIsReferrerValid(true);
            setReferrerUid(snap.docs[0].id);
          }
        } catch (e) {}
      };
      checkReferrer();
    }
  }, [location]);

  const saveUserToFirestore = async (user: any, displayName: string) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) return;

      const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
      const referralCode = `${(displayName || 'USER').split(' ')[0].substring(0, 4).toUpperCase()}${randomStr}`;

      await setDoc(userDocRef, {
        uid: user.uid,
        name: displayName,
        email: user.email,
        role: 'user',
        isEmailVerified: user.emailVerified || false,
        referralCode: referralCode,
        referralCount: 0,
        referredUsers: [],
        referredBy: isReferrerValid ? referrerUid : null,
        referralProcessed: false,
        createdAt: serverTimestamp(),
      });

      if (!user.emailVerified) await sendEmailVerification(user);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await saveUserToFirestore(result.user, name);
      navigate('/profile?verify=sent');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError({ msg: "هذا البريد مسجل مسبقاً في نظامنا.", code: 'email-in-use' });
      } else {
        setError({ msg: "حدث خطأ أثناء إنشاء الحساب." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user, result.user.displayName || 'User');
      navigate('/profile');
    } catch (err: any) {
      setError({ msg: "حدث خطأ أثناء التسجيل عبر Google." });
    }
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-accent animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-primary">إنشاء حساب جديد</h2>
          {referralFromUrl && isReferrerValid && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-bold border border-emerald-100">
              <UserPlus className="w-3.5 h-3.5" /> تم تفعيل رابط الدعوة
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl mb-6 text-sm">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-5 h-5" /> {error.msg}
            </div>
            {error.code === 'email-in-use' && (
              <div className="mt-3">
                <p className="text-xs mb-3">ربما قمت بالتسجيل سابقاً؟ يمكنك تسجيل الدخول مباشرة أو استعادة كلمة المرور.</p>
                <Link to="/login" className="flex items-center justify-center gap-2 py-2 bg-white border border-red-200 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors">
                  <LogIn className="w-4 h-4" /> سجل دخولك بدلاً من ذلك
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 mr-2">الاسم</label>
            <div className="relative">
              <User className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-accent" placeholder="الاسم الكامل" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 mr-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-accent" placeholder="email@example.com" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 mr-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-accent" placeholder="••••••••" />
            </div>
          </div>
          <Button type="submit" className="w-full py-4 text-lg rounded-2xl shadow-accent/20" disabled={loading}>
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'إنشاء الحساب والتفعيل'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
           <div className="h-px bg-gray-100 flex-grow"></div>
           <span className="text-gray-400 text-xs">أو التسجيل عبر</span>
           <div className="h-px bg-gray-100 flex-grow"></div>
        </div>

        <button onClick={handleGoogleSignup} className="mt-4 w-full py-3 px-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google (تفعيل تلقائي)
        </button>
        
        <p className="mt-8 text-center text-sm text-gray-500">لديك حساب بالفعل؟ <Link to="/login" className="font-bold text-accent hover:underline">تسجيل دخول</Link></p>
      </div>
    </div>
  );
};

export default Signup;
