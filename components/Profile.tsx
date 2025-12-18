
import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, runTransaction, arrayUnion } from 'firebase/firestore';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  User as UserIcon, Mail, Phone, Save, Loader2, CheckCircle, 
  AlertCircle, Share2, Copy, Gift, Users, Trophy, Sparkles, Globe, Briefcase, MailCheck,
  X
} from 'lucide-react';
import Button from './Button';
import { UserProfile } from '../types';

const { useNavigate, useLocation } = ReactRouterDOM as any;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSent, setIsSent] = useState(false);
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    country: '',
    isEmailVerified: false,
    referralCode: '',
    referralCount: 0,
    referredUsers: []
  });

  const rewardReferrer = async (newUserUid: string, newUserEmail: string, referrerUid: string) => {
    try {
      const referrerRef = doc(db, "users", referrerUid);
      const newUserRef = doc(db, "users", newUserUid);

      await runTransaction(db, async (transaction) => {
        const referrerDoc = await transaction.get(referrerRef);
        const newUserDoc = await transaction.get(newUserRef);

        if (!referrerDoc.exists() || !newUserDoc.exists()) return;

        const userData = newUserDoc.data() as UserProfile;
        // التأكد أن الإحالة لم تعالج من قبل وأن المستخدم مفعل بريده فعلياً
        if (userData.referralProcessed) return;

        // تحديث الداعي
        transaction.update(referrerRef, {
          referralCount: (referrerDoc.data().referralCount || 0) + 1,
          referredUsers: arrayUnion(newUserEmail)
        });

        // تحديث المستخدم الجديد بأنه تمت معالجة إحالته
        transaction.update(newUserRef, {
          referralProcessed: true
        });
      });
      console.log("Referral reward processed successfully");
    } catch (e) {
      console.error("Error processing referral reward:", e);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verify') === 'sent') {
      setIsSent(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            let data = userDoc.data() as UserProfile;
            
            // 1. مزامنة حالة تفعيل البريد
            if (currentUser.emailVerified && !data.isEmailVerified) {
              await updateDoc(userDocRef, { isEmailVerified: true });
              data.isEmailVerified = true;
            }

            // 2. إذا أصبح البريد مفعلاً الآن (أو كان مفعلاً) ولم تُحتسب الإحالة بعد
            if (data.isEmailVerified && data.referredBy && !data.referralProcessed) {
              await rewardReferrer(currentUser.uid, currentUser.email!, data.referredBy);
              // إعادة جلب البيانات بعد التحديث في الترانزاكشن لضمان دقة العدادات محلياً
              const refreshedDoc = await getDoc(userDocRef);
              if (refreshedDoc.exists()) data = refreshedDoc.data() as UserProfile;
            }

            setFormData({
              ...data,
              referralCount: data.referralCount || 0,
              referredUsers: data.referredUsers || []
            });
          }
        } catch (err) {
          setError("حدث خطأ أثناء تحميل بياناتك.");
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, location]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone || '',
        jobTitle: formData.jobTitle || '',
        country: formData.country || '',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("فشل الحفظ. يرجى المحاولة لاحقاً.");
    } finally {
      setSaving(false);
    }
  };

  const getReferralLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#/signup?ref=${formData.referralCode}`;
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const referralGoal = 15;
  const progress = Math.min(((formData.referralCount || 0) / referralGoal) * 100, 100);

  if (loading) return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-accent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {isSent && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl mb-8 flex items-center gap-4 animate-in fade-in zoom-in">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
               <MailCheck className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-emerald-800">تم إرسال رابط التفعيل!</h4>
               <p className="text-emerald-600 text-sm">يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب (افحص الـ Junk أيضاً).</p>
             </div>
             <button onClick={() => setIsSent(false)} className="mr-auto text-emerald-400 hover:text-emerald-600"><X className="w-5 h-5" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-accent to-teal-500 h-32 relative">
                <div className="absolute -bottom-12 right-10 w-24 h-24 bg-white rounded-3xl p-1 shadow-2xl">
                    <div className="w-full h-full bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                      <UserIcon className="w-12 h-12" />
                    </div>
                </div>
              </div>
              
              <form onSubmit={handleSave} className="p-10 pt-16 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">الاسم الكامل</label>
                    <div className="relative">
                      <UserIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full pr-12 pl-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center justify-between">
                      البريد الإلكتروني
                      {formData.isEmailVerified ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> مفعل
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">غير مفعل</span>
                      )}
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-3.5 h-5 w-5 text-gray-300" />
                      <input type="email" readOnly value={formData.email} className="w-full pr-12 pl-5 py-3 rounded-2xl border border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">رقم الهاتف (اختياري)</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full pr-12 pl-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all dir-ltr text-right" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">الدولة (اختياري)</label>
                    <div className="relative">
                      <Globe className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input type="text" value={formData.country} onChange={(e)=>setFormData({...formData, country: e.target.value})} className="w-full pr-12 pl-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">المسمى الوظيفي الحالي (اختياري)</label>
                  <div className="relative">
                    <Briefcase className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text" value={formData.jobTitle} onChange={(e)=>setFormData({...formData, jobTitle: e.target.value})} className="w-full pr-12 pl-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-accent outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {error}</div>}
                  <Button type="submit" className="w-full rounded-2xl py-4 flex justify-center gap-2" disabled={saving}>
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> حفظ جميع التغييرات</>}
                  </Button>
                  {success && <p className="text-center text-emerald-600 font-bold animate-pulse text-sm">تم تحديث بياناتك بنجاح ✨</p>}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                أصدقاؤك الذين انضموا ({(formData.referredUsers || []).length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(formData.referredUsers || []).length > 0 ? (
                    formData.referredUsers?.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">{idx + 1}</div>
                        <span className="text-xs font-medium text-gray-600 dir-ltr">{maskEmail(email)}</span>
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-auto" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-400 text-sm">لا يوجد منضمون حتى الآن. شارك رابطك وابدأ التحدي!</div>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner"><Trophy className="w-7 h-7" /></div>
                <div><h3 className="font-black text-primary">نظام المكافآت</h3><p className="text-xs text-gray-400">ادعُ {referralGoal} أصدقاء لمقابلة مجانية</p></div>
              </div>

              {(formData.referralCount || 0) >= referralGoal ? (
                <div className="mb-8 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl text-white shadow-lg shadow-emerald-200">
                  <div className="flex items-center gap-2 mb-2 font-black"><Sparkles className="w-6 h-6 text-yellow-300" />ألف مبروك!</div>
                  <p className="text-sm font-medium leading-relaxed">لقد وصلت للهدف! أنت الآن مؤهل للحصول على مقابلة مجانية بالكامل.</p>
                </div>
              ) : (
                <div className="mb-8 space-y-3">
                  <div className="flex justify-between items-end"><span className="text-xs font-bold text-gray-500">تقدمك الحالي</span><span className="text-lg font-black text-accent">{formData.referralCount}/{referralGoal}</span></div>
                  <div className="w-full bg-gray-100 h-4 rounded-full p-1 shadow-inner"><div className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div></div>
                  <p className="text-[10px] text-gray-400 text-center">باقي {referralGoal - (formData.referralCount || 0)} أصدقاء فقط!</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 mr-1">كود الإحالة</label>
                  <div className="relative">
                    <div className="w-full bg-gray-50 border border-gray-100 py-3 rounded-2xl text-center font-mono font-bold text-lg text-primary">{formData.referralCode}</div>
                    <button type="button" onClick={() => { navigator.clipboard.writeText(formData.referralCode || ''); setCopyCodeSuccess(true); setTimeout(()=>setCopyCodeSuccess(false), 2000); }} className="absolute left-2 top-2 p-1.5 bg-white shadow-sm border border-gray-100 rounded-xl text-accent">
                      {copyCodeSuccess ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2 mr-1">رابط المشاركة السريع</label>
                  <div className="relative">
                    <input readOnly value={getReferralLink()} className="w-full bg-gray-50 border border-gray-100 py-3 pr-4 pl-12 rounded-2xl text-[10px] text-gray-500 outline-none" />
                    <button type="button" onClick={() => { navigator.clipboard.writeText(getReferralLink()); setCopyLinkSuccess(true); setTimeout(()=>setCopyLinkSuccess(false), 2000); }} className="absolute left-2 top-1.5 p-2 bg-white shadow-sm border border-gray-100 rounded-xl text-accent">
                      {copyLinkSuccess ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
