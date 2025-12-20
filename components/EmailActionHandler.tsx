
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import * as FirebaseAuth from 'firebase/auth';
const { applyActionCode, verifyPasswordResetCode, confirmPasswordReset, reload, signOut } = FirebaseAuth as any;
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { MailCheck, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Lock, ShieldCheck, LogIn } from 'lucide-react';
import Button from './Button';

const { useSearchParams, useNavigate } = ReactRouterDOM as any;

const EmailActionHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'reset-password'>('loading');
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus('error');
      setMessage('الرابط غير صالح أو منتهي الصلاحية.');
      return;
    }

    switch (mode) {
      case 'verifyEmail':
        handleVerifyEmail(oobCode);
        break;
      case 'resetPassword':
        setStatus('reset-password');
        break;
      default:
        setStatus('error');
        setMessage('عملية غير معروفة.');
    }
  }, [mode, oobCode]);

  const handleVerifyEmail = async (code: string) => {
    try {
      // 1. تفعيل الكود في Firebase Auth
      await applyActionCode(auth, code);

      // 2. تحديث حالة المستخدم في Firestore إذا كان مسجلاً دخوله
      if (auth.currentUser) {
        await reload(auth.currentUser);
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          isEmailVerified: true,
          updatedAt: serverTimestamp()
        });
        // اختيارياً: تسجيل الخروج لإجبار المستخدم على تسجيل دخول نظيف بالبيانات الجديدة
        await signOut(auth);
      }

      setStatus('success');
      setMessage('تم تفعيل بريدك الإلكتروني بنجاح! يرجى تسجيل الدخول الآن للاستمتاع بكافة مميزات المنصة.');
    } catch (error: any) {
      console.error("Verification error:", error);
      setStatus('error');
      setMessage('فشل تفعيل البريد. ربما تم استخدام الرابط مسبقاً أو أنه انتهى.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
        alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
    }
    setStatus('loading');
    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setStatus('success');
      setMessage('تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.');
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء إعادة تعيين كلمة المرور.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        
        {status === 'loading' && (
          <div className="py-12 space-y-4">
            <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto" />
            <p className="text-gray-500 font-bold">جاري معالجة طلبك...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 space-y-6">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-primary">عملية ناجحة ✨</h2>
            <p className="text-gray-600 leading-relaxed">{message}</p>
            <Button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2">
               تسجيل الدخول الآن <LogIn className="w-5 h-5" />
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8 space-y-6">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-primary">عذراً، حدث خطأ</h2>
            <p className="text-gray-600 leading-relaxed">{message}</p>
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl">
              العودة لتسجيل الدخول
            </Button>
          </div>
        )}

        {status === 'reset-password' && (
            <div className="py-8 space-y-6 text-right">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-primary text-center">إعادة تعيين كلمة المرور</h2>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
                        <input 
                            type="password" 
                            required 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <Button type="submit" className="w-full py-4 rounded-2xl">حفظ كلمة المرور الجديدة</Button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default EmailActionHandler;
