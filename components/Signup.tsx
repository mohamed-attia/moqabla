import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, googleProvider, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Lock, User, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import Button from './Button';

const { useNavigate, Link } = ReactRouterDOM as any;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDomainError, setIsDomainError] = useState(false);

  const saveUserToFirestore = async (user: any, displayName: string) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: displayName,
        email: user.email,
        role: 'user',
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.error("Error saving user to firestore:", e);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsDomainError(false);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      await saveUserToFirestore(user, name);
      
      navigate('/');
    } catch (err: any) {
      console.error("Signup Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setIsDomainError(true);
        setError(`النطاق الحالي (${window.location.hostname}) غير مضاف في إعدادات Firebase.`);
      } else if (err.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مسجل مسبقاً.');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً (6 أحرف على الأقل).');
      } else {
        setError('حدث خطأ أثناء التسجيل. يرجى المحاولة لاحقاً.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsDomainError(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await saveUserToFirestore(user, user.displayName || 'Unknown');
      navigate('/');
    } catch (err: any) {
      console.error("Google Signup Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setIsDomainError(true);
        setError(`يجب إضافة ${window.location.hostname} إلى Authorized Domains في إعدادات Firebase.`);
      } else {
        setError('حدث خطأ أثناء التسجيل عبر Google.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary">إنشاء حساب جديد</h2>
          <p className="text-gray-500 text-sm mt-1">انضم إلينا وابدأ رحلة تطويرك المهني</p>
        </div>

        {error && (
          <div className={`p-4 rounded-xl mb-6 border ${isDomainError ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-600'}`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isDomainError ? <ShieldAlert className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{isDomainError ? 'خطأ في التهيئة' : 'خطأ في التسجيل'}</span>
            </div>
            <p className="text-sm">{error}</p>
            {isDomainError && (
              <div className="mt-3 text-xs bg-white/50 p-2 rounded-lg border border-amber-200">
                <p className="font-bold mb-1">المطور: يرجى إضافة هذا النطاق:</p>
                <code className="block bg-amber-100 p-1 mt-1 rounded text-center font-mono">{window.location.hostname}</code>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك بالكامل"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
              />
            </div>
          </div>

          <Button type="submit" className="w-full justify-center py-3 text-lg mt-4" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الحساب'}
          </Button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400">أو سجل عبر</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="mt-6 w-full flex justify-center items-center gap-3 px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all hover:border-gray-300"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="font-bold text-accent hover:text-accentHover underline decoration-2 underline-offset-4">
            سجل دخولك
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;