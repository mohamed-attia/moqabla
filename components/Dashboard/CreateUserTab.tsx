import React, { useState } from 'react';
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Mail, Lock, Shield, Briefcase, Award, Loader2, CheckCircle, AlertCircle, UserPlus, User } from 'lucide-react';
import Button from '../Button';

const firebaseConfig = {
  apiKey: "AIzaSyCaQr0skV-QlYaIIxOx-FIpG6JeBzDTXOc",
  authDomain: "moqabala-9257a.firebaseapp.com",
  projectId: "moqabala-9257a",
  storageBucket: "moqabala-9257a.appspot.com",
  messagingSenderId: "1038709573170",
  appId: "1:1038709573170:web:15b220fd2e40bb719b5e2b"
};

const CreateUserTab: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'interviewer' | 'maintainer'>('interviewer');
  const [field, setField] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    let secondaryApp;
    try {
      secondaryApp = initializeApp(firebaseConfig, "SecondaryApp_" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;

      const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
      const referralCode = `STAFF${randomStr}`;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email,
        role: role,
        field: field || null,
        level: level || null,
        isEmailVerified: true,
        referralCode: referralCode,
        referralCount: 0,
        referredUsers: [],
        createdAt: serverTimestamp(),
      });

      await signOut(secondaryAuth);
      
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setField('');
      setLevel('');
    } catch (err: any) {
      console.error("Error creating staff user:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("هذا البريد الإلكتروني مستخدم بالفعل.");
      } else {
        setError("حدث خطأ أثناء إنشاء المستخدم.");
      }
    } finally {
      if (secondaryApp) await deleteApp(secondaryApp);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-accent p-6 text-white flex items-center gap-3">
          <UserPlus className="w-6 h-6" />
          <h2 className="text-xl font-bold">إنشاء حساب كادر جديد</h2>
        </div>

        <form onSubmit={handleCreateUser} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم / الكادر <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                placeholder="مثال: أحمد محمد (Frontend Interviewer)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="staff@moqabala.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الصلاحية <span className="text-red-500">*</span></label>
            <div className="relative">
              <Shield className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <select 
                required
                value={role} 
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none appearance-none bg-white"
              >
                <option value="interviewer">محاور (interviewer)</option>
                <option value="admin">مسؤول (admin)</option>
                <option value="maintainer">مشرف (maintainer)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">التخصص (اختياري)</label>
              <div className="relative">
                <Briefcase className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <select 
                  value={field} 
                  onChange={(e) => setField(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none appearance-none bg-white"
                >
                  <option value="">اختر التخصص...</option>
                  <option value="UX">UX</option>
                  <option value="FE">FE</option>
                  <option value="BE">BE</option>
                  <option value="mobile">mobile</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">المستوى (اختياري)</label>
              <div className="relative">
                <Award className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <select 
                  value={level} 
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none appearance-none bg-white"
                >
                  <option value="">اختر المستوى...</option>
                  <option value="junior">مبتدئ</option>
                  <option value="mid-senior">متوسط/خبير</option>
                  <option value="lead-staff">قيادي</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center gap-2 text-sm animate-in zoom-in">
              <CheckCircle className="w-5 h-5" />
              تم إنشاء الكادر بنجاح!
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full py-4 rounded-xl flex justify-center gap-2 shadow-lg hover:shadow-accent/30" 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'حفظ وإنشاء الحساب'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserTab;