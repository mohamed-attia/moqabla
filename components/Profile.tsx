import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as ReactRouterDOM from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Briefcase, Globe, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';
import { UserProfile } from '../types';

const { useNavigate } = ReactRouterDOM as any;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    country: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setFormData({
              name: data.name || currentUser.displayName || '',
              email: data.email || currentUser.email || '',
              phone: data.phone || '',
              jobTitle: data.jobTitle || '',
              country: data.country || ''
            });
          } else {
            setFormData({
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: '',
              jobTitle: '',
              country: ''
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("حدث خطأ أثناء تحميل بياناتك.");
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        uid: user.uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("حدث خطأ أثناء حفظ التعديلات.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
        <p className="text-gray-500">جاري تحميل بياناتك...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-4 md:px-6">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">بياناتي الشخصية</h1>
          <p className="text-gray-500">استكمل بياناتك لتحصل على تجربة مخصصة واحترافية</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-accent h-32 relative">
            <div className="absolute -bottom-12 right-10 w-24 h-24 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <UserIcon className="w-12 h-12" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-10 pt-16 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم التليفون (اختياري)</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all dir-ltr text-right"
                    placeholder="+201234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الدولة (اختياري)</label>
                <div className="relative">
                  <Globe className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                    placeholder="مثال: مصر، السعودية"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الوظيفة الحالية (اختياري)</label>
              <div className="relative">
                <Briefcase className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                  placeholder="مثال: Frontend Developer, Senior Manager"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  تم حفظ البيانات بنجاح!
                </div>
              )}

              <Button type="submit" className="w-full justify-center gap-2 py-4" disabled={saving}>
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> حفظ البيانات</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;