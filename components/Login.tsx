
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Lock, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import Button from './Button';

const { useNavigate, Link } = ReactRouterDOM as any;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/', { replace: true });
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const syncUserProfile = async (user: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      
      // إذا كان المستخدم موجوداً في Auth ولكن الأدمن حذف بياناته من Firestore
      if (!snap.exists()) {
        const cleanName = (user.displayName || user.email?.split('@')[0] || 'User').split(' ')[0].toUpperCase();
        const referralCode = `${cleanName}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || 'مستخدم جديد',
          email: user.email,
          role: 'user',
          isEmailVerified: user.emailVerified || false,
          referralCode: referralCode,
          referralCount: 0,
          referredUsers: [],
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error("Error syncing profile on login:", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncUserProfile(result.user);
      navigate('/');
    } catch (err: any) {
      setError('خطأ في تسجيل الدخول. تأكد من صحة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(result.user);
      navigate('/');
    } catch (err: any) {
      setError('حدث خطأ أثناء تسجيل الدخول عبر Google.');
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-primary">مرحباً بك مجدداً</h2>
          <p className="text-gray-500 text-sm mt-1">سجل دخولك لمتابعة طلباتك</p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl mb-6 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 mr-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-accent" placeholder="email@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 mr-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-accent" placeholder="••••••••" />
            </div>
          </div>
          <Button type="submit" className="w-full py-3.5 rounded-2xl text-lg shadow-accent/20" disabled={loading}>
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'تسجيل الدخول'}
          </Button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs text-gray-400"><span className="px-4 bg-white">أو عبر</span></div>
        </div>

        <button onClick={handleGoogleLogin} className="mt-6 w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">ليس لديك حساب؟ <Link to="/signup" className="font-bold text-accent hover:underline">أنشئ حساباً الآن</Link></p>
      </div>
    </div>
  );
};

export default Login;
